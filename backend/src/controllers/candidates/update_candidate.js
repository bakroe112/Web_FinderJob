const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Cập nhật thông tin candidate
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            full_name,
            phone,
            location,
            job_title,
            experience,
            summary,
            skills
        } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Update candidate info only (all fields go to candidates table)
        const candidateUpdate = {};
        if (full_name !== undefined) candidateUpdate.full_name = full_name;
        if (phone !== undefined) candidateUpdate.phone = phone;
        if (location !== undefined) candidateUpdate.location = location;
        if (job_title !== undefined) candidateUpdate.job_title = job_title;
        if (experience !== undefined) candidateUpdate.experience = experience;
        if (summary !== undefined) candidateUpdate.summary = summary;

        if (Object.keys(candidateUpdate).length > 0) {
            const { error: candidateError } = await supabase
                .from('candidates')
                .update(candidateUpdate)
                .eq('user_id', user_id);

            if (candidateError) {
                console.error('Candidate update error:', candidateError);
                return res.json({ success: false, message: 'Lỗi cập nhật thông tin: ' + candidateError.message });
            }
        }

        // Update skills
        if (skills !== undefined && Array.isArray(skills)) {
            // Xóa skills cũ
            const { error: deleteError } = await supabase
                .from('user_skills')
                .delete()
                .eq('user_id', user_id);

            if (deleteError) {
                console.error('Delete skills error:', deleteError);
            }

            // Thêm skills mới
            if (skills.length > 0) {
                const skillInserts = skills.map(skillId => ({
                    user_id: user_id,
                    skill_id: skillId
                }));
                const { error: insertError } = await supabase
                    .from('user_skills')
                    .insert(skillInserts);

                if (insertError) {
                    console.error('Insert skills error:', insertError);
                }
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật thành công'
        });

    } catch (error) {
        console.error('Update candidate error:', error);
        return res.json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
});

module.exports = router;
