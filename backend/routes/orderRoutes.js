const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getAllOrders);
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

module.exports = router;
