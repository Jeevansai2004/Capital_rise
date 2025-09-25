const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../config/database');

const router = express.Router();

// Get referral details
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const db = await connectToDatabase();
    const investment = await db.collection('investments').findOne({ referral_code: code });
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Referral link not found or invalid'
      });
    }

    const loot = await db.collection('loots').findOne({ _id: investment.loot_id });
    const client = await db.collection('users').findOne({ _id: investment.user_id });
    if (!loot || !loot.is_active) {
      return res.status(400).json({
        success: false,
        message: 'This investment opportunity is no longer available'
      });
    }

    res.json({
      success: true,
      data: {
        loot_title: loot.title,
        loot_description: loot.description,
        max_amount: loot.max_amount,
        client_name: client?.username || 'Client',
        referral_code: code
      }
    });
  } catch (error) {
    console.error('Get referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Submit referral form (UPI ID and redirect)
router.post('/submit', async (req, res) => {
  try {
    const { referral_code, upi_id, customer_name, customer_mobile } = req.body;

    // Validation
    if (!referral_code || !upi_id || !customer_name || !customer_mobile) {
      return res.status(400).json({
        success: false,
        message: 'Referral code, UPI ID, customer name, and mobile number are required'
      });
    }

    if (!customer_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name cannot be empty'
      });
    }

    if (!customer_mobile.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number cannot be empty'
      });
    }

    if (!upi_id.trim()) {
      return res.status(400).json({
        success: false,
        message: 'UPI ID cannot be empty'
      });
    }
    const db = await connectToDatabase();
    const investment = await db.collection('investments').findOne({ referral_code });
    const loot = investment ? await db.collection('loots').findOne({ _id: investment.loot_id }) : null;

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Invalid referral code'
      });
    }

    // Check if loot is still active
    if (!loot || !loot.is_active) {
      return res.status(400).json({
        success: false,
        message: 'This investment opportunity is no longer available'
      });
    }

    // Create referral record with pending status
    const insertResult = await db.collection('referrals').insertOne({
      investment_id: investment._id,
      user_id: investment.user_id,
      customer_upi: upi_id.trim(),
      amount: investment.amount,
      earn_amount: investment.earn_amount,
      redirect_url: loot.redirect_url,
      status: 'pending',
      created_at: new Date()
    });

    // Save customer data to client_customers collection with pending status
    await db.collection('client_customers').insertOne({
      client_id: investment.user_id,
      loot_id: investment.loot_id,
      investment_id: investment._id,
      customer_upi: upi_id.trim(),
      customer_name: customer_name.trim(),
      customer_mobile: customer_mobile.trim(),
      amount: investment.amount,
      status: 'pending',
      created_at: new Date()
    });

    const referral = await db.collection('referrals').findOne({ _id: insertResult.insertedId });

    res.json({
      success: true,
      message: 'Referral submitted successfully! Redirecting to investment opportunity.',
      data: {
        referral,
        loot_title: loot.title,
        status: 'pending',
        redirect_url: loot.redirect_url
      }
    });
  } catch (error) {
    console.error('Submit referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get referral statistics (for public display)
router.get('/stats/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const db = await connectToDatabase();
    const investment = await db.collection('investments').findOne({ referral_code: code });
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Referral link not found'
      });
    }

    const loot = await db.collection('loots').findOne({ _id: investment.loot_id });
    const statsAgg = await db.collection('referrals').aggregate([
      { $match: { investment_id: investment._id, status: 'completed' } },
      { $group: { _id: null, total_referrals: { $sum: 1 }, total_amount: { $sum: '$amount' } } }
    ]).toArray();
    const totals = statsAgg[0] || { total_referrals: 0, total_amount: 0 };

    res.json({
      success: true,
      data: {
        referral_code: investment.referral_code,
        loot_title: loot?.title || '',
        total_referrals: totals.total_referrals || 0,
        total_amount: totals.total_amount || 0,
        investment_amount: investment.amount
      }
    });
  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const db = await connectToDatabase();
    const investment = await db.collection('investments').findOne({ referral_code: code });
    if (!investment) {
      return res.json({
        success: false,
        valid: false,
        message: 'Invalid referral code'
      });
    }

    const loot = await db.collection('loots').findOne({ _id: investment.loot_id });
    if (!loot || !loot.is_active) {
      return res.json({
        success: false,
        valid: false,
        message: 'This investment opportunity is no longer available'
      });
    }

    res.json({
      success: true,
      valid: true,
      data: {
        loot_title: loot.title
      }
    });
  } catch (error) {
    console.error('Validate referral error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 