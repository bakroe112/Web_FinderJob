const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload avatar
router.post('/', upload.single('avatar'), async (req, res) => {
    try {
        const { user_id, user_role } = req.body;
        const file = req.file;

        if (!user_id || !file) {
            return res.json({
                success: false,
                message: 'Thiếu user_id hoặc file'
            });
        }

        // Determine upload path based on role
        const folderPath = user_role === 'recruiter' ? 'logo' : 'avatar';
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${user_id}-${Date.now()}.${fileExt}`;
        const filePath = `${folderPath}/${fileName}`;

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return res.json({ 
                success: false, 
                message: 'Lỗi upload ảnh: ' + uploadError.message 
            });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        // Update user's avatar_url in database
        const { error: updateError } = await supabase
            .from('users')
            .update({ avatar_url: publicUrl })
            .eq('id', user_id);

        if (updateError) {
            console.error('Update error:', updateError);
            return res.json({ 
                success: false, 
                message: 'Lỗi cập nhật avatar' 
            });
        }

        // If user is recruiter, also update logo_url in recruiters table
        if (user_role === 'recruiter') {
            const { error: recruiterUpdateError } = await supabase
                .from('recruiters')
                .update({ logo_url: publicUrl })
                .eq('user_id', user_id);

            if (recruiterUpdateError) {
                console.error('Recruiter update error:', recruiterUpdateError);
                return res.json({ 
                    success: false, 
                    message: 'Lỗi cập nhật logo công ty' 
                });
            }
        }

        // If user is candidate, also update avatar_url in candidates table
        if (user_role === 'candidate') {
            const { error: candidateUpdateError } = await supabase
                .from('candidates')
                .update({ avatar_url: publicUrl })
                .eq('user_id', user_id);

            if (candidateUpdateError) {
                console.error('Candidate update error:', candidateUpdateError);
                return res.json({ 
                    success: false, 
                    message: 'Lỗi cập nhật ảnh đại diện' 
                });
            }
        }

        return res.json({
            success: true,
            message: 'Upload avatar thành công',
            data: { avatar_url: publicUrl }
        });

    } catch (error) {
        console.error('Upload avatar error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
