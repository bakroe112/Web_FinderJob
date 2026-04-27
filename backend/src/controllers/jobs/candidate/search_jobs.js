const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy danh sách jobs (có filter và phân trang)
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            keyword = '',
            location = '',
            field_id = '',
            job_type = '',
            workplace_type = '',
            page = 1,
            limit = 20
        } = req.body;

        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from('jobs')
            .select('*')
            .eq('job_status', 'Open')
            .order('created_at', { ascending: false });

        // Áp dụng filter
        if (keyword && keyword.trim() !== '') {
            query = query.ilike('title', `%${keyword}%`);
        }
        if (job_type && job_type.trim() !== '') {
            query = query.eq('job_type', job_type);
        }
        if (workplace_type && workplace_type.trim() !== '') {
            query = query.eq('workplace_type', workplace_type);
        }
        if (field_id && field_id !== '') {
            query = query.eq('field_id', field_id);
        }
        if (location && location.trim() !== '') {
            query = query.ilike('work_location', `%${location}%`);
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data: jobs, error: jobsError, count } = await query;

        if (jobsError) {
            console.error('Lỗi lấy jobs:', jobsError);
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Get total count
        let totalQuery = supabase
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('job_status', 'Open');

        // Apply same filters for count
        if (keyword && keyword.trim() !== '') {
            totalQuery = totalQuery.ilike('title', `%${keyword}%`);
        }
        if (job_type && job_type.trim() !== '') {
            totalQuery = totalQuery.eq('job_type', job_type);
        }
        if (workplace_type && workplace_type.trim() !== '') {
            totalQuery = totalQuery.eq('workplace_type', workplace_type);
        }
        if (field_id && field_id !== '') {
            totalQuery = totalQuery.eq('field_id', field_id);
        }
        if (location && location.trim() !== '') {
            totalQuery = totalQuery.ilike('work_location', `%${location}%`);
        }

        const { count: totalCount } = await totalQuery;

        // Lấy thêm thông tin recruiter và isSaved
        const jobsWithDetails = await Promise.all(jobs.map(async (job) => {
            // Lấy thông tin recruiter
            const { data: recruiter } = await supabase
                .from('recruiters')
                .select('company_name, logo_url')
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
                    .eq('job_id', job.id)
                    .limit(1);
                isSaved = savedJob && savedJob.length > 0 ? true : false;
            }

            return {
                ...job,
                company_name: recruiter?.company_name || '',
                logo_url: recruiter?.logo_url || '',
                field_name: field_name,
                isSaved: isSaved
            };
        }));

        return res.json({
            success: true,
            data: jobsWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount || 0,
                totalPages: Math.ceil((totalCount || 0) / limit)
            }
        });

    } catch (error) {
        console.error('Search jobs error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
