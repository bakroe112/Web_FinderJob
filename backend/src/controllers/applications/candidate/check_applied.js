const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Kiểm tra đã apply job chưa
router.post('/', async (req, res) => {
    try {
        const { user_id, job_id } = req.body;

        if (!user_id || !job_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc job_id'
            });
        }

        const { data: application, error } = await supabase
            .from('applications')
            .select('id, status, applied_at')
            .eq('candidate_id', user_id)
            .eq('job_id', job_id)
            .limit(1);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database: ' + error.message });
        }

        if (application && application.length > 0) {
            return res.json({
                success: true,
                is_applied: true,
                data: application[0]
            });
        }

        return res.json({
            success: true,
            is_applied: false
        });

    } catch (error) {
        console.error('Check application error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
