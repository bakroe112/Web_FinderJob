const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Cập nhật skills của user
router.post('/', async (req, res) => {
    try {
        const { user_id, skill_ids } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
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
            .from('user_skills')
            .delete()
            .eq('user_id', user_id);

        // Thêm skills mới
        if (skill_ids.length > 0) {
            const inserts = skill_ids.map(skillId => ({
                user_id: user_id,
                skill_id: skillId
            }));

            const { error } = await supabase
                .from('user_skills')
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
        console.error('Update user skills error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
