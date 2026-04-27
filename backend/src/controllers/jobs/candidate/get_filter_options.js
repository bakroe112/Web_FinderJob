const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lấy filter options (job_fields, job_types, workplace_types)
router.get('/', async (req, res) => {
    try {
        // Lấy danh sách job_fields
        const { data: fields, error: fieldsError } = await supabase
            .from('job_fields')
            .select('id, name')
            .order('name', { ascending: true });

        if (fieldsError) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Các options cố định
        const job_types = ['Full time', 'Part time', 'Internship'];
        const workplace_types = ['Onsite', 'Remote', 'Hybrid'];
        const experience_levels = ['Fresher', '1-2 năm', '2-3 năm', '3-5 năm', 'Trên 5 năm'];

        return res.json({
            success: true,
            data: {
                job_fields: fields || [],
                job_types: job_types,
                workplace_types: workplace_types,
                experience_levels: experience_levels
            }
        });

    } catch (error) {
        console.error('Get filter options error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
