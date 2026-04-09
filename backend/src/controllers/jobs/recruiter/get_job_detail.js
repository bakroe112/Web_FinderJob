const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy chi tiết job cho recruiter
router.get('/:id', async (req, res) => {
    try {
        const { id: job_id } = req.params;

        if (!job_id) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        // Lấy job
        const { data: job, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', job_id)
            .single();

        if (error || !job) {
            return res.json({
                success: false,
                message: 'Không tìm thấy job hoặc không có quyền'
            });
        }

        // Lấy field_name
        let field_name = null;
        if (job.field_id) {
            const { data: field } = await supabase
                .from('job_fields')
                .select('name')
                .eq('id', job.field_id)
                .single();
            field_name = field?.name || null;
        }

        // Đếm ứng viên theo trạng thái
        const { data: applications } = await supabase
            .from('applications')
            .select('status')
            .eq('job_id', job_id);

        let stats = {
            total: applications?.length || 0,
            pending: 0,
            reviewed: 0,
            accepted: 0,
            rejected: 0
        };

        if (applications) {
            applications.forEach(app => {
                if (app.status === 'Pending') stats.pending++;
                else if (app.status === 'Reviewed') stats.reviewed++;
                else if (app.status === 'Accepted') stats.accepted++;
                else if (app.status === 'Rejected') stats.rejected++;
            });
        }

        return res.json({
            success: true,
            data: {
                ...job,
                field_name: field_name,
                application_stats: stats
            }
        });

    } catch (error) {
        console.error('Get job detail error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
