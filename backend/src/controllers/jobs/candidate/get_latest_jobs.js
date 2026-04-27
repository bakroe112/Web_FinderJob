const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy jobs mới nhất
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const user_id = req.query.user_id;

        // Lấy jobs mới nhất
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('job_status', 'Open')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Lấy thêm thông tin
        const jobsWithDetails = await Promise.all(jobs.map(async (job) => {
            const { data: recruiter } = await supabase
                .from('recruiters')
                .select('company_name, logo_url')
                .eq('user_id', job.recruiter_id)
                .single();

            let isSaved = false;
            if (user_id) {
                const { data: savedJob } = await supabase
                    .from('job_saved')
                    .select('id')
                    .eq('user_id', user_id)
                    .eq('job_id', job.id)
                    .limit(1);
                isSaved = savedJob && savedJob.length > 0 ? true : false;
            }

            return {
                ...job,
                company_name: recruiter?.company_name || '',
                logo_url: recruiter?.logo_url || '',
                isSaved: isSaved
            };
        }));

        return res.json({
            success: true,
            data: jobsWithDetails
        });

    } catch (error) {
        console.error('Get latest jobs error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
