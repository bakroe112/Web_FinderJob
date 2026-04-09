const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Lấy thông tin candidate
router.post('/', async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Lấy user info
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, email, avatar_url, role')
            .eq('id', user_id)
            .single();

        if (userError || !user) {
            console.error('User error:', userError);
            return res.json({
                success: false,
                message: userError?.message || 'Không tìm thấy user'
            });
        }

        // Lấy candidate info
        const { data: candidate, error: candidateError } = await supabase
            .from('candidates')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (candidateError || !candidate) {
            console.error('Candidate error:', candidateError);
            // Nếu không tìm thấy candidate, tạo record mới với giá trị mặc định
            if (candidateError?.code === 'PGRST116') {
                const { data: newCandidate, error: insertError } = await supabase
                    .from('candidates')
                    .insert({
                        user_id: user_id,
                        full_name: user.full_name || '',
                        phone: user.phone || '',
                        location: '',
                        job_title: '',
                        summary: '',
                        experience: ''
                    })
                    .select()
                    .single();

                if (insertError) {
                    console.error('Insert candidate error:', insertError);
                    return res.json({
                        success: false,
                        message: 'Không thể tạo hồ sơ candidate'
                    });
                }

                return res.json({
                    success: true,
                    data: {
                        ...user,
                        ...newCandidate,
                        skills: []
                    }
                });
            }

            return res.json({
                success: false,
                message: candidateError?.message || 'Không tìm thấy thông tin candidate'
            });
        }

        // Lấy skills
        const { data: userSkills } = await supabase
            .from('user_skills')
            .select('skill_id')
            .eq('user_id', user_id);

        let skills = [];
        if (userSkills && userSkills.length > 0) {
            const skillIds = userSkills.map(s => s.skill_id);
            const { data: skillData } = await supabase
                .from('skills')
                .select('id, name')
                .in('id', skillIds);
            skills = skillData || [];
        }

        return res.json({
            success: true,
            data: {
                ...user,
                ...candidate,
                skills: skills
            }
        });

    } catch (error) {
        console.error('Get candidate error:', error);
        return res.json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
});

module.exports = router;
