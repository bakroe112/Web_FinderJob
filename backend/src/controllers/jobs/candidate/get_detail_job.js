const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy chi tiết job
router.get('/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const user_id = req.query.user_id;

        if (!jobId) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        // Lấy thông tin job
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (jobError || !job) {
            return res.json({
                success: false,
                message: 'Không tìm thấy công việc'
            });
        }

        // Lấy thông tin recruiter
        const { data: recruiter } = await supabase
            .from('recruiters')
            .select('*')
            .eq('user_id', job.recruiter_id)
            .single();

        // Lấy tên field
        let field_name = null;
        if (job.field_id) {
            const { data: field } = await supabase
                .from('job_fields')
                .select('name')
                .eq('id', job.field_id)
                .single();
            field_name = field?.name || null;
        }

        // Kiểm tra đã lưu job chưa
        let isSaved = false;
        if (user_id) {
            const { data: savedJob } = await supabase
                .from('job_saved')
                .select('id')
                .eq('user_id', user_id)
                .eq('job_id', jobId)
                .limit(1);
            isSaved = savedJob && savedJob.length > 0 ? true : false;
        }

        // Đếm tổng ứng viên
        const { count: total_applicants } = await supabase
            .from('applications')
            .select('id', { count: 'exact', head: true })
            .eq('job_id', jobId);

        return res.json({
            success: true,
            data: {
                ...job,
                field_name: field_name,
                company_name: recruiter?.company_name || '',
                logo_url: recruiter?.logo_url || '',
                company_description: recruiter?.description || '',
                company_location: recruiter?.location || '',
                company_website: recruiter?.website || '',
                company_size: recruiter?.size || '',
                isSaved: isSaved,
                total_applicants: total_applicants || 0
            }
        });

    } catch (error) {
        console.error('Get detail job error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
