const sgMail = require('@sendgrid/mail');

// Check if API key is present
if (!process.env.SENDGRID_API_KEY) {
  console.error("Error: SENDGRID_API_KEY is not set in .env.local");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Data residency EU is configured here
sgMail.setDataResidency('eu'); 

// 🛑 IMPORTANT: Update these emails before running!
// 'from' must be a Sender Identity verified in your SendGrid account.
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Empathy Manor: Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Email sent successfully!');
  })
  .catch((error) => {
    console.error('❌ Failed to send email.');
    console.error(error);
    
    if (error.response) {
      console.error(error.response.body);
    }
  });
