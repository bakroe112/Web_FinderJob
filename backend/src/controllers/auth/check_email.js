const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: 'Thiếu email'
            });
        }

        // Kiểm tra email có tồn tại không
        const { data: users, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .limit(1);

        if (error) {
            return res.json({
                success: false,
                message: 'Lỗi database'
            });
        }

        return res.json({
            success: true,
            exists: users && users.length > 0
        });

    } catch (error) {
        console.error('Check email error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
