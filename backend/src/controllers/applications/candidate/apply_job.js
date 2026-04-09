const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Nộp đơn ứng tuyển
router.post('/', async (req, res) => {
    try {
        const { user_id, job_id, introduction, resume_url } = req.body;

        if (!user_id || !job_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc job_id'
            });
        }

        // Kiểm tra đã apply chưa
        const { data: existingApp } = await supabase
            .from('applications')
            .select('id')
            .eq('candidate_id', user_id)
            .eq('job_id', job_id)
            .limit(1);

        if (existingApp && existingApp.length > 0) {
            return res.json({
                success: false,
                message: 'Bạn đã ứng tuyển công việc này rồi'
            });
        }

        // Kiểm tra job còn mở không
        const { data: job } = await supabase
            .from('jobs')
            .select('job_status, title, recruiter_id')
            .eq('id', job_id)
            .single();

        if (!job || job.job_status !== 'Open') {
            return res.json({
                success: false,
                message: 'Công việc không còn tuyển'
            });
        }

        // Tạo application
        const { data: application, error } = await supabase
          .from("applications")
          .insert({
            candidate_id: user_id,
            job_id: job_id,
            introduction: introduction || null,
            resume_url: resume_url || null,
            status: "pending",
            applied_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
            return res.json({ success: false, message: 'Lỗi nộp đơn: ' + error.message });
        }
        
        // Tạo notification cho recruiter
        try {
            const { data: candidate } = await supabase
                .from('candidates')
                .select('full_name')
                .eq('user_id', user_id)
                .single();

            const notificationMessage = `Ứng viên ${candidate?.full_name || 'mới'} vừa ứng tuyển "${job.title}"`;
            
            await supabase
                .from('notifications')
                .insert({
                    user_id: job.recruiter_id,
                    message: notificationMessage,
                    is_read: false
                });
        } catch (notifErr) {
            console.error('Error creating notification:', notifErr);
            // Don't fail the main request if notification fails
        }

        return res.json({
            success: true,
            message: 'Nộp đơn thành công',
            data: application
        });

    } catch (error) {
        console.error('Apply job error:', error);
        return res.json({
            success: false,
            message: error.message || 'Lỗi server'
        });
    }
});

module.exports = router;
