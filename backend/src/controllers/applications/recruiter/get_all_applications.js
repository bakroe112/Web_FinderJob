const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy tất cả applications của recruiter
router.post('/', async (req, res) => {
    try {
        const { recruiter_id, page = 1, limit = 20 } = req.body;

        if (!recruiter_id) {
            return res.json({
                success: false,
                message: 'Thiếu recruiter_id'
            });
        }

        // Lấy tất cả jobs của recruiter
        const { data: jobs, error: jobsError } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('recruiter_id', recruiter_id);

        if (jobsError || !jobs || jobs.length === 0) {
            return res.json({
                success: true,
                data: [],
                pagination: { page: parseInt(page), limit: parseInt(limit) }
            });
        }

        const jobIds = jobs.map(j => j.id);
        const offset = (page - 1) * limit;

        let query = supabase
            .from('applications')
            .select('*')
            .in('job_id', jobIds);

        query = query.range(offset, offset + limit - 1);

        const { data: applications, error } = await query;

        if (error) {
            console.error('Applications query error:', error);
            return res.json({ success: false, message: 'Lỗi database: ' + error.message });
        }

        if (!applications || applications.length === 0) {
            return res.json({
                success: true,
                data: [],
                pagination: { page: parseInt(page), limit: parseInt(limit) }
            });
        }

        // Lấy thêm thông tin
        let applicationsWithDetails = [];
        for (const app of applications) {
            const job = jobs.find(j => j.id === app.job_id);

            // Get user info
            const { data: user } = await supabase
                .from('users')
                .select('email, avatar_url')
                .eq('id', app.candidate_id)
                .single();

            // Get candidate info (full_name)
            const { data: candidate } = await supabase
                .from('candidates')
                .select('full_name')
                .eq('user_id', app.candidate_id)
                .single();

            applicationsWithDetails.push({
                ...app,
                job_title: job?.title || '',
                candidate_name: candidate?.full_name || 'N/A',
                candidate_email: user?.email || '',
                candidate_avatar: user?.avatar_url || ''
            });
        }

        return res.json({
            success: true,
            data: applicationsWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get all applications error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
