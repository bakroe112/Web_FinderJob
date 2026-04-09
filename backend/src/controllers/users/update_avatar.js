const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Cập nhật avatar user
router.post('/', async (req, res) => {
    try {
        const { user_id, avatar_url } = req.body;

        if (!user_id || !avatar_url) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc avatar_url'
            });
        }

        const { error } = await supabase
            .from('users')
            .update({ avatar_url: avatar_url })
            .eq('id', user_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi cập nhật avatar' });
        }

        return res.json({
            success: true,
            message: 'Cập nhật avatar thành công'
        });

    } catch (error) {
        console.error('Update avatar error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
