const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy danh sách skills
router.get('/', async (req, res) => {
    try {
        const { data: skills, error } = await supabase
            .from('skills')
            .select('id, name, category')
            .order('category', { ascending: true })
            .order('name', { ascending: true });

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        return res.json({
            success: true,
            data: skills
        });

    } catch (error) {
        console.error('Get skills error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
