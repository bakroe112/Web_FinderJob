const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Xóa job
router.delete('/:id', async (req, res) => {
    try {
        const { id: job_id } = req.params;

        if (!job_id) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        // Xóa job
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', job_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi xóa job' });
        }

        return res.json({
            success: true,
            message: 'Xóa công việc thành công'
        });

    } catch (error) {
        console.error('Delete job error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
