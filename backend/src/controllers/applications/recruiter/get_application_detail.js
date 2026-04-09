const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy chi tiết 1 application
router.post('/', async (req, res) => {
    try {
        const { recruiter_id, application_id } = req.body;

        if (!recruiter_id || !application_id) {
            return res.json({
                success: false,
                message: 'Thiếu recruiter_id hoặc application_id'
            });
        }

        // Lấy application
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', application_id)
            .single();

        if (appError || !application) {
            return res.json({
                success: false,
                message: 'Không tìm thấy application'
            });
        }

        // Kiểm tra quyền (job thuộc recruiter này)
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('id', application.job_id)
            .eq('recruiter_id', recruiter_id)
            .single();

        if (jobError || !job) {
            return res.json({
                success: false,
                message: 'Không có quyền xem application này'
            });
        }

        // Lấy thông tin user
        const { data: user } = await supabase
            .from('users')
            .select('full_name, email, phone, avatar_url')
            .eq('id', application.candidate_id)
            .single();

        // Lấy thông tin candidate
        const { data: candidate } = await supabase
            .from('candidates')
            .select('*')
            .eq('user_id', application.candidate_id)
            .single();

        // Lấy skills
        const { data: userSkills } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', application.candidate_id);

        let skillNames = [];
        if (userSkills && userSkills.length > 0) {
            const skillIds = userSkills.map(s => s.skill_id);
            const { data: skills } = await supabase
                .from('skills')
                .select('name')
                .in('id', skillIds);
            skillNames = skills?.map(s => s.name) || [];
        }

        return res.json({
            success: true,
            data: {
                ...application,
                job_title: job.title,
                full_name: user?.full_name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                avatar_url: user?.avatar_url || '',
                education: candidate?.education || '',
                experience: candidate?.experience || '',
                bio: candidate?.bio || '',
                skills: skillNames
            }
        });

    } catch (error) {
        console.error('Get application detail error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
