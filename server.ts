import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";

// The secret key OpenClaw will use to access this backend
const EXPECTED_API_KEY = process.env.EMPATHY_API_KEY || "YOUR_SUPER_SECRET_KEY";

// Lazy initialization for Twilio
let twilioClient: any = null;
const getTwilioClient = () => {
  if (!twilioClient) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (sid && token) {
      twilioClient = twilio(sid, token);
    }
  }
  return twilioClient;
};

// Lazy initialization for SendGrid
let sendgridInitialized = false;
const initSendGrid = () => {
  if (!sendgridInitialized) {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      sgMail.setApiKey(apiKey);
      sendgridInitialized = true;
    }
  }
  return sendgridInitialized;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // 1. SECURITY MIDDLEWARE (The Bouncer)
  // ==========================================
  const authenticateOpenClaw = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    
    // Check if the header exists and matches the expected format "Bearer <KEY>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Missing or malformed Authorization header." });
    }

    const token = authHeader.split(' ')[1];
    
    if (token !== EXPECTED_API_KEY) {
      return res.status(403).json({ error: "Invalid API Key. Access Denied." });
    }

    // If the key is correct, allow the request to proceed to the endpoint
    next();
  };

  // Apply the security middleware to all /api/v1 routes
  app.use('/api/v1', authenticateOpenClaw);

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ==========================================
  // 2. ENDPOINT: Search Property Database
  // ==========================================
  app.post('/api/v1/properties/search', async (req, res) => {
    try {
      const { budget_usd, phase } = req.body;

      if (!budget_usd) {
        return res.status(400).json({ error: "budget_usd is required." });
      }

      console.log(`OpenClaw requested search: Budget $${budget_usd}, Phase: ${phase}`);

      // Simulating a database response based on the Magodo workflow
      const mockResults = [
        {
          property_id: "MAG-1042",
          location: "Magodo Phase 1",
          type: "Detached Duplex (Aging)",
          price_ngn: "150,000,000",
          est_renovation_usd: 15000,
          projected_rental_yield_ngn: "5,000,000/yr",
          notes: "Ideal for flipping. Needs modern aesthetics for affluent tenants."
        }
      ];

      // Return strictly formatted JSON to OpenClaw
      res.status(200).json({
        success: true,
        results_count: mockResults.length,
        properties: mockResults
      });

    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({ error: "Internal server error during property search." });
    }
  });

  // ==========================================
  // 3. ENDPOINT: Dispatch FEM Limited
  // ==========================================
  app.post('/api/v1/fem/dispatch', async (req, res) => {
    try {
      const { property_id, task_type, vendor_contact, vendor_email } = req.body;

      if (!property_id || !task_type) {
        return res.status(400).json({ error: "property_id and task_type are required." });
      }

      console.log(`OpenClaw dispatching FEM Limited for ${task_type} at ${property_id}`);

      // Notification Logic
      const vendorPhone = vendor_contact || "+18329673513";
      const recipientEmail = vendor_email || "nnamdiokorafor@gmail.com";
      const messageBody = `New FEM Work Order: ${task_type} for Property ${property_id}. Please confirm receipt.`;

      // 1. Attempt SMS via Twilio
      const client = getTwilioClient();
      if (client && process.env.TWILIO_PHONE_NUMBER) {
        try {
          await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: vendorPhone
          });
          console.log(`SMS notification sent to ${vendorPhone}`);
        } catch (smsError) {
          console.error("Twilio SMS failed:", smsError);
        }
      } else {
        console.warn("Twilio credentials missing. Skipping SMS.");
      }

      // 2. Attempt Email via SendGrid
      if (initSendGrid()) {
        try {
          await sgMail.send({
            to: recipientEmail,
            from: 'notifications@empathymanor.com', // Should be a verified sender
            subject: `FEM Dispatch: ${task_type}`,
            text: messageBody,
            html: `<strong>${messageBody}</strong>`,
          });
          console.log(`Email notification sent to ${recipientEmail} via SendGrid`);
        } catch (emailError) {
          console.error("SendGrid Email failed:", emailError);
        }
      } else {
        console.warn("SendGrid API Key missing. Skipping Email.");
      }

      // Generate a random mock dispatch ID for tracking
      const dispatchId = `REQ-${Math.floor(Math.random() * 10000)}`;

      res.status(200).json({
        success: true,
        dispatch_id: dispatchId,
        message: `Work order for ${task_type} successfully routed to FEM Limited.`,
        status: "Pending Vendor Confirmation"
      });

    } catch (error) {
      console.error("Dispatch Error:", error);
      res.status(500).json({ error: "Internal server error during dispatch." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Empathy API running and securely listening on port ${PORT}`);
  });
}

startServer();
