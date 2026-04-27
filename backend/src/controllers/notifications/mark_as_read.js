const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Đánh dấu đã đọc 1 notification
router.post('/', async (req, res) => {
    try {
        const { user_id, notification_id } = req.body;

        if (!user_id || !notification_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc notification_id'
            });
        }

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notification_id)
            .eq('user_id', user_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi cập nhật' });
        }

        return res.json({
            success: true,
            message: 'Đã đánh dấu đã đọc'
        });

    } catch (error) {
        console.error('Mark as read error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
