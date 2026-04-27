const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Đánh dấu tất cả đã đọc
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user_id)
            .eq('is_read', false);

        if (error) {
            return res.json({ success: false, message: 'Lỗi cập nhật' });
        }

        return res.json({
            success: true,
            message: 'Đã đánh dấu tất cả đã đọc'
        });

    } catch (error) {
        console.error('Mark all as read error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
