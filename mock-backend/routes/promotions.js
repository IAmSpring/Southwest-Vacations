"use strict";
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db.js';
import { extractUserId } from '../auth.js';

const router = express.Router();

// Get all promotions
router.get('/', async (req, res) => {
  try {
    await db.read();
    const promotions = db.data.promotions || [];
    res.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    res.status(500).json({ error: 'Failed to retrieve promotions' });
  }
});

// Get promotion by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();
    
    const promotion = db.data.promotions.find(p => p.id === id);
    if (!promotion) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    res.json(promotion);
  } catch (error) {
    console.error('Error fetching promotion:', error);
    res.status(500).json({ error: 'Failed to retrieve promotion' });
  }
});

// Create new promotion
router.post('/', async (req, res) => {
  try {
    const { code, description, discountType, discountValue, startDate, endDate } = req.body;
    
    // Basic validation
    if (!code || !description || !discountType || !discountValue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await db.read();
    
    // Check for duplicate codes
    const existingPromo = db.data.promotions.find(p => 
      p.code.toLowerCase() === code.toLowerCase()
    );
    
    if (existingPromo) {
      return res.status(400).json({ error: 'Promotion code already exists' });
    }
    
    const newPromotion = {
      id: uuidv4(),
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      startDate,
      endDate,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    db.data.promotions.push(newPromotion);
    await db.write();
    
    res.status(201).json(newPromotion);
  } catch (error) {
    console.error('Error creating promotion:', error);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

// Update promotion
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();
    
    const promoIndex = db.data.promotions.findIndex(p => p.id === id);
    if (promoIndex === -1) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    const currentPromo = db.data.promotions[promoIndex];
    const updatedPromo = {
      ...currentPromo,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.data.promotions[promoIndex] = updatedPromo;
    await db.write();
    
    res.json(updatedPromo);
  } catch (error) {
    console.error('Error updating promotion:', error);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

// Delete promotion
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.read();
    
    const initialLength = db.data.promotions.length;
    db.data.promotions = db.data.promotions.filter(p => p.id !== id);
    
    if (db.data.promotions.length === initialLength) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    
    await db.write();
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

export default router; 