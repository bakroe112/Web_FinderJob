const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../../config/db_connect');

router.post('/', async (req, res) => {
    try {
        const { full_name, email, password, role = 'candidate' } = req.body;

        // Kiểm tra dữ liệu
        if (!email || !password) {
            return res.json({
                success: false,
                message: 'Thiếu thông tin bắt buộc'
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const { data: existingUsers, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .limit(1);

        if (checkError) {
            return res.json({
                success: false,
                message: 'Lỗi database'
            });
        }

        if (existingUsers && existingUsers.length > 0) {
            return res.json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm user mới
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                email: email,
                password: hashedPassword,
                role: role
            })
            .select('id')
            .single();

        if (insertError) {
            return res.json({
                success: false,
                message: 'Lỗi tạo tài khoản'
            });
        }

        const userId = newUser.id;

        // Tạo profile theo role
        if (role === 'candidate') {
            const { error: candidateError } = await supabase
                .from('candidates')
                .insert({
                    user_id: userId,
                    full_name: full_name
                });

            if (candidateError) {
                return res.json({
                    success: false,
                    message: 'Lỗi tạo profile ứng viên'
                });
            }
        }

        if (role === 'recruiter') {
            const { error: recruiterError } = await supabase
                .from('recruiters')
                .insert({
                    user_id: userId,
                    company_name: full_name
                });

            if (recruiterError) {
                return res.json({
                    success: false,
                    message: 'Lỗi tạo profile nhà tuyển dụng'
                });
            }
        }

        return res.json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user_id: userId
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
