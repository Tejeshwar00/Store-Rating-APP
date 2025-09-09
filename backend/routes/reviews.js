const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../controllers/authController'); // Import from your authController

// GET /api/reviews - Get all reviews (with pagination)
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [reviews] = await db.execute(`
            SELECT 
                r.*,
                u.username,
                s.name as store_name,
                s.category as store_category
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        // Get total count for pagination
        const [countResult] = await db.execute('SELECT COUNT(*) as total FROM reviews');
        const totalReviews = countResult[0].total;
        const totalPages = Math.ceil(totalReviews / limit);

        res.json({
            success: true,
            data: reviews,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_reviews: totalReviews,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews'
        });
    }
});

// GET /api/reviews/store/:storeId - Get reviews for specific store
router.get('/store/:storeId', async (req, res) => {
    try {
        const { storeId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Check if store exists
        const [storeCheck] = await db.execute('SELECT id FROM stores WHERE id = ?', [storeId]);
        if (storeCheck.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        const [reviews] = await db.execute(`
            SELECT 
                r.*,
                u.username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [storeId, limit, offset]);

        // Get total count for this store
        const [countResult] = await db.execute(
            'SELECT COUNT(*) as total FROM reviews WHERE store_id = ?', 
            [storeId]
        );
        const totalReviews = countResult[0].total;
        const totalPages = Math.ceil(totalReviews / limit);

        // Get rating summary
        const [ratingStats] = await db.execute(`
            SELECT 
                AVG(rating) as average_rating,
                COUNT(*) as total_reviews,
                SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
                SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
                SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
                SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
                SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
            FROM reviews 
            WHERE store_id = ?
        `, [storeId]);

        res.json({
            success: true,
            data: reviews,
            rating_stats: ratingStats[0],
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_reviews: totalReviews,
                has_next: page < totalPages,
                has_prev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching store reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching store reviews'
        });
    }
});

// GET /api/reviews/user/:userId - Get reviews by specific user (Protected)
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Users can only see their own reviews unless they're admin
        if (req.user.id != userId) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const [reviews] = await db.execute(`
            SELECT 
                r.*,
                s.name as store_name,
                s.category as store_category
            FROM reviews r
            JOIN stores s ON r.store_id = s.id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC
        `, [userId]);

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user reviews'
        });
    }
});

// POST /api/reviews - Create new review (Protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { store_id, rating, comment } = req.body;
        const user_id = req.user.id;

        // Input validation
        if (!store_id || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Store ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if store exists
        const [storeCheck] = await db.execute('SELECT id FROM stores WHERE id = ?', [store_id]);
        if (storeCheck.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Check if user already reviewed this store
        const [existingReview] = await db.execute(
            'SELECT id FROM reviews WHERE store_id = ? AND user_id = ?',
            [store_id, user_id]
        );

        if (existingReview.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this store'
            });
        }

        // Create review
        const [result] = await db.execute(`
            INSERT INTO reviews (store_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
        `, [store_id, user_id, rating, comment]);

        // Get the created review with user info
        const [newReview] = await db.execute(`
            SELECT 
                r.*,
                u.username,
                s.name as store_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE r.id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: newReview[0]
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating review'
        });
    }
});

// PUT /api/reviews/:id - Update review (Protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        // Input validation
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if review exists and belongs to user
        const [existingReview] = await db.execute(
            'SELECT * FROM reviews WHERE id = ?',
            [id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (existingReview[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own reviews'
            });
        }

        // Update review
        await db.execute(`
            UPDATE reviews 
            SET rating = COALESCE(?, rating), comment = COALESCE(?, comment), updated_at = NOW()
            WHERE id = ?
        `, [rating, comment, id]);

        // Get updated review
        const [updatedReview] = await db.execute(`
            SELECT 
                r.*,
                u.username,
                s.name as store_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE r.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview[0]
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating review'
        });
    }
});

// DELETE /api/reviews/:id - Delete review (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if review exists and belongs to user
        const [existingReview] = await db.execute(
            'SELECT * FROM reviews WHERE id = ?',
            [id]
        );

        if (existingReview.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        if (existingReview[0].user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews'
            });
        }

        // Delete review
        await db.execute('DELETE FROM reviews WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting review'
        });
    }
});

// GET /api/reviews/:id - Get single review
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [reviews] = await db.execute(`
            SELECT 
                r.*,
                u.username,
                s.name as store_name,
                s.category as store_category
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN stores s ON r.store_id = s.id
            WHERE r.id = ?
        `, [id]);

        if (reviews.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data: reviews[0]
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching review'
        });
    }
});

module.exports = router;