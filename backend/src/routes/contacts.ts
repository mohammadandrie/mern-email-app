import { Router, Response } from "express";
import Contact from "../models/Contact";
import { sendEmail } from "../services/email";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

// All routes require auth
router.use(authMiddleware);

// GET all contacts (sorted by date desc)
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find({ createdBy: req.userId }).sort({ date: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET single contact
router.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST create contact
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, date, description } = req.body;

    if (!email || !date || !description) {
      res.status(400).json({ message: "Email, date, and description are required" });
      return;
    }

    const contact = await Contact.create({
      email,
      date: new Date(date),
      description,
      createdBy: req.userId,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// PUT update contact
router.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, date, description } = req.body;
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { email, date: new Date(date), description },
      { new: true }
    );

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// DELETE contact
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST send email to contact
router.post("/:id/send-email", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    const sent = await sendEmail(contact.email);

    if (sent) {
      contact.emailSent = true;
      contact.emailSentAt = new Date();
      await contact.save();
      res.json({ message: `Email sent to ${contact.email}`, contact });
    } else {
      res.status(500).json({ message: "Failed to send email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
