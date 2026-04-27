const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy danh sách jobs đã lưu
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Lấy danh sách saved jobs
        const { data: savedJobs, error } = await supabase
            .from('job_saved')
            .select('job_id')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        if (!savedJobs || savedJobs.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Lấy chi tiết jobs
        const jobIds = savedJobs.map(s => s.job_id);
        const { data: jobs } = await supabase
            .from('jobs')
            .select('*')
            .in('id', jobIds);

        // Lấy thêm thông tin
        const jobsWithDetails = await Promise.all(jobs.map(async (job) => {
            const { data: recruiter } = await supabase
                .from('recruiters')
                .select('company_name, logo_url')
                .eq('user_id', job.recruiter_id)
                .single();

            return {
                ...job,
                company_name: recruiter?.company_name || '',
                logo_url: recruiter?.logo_url || '',
                isSaved: true
            };
        }));

        return res.json({
            success: true,
            data: jobsWithDetails
        });

    } catch (error) {
        console.error('Get saved jobs error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
