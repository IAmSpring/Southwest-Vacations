import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { extractUserId } from '../auth.js';

// Define the promotion interface
interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  restrictions: string;
  status: 'active' | 'expired' | 'upcoming';
  eligibleDestinations?: string[];
  minBookingValue?: number;
  createdAt: string;
  createdBy?: string;
}

const router = express.Router();

// Get all promotions
router.get('/', (req: Request, res: Response) => {
  try {
    // Get status filter if provided
    const { status } = req.query;

    let promotions = db.get('promotions').value() as Promotion[];

    // Apply status filter if provided
    if (status && ['active', 'expired', 'upcoming'].includes(status as string)) {
      promotions = promotions.filter(promo => promo.status === status);
    }

    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get promotion by code
router.get('/code/:code', (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const promotion = db.get('promotions').find({ code: code.toUpperCase() }).value() as
      | Promotion
      | undefined;

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    res.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion by code:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new promotion
router.post('/', (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user to check if admin
    const user = db.get('users').find({ id: userId }).value();
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      restrictions,
      eligibleDestinations,
      minBookingValue,
    } = req.body;

    // Validate required fields
    if (!code || !description || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine status based on dates
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    let status: 'active' | 'expired' | 'upcoming';
    if (now < start) {
      status = 'upcoming';
    } else if (now > end) {
      status = 'expired';
    } else {
      status = 'active';
    }

    // Create new promotion
    const newPromotion: Promotion = {
      id: uuidv4(),
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      restrictions,
      status,
      eligibleDestinations,
      minBookingValue,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    // Add to database
    db.get('promotions').push(newPromotion).write();

    res.status(201).json(newPromotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update promotion
router.put('/:id', (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    const { id } = req.params;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user to check if admin
    const user = db.get('users').find({ id: userId }).value();
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Find promotion
    const promotion = db.get('promotions').find({ id }).value() as Promotion | undefined;

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      restrictions,
      status,
      eligibleDestinations,
      minBookingValue,
    } = req.body;

    // Update promotion
    const updatedPromotion = {
      ...promotion,
      code: code ? code.toUpperCase() : promotion.code,
      description: description || promotion.description,
      discountType: discountType || promotion.discountType,
      discountValue: discountValue || promotion.discountValue,
      startDate: startDate || promotion.startDate,
      endDate: endDate || promotion.endDate,
      restrictions: restrictions || promotion.restrictions,
      status: status || promotion.status,
      eligibleDestinations: eligibleDestinations || promotion.eligibleDestinations,
      minBookingValue: minBookingValue || promotion.minBookingValue,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    db.get('promotions').find({ id }).assign(updatedPromotion).write();

    res.json(updatedPromotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete promotion
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const userId = extractUserId(req);
    const { id } = req.params;

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get user to check if admin
    const user = db.get('users').find({ id: userId }).value();
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Find promotion
    const promotion = db.get('promotions').find({ id }).value() as Promotion | undefined;

    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }

    // Remove from database
    db.get('promotions').remove({ id }).write();

    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
