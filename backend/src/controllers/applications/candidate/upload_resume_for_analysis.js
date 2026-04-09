const express = require("express");
const multer = require("multer");
const axios = require("axios");
const supabase = require("../../../config/db_connect");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { candidate_id } = req.body;
    const file = req.file;

    // Step 1: Upload file lên Supabase
    const fileName = `${candidate_id}-${Date.now()}.${file.originalname.split(".").pop()}`;
    const filePath = `resume/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resume")
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    // Step 2: Lấy public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("resume").getPublicUrl(filePath);

    // Step 3: Gọi Python API để parse + score
    const analysisResponse = await axios.post(
      "http://127.0.0.1:5000/api/analyze-resume",
      {
        file_url: publicUrl,
        candidate_id: candidate_id,
      },
    );

    const { resume_score, parsed_data, details } = analysisResponse.data;

    // Step 4: Lưu vào Database
    const { data: resumeRecord, error: resumeError } = await supabase
      .from("resumes")
      .insert({
        candidate_id,
        storage_url: publicUrl,
        filename: file.originalname,
        file_type: file.mimetype.split("/")[1],
        file_size: file.size,
        parsed_text: parsed_data.text || "",
        is_primary: true,
      })
      .select()
      .single();

    if (resumeError) throw resumeError;
    if (!resumeRecord) throw new Error('Failed to create resume record');

    const { data: analysisRecord, error: analysisError } = await supabase
      .from("candidate_analyses")
      .insert({
        candidate_id,
        resume_id: resumeRecord.id,
        resume_score: resume_score,
        parsed_data: parsed_data, 
        skills: parsed_data.skills || [],
        reco_field: details.reco_field || null,
        recommended_skills: details.recommended_skills || [],
        model_version: 'autotrain-resume-classifier3',
        details: {
          feedback: details.feedback,
          tips: details.tips,
          recommended_courses: details.recommended_courses,
        },
        analyzed_at: new Date(),
      })
      .select()
      .single();

    if (analysisError) throw analysisError;
    if (!analysisRecord) throw new Error('Failed to create analysis record');

    // Step 5: Return response về Frontend
    res.json({
      success: true,
      resume_score,
      parsed_data,
      tips: details.tips || [],
      reco_field: details.reco_field || null,
      recommended_skills: details.recommended_skills || [],
      recommended_courses: details.recommended_courses || [],
      analysis_id: analysisRecord.id,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi phân tích resume",
      error: error.message,
    });
  }
});

module.exports = router;
