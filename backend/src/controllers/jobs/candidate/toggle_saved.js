const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Lưu/Bỏ lưu job
router.post('/', async (req, res) => {
    try {
        const { user_id, job_id } = req.body;

        if (!user_id || !job_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc job_id'
            });
        }

        // Kiểm tra đã lưu chưa
        const { data: existingSaved, error: checkError } = await supabase
            .from('job_saved')
            .select('id')
            .eq('user_id', user_id)
            .eq('job_id', job_id)
            .limit(1);

        if (checkError) {
            return res.json({ success: false, message: 'Lỗi database' });
        }

        // Đã lưu thì xóa, chưa lưu thì thêm
        if (existingSaved && existingSaved.length > 0) {
            const { error: deleteError } = await supabase
                .from('job_saved')
                .delete()
                .eq('user_id', user_id)
                .eq('job_id', job_id);

            if (deleteError) {
                return res.json({ success: false, message: 'Lỗi bỏ lưu' });
            }

            return res.json({
                success: true,
                data: {
                    is_saved: false
                },
                message: 'Đã bỏ lưu công việc'
            });
        } else {
            const { error: insertError } = await supabase
                .from('job_saved')
                .insert({
                    user_id: user_id,
                    job_id: job_id
                });

            if (insertError) {
                return res.json({ success: false, message: 'Lỗi lưu' });
            }

            return res.json({
                success: true,
                data: {
                    is_saved: true
                },
                message: 'Đã lưu công việc'
            });
        }

    } catch (error) {
        console.error('Toggle saved error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
