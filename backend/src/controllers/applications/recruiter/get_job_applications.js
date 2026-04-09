const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy danh sách ứng viên của 1 job
router.post('/', async (req, res) => {
    try {
        const { recruiter_id, job_id, status, page = 1, limit = 20 } = req.body;

        if (!recruiter_id || !job_id) {
            return res.json({
                success: false,
                message: 'Thiếu recruiter_id hoặc job_id'
            });
        }

        // Kiểm tra quyền sở hữu job
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id')
            .eq('id', job_id)
            .eq('recruiter_id', recruiter_id)
            .single();

        if (jobError || !job) {
            return res.json({
                success: false,
                message: 'Không tìm thấy job hoặc không có quyền'
            });
        }

        const offset = (page - 1) * limit;

        let query = supabase
            .from('applications')
            .select('*')
            .eq('job_id', job_id)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data: applications, error } = await query;

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Lấy thông tin candidate
        const applicationsWithDetails = await Promise.all(applications.map(async (app) => {
            // Lấy user info
            const { data: user } = await supabase
                .from('users')
                .select('full_name, email, phone, avatar_url')
                .eq('id', app.candidate_id)
                .single();

            // Lấy candidate info
            const { data: candidate } = await supabase
                .from('candidates')
                .select('*')
                .eq('user_id', app.candidate_id)
                .single();

            return {
                ...app,
                full_name: user?.full_name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                avatar_url: user?.avatar_url || '',
                education: candidate?.education || '',
                experience: candidate?.experience || '',
                skills: candidate?.skills || ''
            };
        }));

        return res.json({
            success: true,
            data: applicationsWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get job applications error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
