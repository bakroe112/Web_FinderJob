const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Tạo job mới
router.post('/', async (req, res) => {
    try {
        const {
            recruiter_id,
            title,
            job_description,
            interest,
            job_type,
            workplace_type,
            work_location,
            working_time,
            salary,
            experience,
            vacancy_count,
            deadline,
            field_id
        } = req.body;

        if (!recruiter_id || !title) {
            return res.json({
                success: false,
                message: 'Thiếu thông tin bắt buộc'
            });
        }

        const { data: job, error } = await supabase
            .from('jobs')
            .insert({
                recruiter_id,
                title,
                job_description,
                interest,
                job_type: job_type || 'Full time',
                workplace_type: workplace_type || 'On-site',
                work_location,
                working_time,
                salary,
                experience,
                vacancy_count,
                deadline,
                field_id,
                job_status: 'Open'
            })
            .select()
            .single();

        if (error) {
            console.error('Create job error:', error);
            return res.json({ success: false, message: 'Lỗi tạo công việc' });
        }

        return res.json({
            success: true,
            message: 'Tạo công việc thành công',
            data: job
        });

    } catch (error) {
        console.error('Create job error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
