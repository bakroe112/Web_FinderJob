const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Cập nhật trạng thái application
router.post('/', async (req, res) => {
    try {
        const { recruiter_id, application_id, status } = req.body;
        console.log('Update status request:', { recruiter_id, application_id, status });

        if (!recruiter_id || !application_id || !status) {
            return res.json({
                success: false,
                message: 'Thiếu thông tin bắt buộc'
            });
        }

        // Kiểm tra status hợp lệ
        const validStatuses = ['pending', 'viewed', 'interviewing', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        // Lấy application
        const { data: application, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('id', application_id)
            .single();

        if (appError || !application) {
            return res.json({
                success: false,
                message: 'Không tìm thấy application'
            });
        }

        // Kiểm tra quyền
        const { data: job, error: jobError } = await supabase
            .from('jobs')
            .select('id, title')
            .eq('id', application.job_id)
            .eq('recruiter_id', recruiter_id)
            .single();

        if (jobError || !job) {
            console.log('Job permission check error:', { jobError, recruiter_id, job_id: application.job_id });
            return res.json({
                success: false,
                message: 'Không có quyền cập nhật application này'
            });
        }

        // Update
        const updateData = { status };

        const { data: updated, error } = await supabase
            .from('applications')
            .update(updateData)
            .eq('id', application_id)
            .select()
            .single();

        if (error) {
            console.log('Update error:', error);
            return res.json({ success: false, message: 'Lỗi cập nhật: ' + (error?.message || 'Unknown') });
        }

        // Gửi notification cho candidate
        let message = '';
        if (status === 'viewed') {
            message = `Hồ sơ của bạn cho "${job.title}" đang được xem xét`;
        } else if (status === 'accepted') {
            message = `Chúc mừng! Bạn đã được chấp nhận cho "${job.title}"`;
        } else if (status === 'rejected') {
            message = `Rất tiếc, hồ sơ của bạn cho "${job.title}" chưa phù hợp`;
        }

        if (message) {
            const { error: notifError } = await supabase
                .from('notifications')
                .insert({
                    user_id: application.candidate_id,
                    message: message,
                    is_read: false
                });

            if (notifError) {
                console.error('Notification creation error:', notifError);
                // Continue anyway, don't fail the main request
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật thành công',
            data: updated
        });

    } catch (error) {
        console.error('Update status error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
