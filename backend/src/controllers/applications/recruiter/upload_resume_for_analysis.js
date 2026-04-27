const express = require("express");
const multer = require("multer");
const axios = require("axios");
const supabase = require("../../../config/db_connect");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { candidate_id, job_id } = req.body;
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

    // Step 4: So sánh skills của candidate với skills yêu cầu của job
    let skillMatch = null;
    if (job_id) {
      // Lấy skills yêu cầu của job
      const { data: jobSkillRows } = await supabase
        .from("job_skills")
        .select("skill_id")
        .eq("job_id", job_id);

      if (jobSkillRows && jobSkillRows.length > 0) {
        const skillIds = jobSkillRows.map((s) => s.skill_id);
        const { data: jobSkills } = await supabase
          .from("skills")
          .select("id, name")
          .in("id", skillIds);

        const requiredSkillNames = (jobSkills || []).map((s) => s.name.toLowerCase());
        const candidateSkills = (parsed_data.skills || []).map((s) => s.toLowerCase());
        
        const matched = requiredSkillNames.filter((s) => candidateSkills.includes(s));
        const missing = requiredSkillNames.filter((s) => !candidateSkills.includes(s));

        skillMatch = {
          required: (jobSkills || []).map((s) => s.name),
          matched: matched.map((s) => {
            const found = jobSkills.find((js) => js.name.toLowerCase() === s);
            return found ? found.name : s;
          }),
          missing: missing.map((s) => {
            const found = jobSkills.find((js) => js.name.toLowerCase() === s);
            return found ? found.name : s;
          }),
          match_percent: requiredSkillNames.length > 0
            ? Math.round((matched.length / requiredSkillNames.length) * 100)
            : 0,
        };
      }
    }

    // Step 5: Return response về Frontend
    res.json({
      success: true,
      resume_score,
      parsed_data,
      tips: details.tips || [],
      reco_field: details.reco_field || null,
      recommended_skills: details.recommended_skills || [],
      recommended_courses: details.recommended_courses || [],
      skill_match: skillMatch,
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
