const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy skills của job
router.post('/', async (req, res) => {
    try {
        const { job_id } = req.body;

        if (!job_id) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        const { data: jobSkills, error } = await supabase
            .from('job_skills')
            .select('skill_id')
            .eq('job_id', job_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        if (!jobSkills || jobSkills.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        const skillIds = jobSkills.map(s => s.skill_id);
        const { data: skills } = await supabase
            .from('skills')
            .select('id, name, category')
            .in('id', skillIds);

        return res.json({
            success: true,
            data: skills || []
        });

    } catch (error) {
        console.error('Get job skills error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
