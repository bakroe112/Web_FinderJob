const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy skills của user
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        const { data: userSkills, error } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', user_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        if (!userSkills || userSkills.length === 0) {
            return res.json({
                success: true,
                data: []
            });
        }

        const skillIds = userSkills.map(s => s.skill_id);
        const { data: skills } = await supabase
            .from('skills')
            .select('id, name, category')
            .in('id', skillIds);

        return res.json({
            success: true,
            data: skills || []
        });

    } catch (error) {
        console.error('Get user skills error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
