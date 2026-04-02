import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY is not set in environment variables.');
}

// Ensure data is processed in the EU region
sgMail.setDataResidency('eu');

export default sgMail;
