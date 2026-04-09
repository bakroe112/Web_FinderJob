const express = require('express');
const router = express.Router();
const supabase = require('../../../config/db_connect');

// Cập nhật job
router.put('/:id', async (req, res) => {
    try {
        const { id: job_id } = req.params;
        const {
            title,
            job_description,
            interest,
            job_type,
            workplace_type,
            work_location,
            working_time,
            salary,
            experience,
            vacancy_count,
            deadline,
            field_id,
            job_status
        } = req.body;

        if (!job_id) {
            return res.json({
                success: false,
                message: 'Thiếu job_id'
            });
        }

        // Update
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (job_description !== undefined) updateData.job_description = job_description;
        if (interest !== undefined) updateData.interest = interest;
        if (job_type !== undefined) updateData.job_type = job_type;
        if (workplace_type !== undefined) updateData.workplace_type = workplace_type;
        if (work_location !== undefined) updateData.work_location = work_location;
        if (working_time !== undefined) updateData.working_time = working_time;
        if (salary !== undefined) updateData.salary = salary;
        if (experience !== undefined) updateData.experience = experience;
        if (vacancy_count !== undefined) updateData.vacancy_count = vacancy_count;
        if (deadline !== undefined) updateData.deadline = deadline;
        if (field_id !== undefined) updateData.field_id = field_id;
        if (job_status !== undefined) updateData.job_status = job_status;

        const { data: job, error } = await supabase
            .from('jobs')
            .update(updateData)
            .eq('id', job_id)
            .select()
            .single();

        if (error) {
            return res.json({ success: false, message: 'Lỗi cập nhật' });
        }

        return res.json({
            success: true,
            message: 'Cập nhật thành công',
            data: job
        });

    } catch (error) {
        console.error('Update job error:', error);
        return res.json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
