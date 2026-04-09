const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy danh sách đơn đã ứng tuyển
router.post('/', async (req, res) => {
    try {
        const { user_id, status, page = 1, limit = 20 } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const offset = (page - 1) * limit;

        // Get total count
        let countQuery = supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('candidate_id', user_id);

        if (status) {
            countQuery = countQuery.eq('status', status);
        }

        const { count: total, error: countError } = await countQuery;

        if (countError) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        let query = supabase
            .from('applications')
            .select('*')
            .eq('candidate_id', user_id)
            .order('applied_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data: applications, error } = await query;

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Lấy thông tin job và recruiter
        const applicationsWithDetails = await Promise.all(applications.map(async (app) => {
            try {
                const { data: job, error: jobError } = await supabase
                    .from('jobs')
                    .select('id, title, job_type, work_location, recruiter_id')
                    .eq('id', app.job_id)
                    .single();

                let company_name = '';
                let logo_url = '';
                if (job && job.recruiter_id) {
                    const { data: recruiter, error: recruiterError } = await supabase
                        .from('recruiters')
                        .select('company_name, logo_url')
                        .eq('user_id', job.recruiter_id)
                        .single();
                    
                    if (recruiter) {
                        company_name = recruiter.company_name || '';
                        logo_url = recruiter.logo_url || '';
                    }
                }

                return {
                    ...app,
                    job_title: job?.title || '',
                    job_type: job?.job_type || '',
                    work_location: job?.work_location || '',
                    company_name: company_name,
                    logo_url: logo_url
                };
            } catch (err) {
                console.error('Error fetching job details for application:', err);
                return {
                    ...app,
                    job_title: '',
                    job_type: '',
                    work_location: '',
                    company_name: '',
                    logo_url: ''
                };
            }
        }));

        const totalPages = Math.ceil(total / limit);

        return res.json({
            success: true,
            data: applicationsWithDetails,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: totalPages
            }
        });

    } catch (error) {
        console.error('Get applied jobs error:', error);
        return res.json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
});

module.exports = router;
