import { Router, Response } from 'express';
import Contact from '../models/Contact';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes are protected
router.use(protect);

// GET /api/contacts
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.find({ createdBy: req.user?._id }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/contacts
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      createdBy: req.user?._id,
    });

    res.status(201).json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/contacts/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      createdBy: req.user?._id,
    });

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/contacts/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user?._id },
      { name, email, phone },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.json(contact);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user?._id,
    });

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
