const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy danh sách notifications
router.post('/', async (req, res) => {
    try {
        const { user_id, page = 1, limit = 20 } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const offset = (page - 1) * limit;

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Đếm số chưa đọc
        const { count: unreadCount } = await supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user_id)
            .eq('is_read', false);

        return res.json({
            success: true,
            data: notifications,
            unread_count: unreadCount || 0,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get notifications error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
