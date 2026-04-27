const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Xóa notification
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
            .delete()
            .eq('id', notification_id)
            .eq('user_id', user_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi xóa' });
        }

        return res.json({
            success: true,
            message: 'Đã xóa thông báo'
        });

    } catch (error) {
        console.error('Delete notification error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
