const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Hủy đơn ứng tuyển
router.post('/', async (req, res) => {
    try {
        const { user_id, application_id } = req.body;

        if (!user_id || !application_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc application_id'
            });
        }

        // Kiểm tra quyền sở hữu
        const { data: application, error: checkError } = await supabase
            .from('applications')
            .select('id, status')
            .eq('id', application_id)
            .eq('candidate_id', user_id)
            .single();

        if (checkError || !application) {
            return res.json({
                success: false,
                message: 'Không tìm thấy đơn hoặc không có quyền'
            });
        }

        // Chỉ hủy được khi đang Pending
        if (application.status !== 'pending' && application.status !== 'Pending') {
            return res.json({
                success: false,
                message: 'Chỉ có thể hủy đơn đang chờ xét duyệt'
            });
        }

        // Xóa đơn
        const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', application_id);

        if (error) {
            return res.json({ success: false, message: 'Lỗi hủy đơn' });
        }

        return res.json({
            success: true,
            message: 'Hủy đơn thành công'
        });

    } catch (error) {
        console.error('Cancel application error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
