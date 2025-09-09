const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { verifyToken } = require('../controllers/authController'); // Import from your authController
const upload = require('../middleware/upload'); // You'll need to create this for image uploads

// GET /api/stores - Get all stores with ratings
router.get('/', async (req, res) => {
    try {
        const [stores] = await db.execute(`
            SELECT 
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating,
                COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            GROUP BY s.id
            ORDER BY s.created_at DESC
        `);
        
        res.json({
            success: true,
            data: stores
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stores'
        });
    }
});

// GET /api/stores/:id - Get single store with details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get store details with average rating
        const [stores] = await db.execute(`
            SELECT 
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating,
                COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            WHERE s.id = ?
            GROUP BY s.id
        `, [id]);

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Get recent reviews for this store
        const [reviews] = await db.execute(`
            SELECT 
                r.*,
                u.username
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
            ORDER BY r.created_at DESC
            LIMIT 10
        `, [id]);

        res.json({
            success: true,
            data: {
                store: stores[0],
                recent_reviews: reviews
            }
        });
    } catch (error) {
        console.error('Error fetching store:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching store details'
        });
    }
});

// POST /api/stores - Create new store (Protected route)
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { name, description, address, category } = req.body;
        
        // Input validation
        if (!name || !address || !category) {
            return res.status(400).json({
                success: false,
                message: 'Name, address, and category are required'
            });
        }

        // Handle image upload
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await db.execute(`
            INSERT INTO stores (name, description, address, category, image_url, created_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, address, category, image_url, req.user.id]);

        // Get the created store
        const [newStore] = await db.execute(
            'SELECT * FROM stores WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Store created successfully',
            data: newStore[0]
        });
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating store'
        });
    }
});

// PUT /api/stores/:id - Update store (Protected route)
router.put('/:id', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, address, category } = req.body;

        // Check if store exists
        const [existingStore] = await db.execute('SELECT * FROM stores WHERE id = ?', [id]);
        if (existingStore.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Handle image upload
        const image_url = req.file ? `/uploads/${req.file.filename}` : existingStore[0].image_url;

        await db.execute(`
            UPDATE stores 
            SET name = ?, description = ?, address = ?, category = ?, image_url = ?, updated_at = NOW()
            WHERE id = ?
        `, [name, description, address, category, image_url, id]);

        // Get updated store
        const [updatedStore] = await db.execute('SELECT * FROM stores WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Store updated successfully',
            data: updatedStore[0]
        });
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating store'
        });
    }
});

// DELETE /api/stores/:id - Delete store (Protected route)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if store exists
        const [existingStore] = await db.execute('SELECT * FROM stores WHERE id = ?', [id]);
        if (existingStore.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Delete store (reviews will be deleted automatically due to CASCADE)
        await db.execute('DELETE FROM stores WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Store deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting store:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting store'
        });
    }
});

// GET /api/stores/search/:query - Search stores
router.get('/search/:query', async (req, res) => {
    try {
        const { query } = req.params;
        
        const [stores] = await db.execute(`
            SELECT 
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating,
                COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            WHERE s.name LIKE ? OR s.category LIKE ? OR s.address LIKE ?
            GROUP BY s.id
            ORDER BY s.name
        `, [`%${query}%`, `%${query}%`, `%${query}%`]);

        res.json({
            success: true,
            data: stores
        });
    } catch (error) {
        console.error('Error searching stores:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching stores'
        });
    }
});

// GET /api/stores/category/:category - Get stores by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const [stores] = await db.execute(`
            SELECT 
                s.*,
                ROUND(AVG(r.rating), 1) as average_rating,
                COUNT(r.id) as review_count
            FROM stores s 
            LEFT JOIN reviews r ON s.id = r.store_id 
            WHERE s.category = ?
            GROUP BY s.id
            ORDER BY average_rating DESC
        `, [category]);

        res.json({
            success: true,
            data: stores
        });
    } catch (error) {
        console.error('Error fetching stores by category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stores by category'
        });
    }
});

module.exports = router;