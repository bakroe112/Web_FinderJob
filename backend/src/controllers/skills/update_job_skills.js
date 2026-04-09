const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Cập nhật skills của job
router.post('/', async (req, res) => {
    try {
        const { job_id, skill_ids } = req.body;

        if (!job_id) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        if (!Array.isArray(skill_ids)) {
            return res.json({
                success: false,
                message: 'skill_ids phải là array'
            });
        }

        // Xóa skills cũ
        await supabase
            .from('job_skills')
            .delete()
            .eq('job_id', job_id);

        // Thêm skills mới
        if (skill_ids.length > 0) {
            const inserts = skill_ids.map(skillId => ({
                job_id: job_id,
                skill_id: skillId
            }));

            const { error } = await supabase
                .from('job_skills')
                .insert(inserts);

            if (error) {
                return res.json({ success: false, message: 'Lỗi thêm skills' });
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật skills thành công'
        });

    } catch (error) {
        console.error('Update job skills error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
