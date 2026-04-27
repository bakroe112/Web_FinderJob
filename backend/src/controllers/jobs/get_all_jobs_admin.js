const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy tất cả jobs (cho admin)
router.get('/', async (req, res) => {
    try {
        const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({
                success: false,
                message: 'Lỗi database'
            });
        }

        // Lấy thêm thông tin recruiter
        const jobsWithDetails = await Promise.all(
            (jobs || []).map(async (job) => {
                const { data: recruiter } = await supabase
                    .from('recruiters')
                    .select('company_name, logo_url')
                    .eq('user_id', job.recruiter_id)
                    .single();

                return {
                    ...job,
                    company_name: recruiter?.company_name || 'N/A',
                    logo_url: recruiter?.logo_url || '',
                    status: job.job_status,
                    location: job.work_location
                };
            })
        );

        res.json({
            success: true,
            total: jobsWithDetails.length,
            data: jobsWithDetails
        });
    } catch (error) {
        console.error('Get all jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
