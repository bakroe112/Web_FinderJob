const express = require('express');
const router = express.Router();
const supabase = require('../../config/db_connect');

// Cập nhật thông tin recruiter
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            full_name,
            phone,
            company_name,
            description,
            website,
            location,
            size,
            logo_url,
            industry
        } = req.body;

        if (!user_id) {
            return res.json({
                success: false,
                message: 'Thiếu user_id'
            });
        }

        // Update recruiter info
        const recruiterUpdate = {};
        if (company_name !== undefined) recruiterUpdate.company_name = company_name;
        if (description !== undefined) recruiterUpdate.description = description;
        if (website !== undefined) recruiterUpdate.website = website;
        if (location !== undefined) recruiterUpdate.location = location;
        if (size !== undefined) recruiterUpdate.size = size;
        if (logo_url !== undefined) recruiterUpdate.logo_url = logo_url;
        if (phone !== undefined) recruiterUpdate.phone = phone;
        if (full_name !== undefined) recruiterUpdate.full_name = full_name;
        if (industry !== undefined) recruiterUpdate.industry = industry;

        if (Object.keys(recruiterUpdate).length > 0) {
            const { error: recruiterError } = await supabase
                .from('recruiters')
                .update(recruiterUpdate)
                .eq('user_id', user_id);

            if (recruiterError) {
                return res.json({ success: false, message: 'Lỗi cập nhật recruiter' });
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật thành công'
        });

    } catch (error) {
        console.error('Update recruiter error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
