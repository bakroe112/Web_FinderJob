const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy danh sách tất cả công ty (recruiters)
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const { data: recruiters, error } = await supabase
            .from('recruiters')
            .select('*')
            .order('company_name', { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Đếm số jobs mỗi công ty
        const recruitersWithStats = await Promise.all(recruiters.map(async (rec) => {
            const { count } = await supabase
                .from('jobs')
                .select('id', { count: 'exact', head: true })
                .eq('recruiter_id', rec.user_id)
                .eq('job_status', 'Open');

            return {
                ...rec,
                open_jobs: count || 0
            };
        }));

        return res.json({
            success: true,
            data: recruitersWithStats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get all recruiters error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
