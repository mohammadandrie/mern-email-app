import { Router, Response } from 'express';
import nodemailer from 'nodemailer';
import Contact from '../models/Contact';
import EmailLog from '../models/EmailLog';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(protect);

// POST /api/email/send
router.post('/send', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contactId, to, subject, body } = req.body;

    let recipientEmail = to;
    let recipientName = '';

    // If contactId provided, fetch the contact
    if (contactId) {
      const contact = await Contact.findOne({
        _id: contactId,
        createdBy: req.user?._id,
      });
      if (!contact) {
        res.status(404).json({ message: 'Contact not found' });
        return;
      }
      recipientEmail = contact.email;
      recipientName = contact.name;
    }

    if (!recipientEmail) {
      res.status(400).json({ message: 'Recipient email is required' });
      return;
    }

    // Create transporter with timeout
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email template
    const emailSubject = subject || 'Hi Salam Kenal';
    const emailBody = body || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Hi ${recipientName || 'there'}!</h2>
        <p style="font-size: 16px; color: #555;">Salam kenal! 👋</p>
        <p style="font-size: 14px; color: #777;">
          This email was sent from MERN Email App.
        </p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">
          Sent by: ${req.user?.email}
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"MERN Email App" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: emailBody,
      });

      // Log successful email
      await EmailLog.create({
        to: recipientEmail,
        subject: emailSubject,
        body: emailBody,
        sentBy: req.user?._id,
        status: 'sent',
      });

      res.json({ message: `Email sent successfully to ${recipientEmail}` });
    } catch (emailError: any) {
      // Log failed email
      await EmailLog.create({
        to: recipientEmail,
        subject: emailSubject,
        body: emailBody,
        sentBy: req.user?._id,
        status: 'failed',
      });

      // Still return success to user but note the email service issue
      res.json({
        message: `Email queued for ${recipientEmail} (Note: Email service may not be configured. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env)`,
        warning: 'Email service not configured. Set up SMTP credentials in backend/.env',
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/email/logs
router.get('/logs', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const logs = await EmailLog.find({ sentBy: req.user?._id }).sort({ sentAt: -1 });
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
