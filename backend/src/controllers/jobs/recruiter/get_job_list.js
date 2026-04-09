const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy danh sách jobs của recruiter
router.post('/', async (req, res) => {
    try {
        const { recruiter_id, job_status, page = 1, limit = 20 } = req.body;

        if (!recruiter_id) {
            return res.json({
                success: false,
                message: 'Thiếu recruiter_id'
            });
        }

        const offset = (page - 1) * limit;

        let query = supabase
            .from('jobs')
            .select('*')
            .eq('recruiter_id', recruiter_id)
            .order('created_at', { ascending: false });

        if (job_status) {
            query = query.eq('job_status', job_status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data: jobs, error } = await query;

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Lấy thêm field_name và số ứng viên
        const jobsWithDetails = await Promise.all(jobs.map(async (job) => {
            let field_name = null;
            if (job.field_id) {
                const { data: field } = await supabase
                    .from('job_fields')
                    .select('name')
                    .eq('id', job.field_id)
                    .single();
                field_name = field?.name || null;
            }

            // Đếm ứng viên
            const { count } = await supabase
                .from('applications')
                .select('id', { count: 'exact', head: true })
                .eq('job_id', job.id);

            return {
                ...job,
                field_name: field_name,
                total_applicants: count || 0
            };
        }));

        return res.json({
            success: true,
            data: jobsWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Get job list error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
