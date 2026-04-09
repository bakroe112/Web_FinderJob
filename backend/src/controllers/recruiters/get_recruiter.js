const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy thông tin recruiter
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Lấy user info
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("id, email, avatar_url, role")
          .eq("id", user_id)
          .single();

        if (userError || !user) {
            return res.json({
                success: false,
                message: 'Không tìm thấy user'
            });
        }

        // Lấy recruiter info
        const { data: recruiter, error: recruiterError } = await supabase
            .from('recruiters')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (recruiterError || !recruiter) {
            return res.json({
                success: false,
                message: 'Không tìm thấy thông tin recruiter'
            });
        }

        // Đếm số jobs và applications
        const { count: totalJobs } = await supabase
            .from('jobs')
            .select('id', { count: 'exact', head: true })
            .eq('recruiter_id', user_id);

        const { data: jobs } = await supabase
            .from('jobs')
            .select('id')
            .eq('recruiter_id', user_id);

        let totalApplications = 0;
        if (jobs && jobs.length > 0) {
            const jobIds = jobs.map(j => j.id);
            const { count } = await supabase
                .from('applications')
                .select('id', { count: 'exact', head: true })
                .in('job_id', jobIds);
            totalApplications = count || 0;
        }

        return res.json({
            success: true,
            data: {
                ...user,
                ...recruiter,
                total_jobs: totalJobs || 0,
                total_applications: totalApplications
            }
        });

    } catch (error) {
        console.error('Get recruiter error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
