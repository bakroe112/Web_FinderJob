const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Allowed file types for resume
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

// Upload resume
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { user_id } = req.body;
        const file = req.file;

        if (!user_id || !file) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu user_id hoặc file'
            });
        }

        // Validate file type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Chỉ cho phép upload file: PDF, DOC, DOCX, XLS, XLSX'
            });
        }

        // Validate file size
        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: 'Kích thước file không vượt quá 10MB'
            });
        }

        // Generate file name
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${user_id}-${Date.now()}.${fileExt}`;
        const filePath = `resume/${fileName}`;

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('resume')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Resume upload error:', uploadError);
            return res.status(500).json({ 
                success: false, 
                message: 'Lỗi upload CV: ' + uploadError.message 
            });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('resume')
            .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        res.status(200).json({
            success: true,
            message: 'Upload CV thành công',
            data: {
                resume_url: publicUrl,
                file_name: fileName
            }
        });
    } catch (error) {
        console.error('Upload resume error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server: ' + error.message
        });
    }
});

module.exports = router;
