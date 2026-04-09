const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy thông tin user hiện tại
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, email, full_name, phone, avatar_url, role, created_at')
            .eq('id', user_id)
            .single();

        if (error || !user) {
            return res.json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        return res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
