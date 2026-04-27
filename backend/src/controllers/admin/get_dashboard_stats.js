const express = require("express");
const router = express.Router();
const supabase = require("../../config/db_connect");

router.get("/", async (req, res) => {
  try {
    // 1. Thống kê users theo role
    const { data: users } = await supabase
      .from("users")
      .select("role, is_blocked");

    const usersByRole = {};
    const usersByStatus = { active: 0, blocked: 0 };
    (users || []).forEach((u) => {
      usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
      if (u.is_blocked) usersByStatus.blocked++;
      else usersByStatus.active++;
    });

    // 2. Thống kê jobs
    const { data: jobs } = await supabase
      .from("jobs")
      .select("job_status, job_type, workplace_type, created_at");

    const jobsByStatus = {};
    const jobsByType = {};
    const jobsByWorkplace = {};
    const jobsByMonth = {};
    (jobs || []).forEach((j) => {
      jobsByStatus[j.job_status] = (jobsByStatus[j.job_status] || 0) + 1;
      jobsByType[j.job_type] = (jobsByType[j.job_type] || 0) + 1;
      jobsByWorkplace[j.workplace_type] = (jobsByWorkplace[j.workplace_type] || 0) + 1;
      if (j.created_at) {
        const month = j.created_at.substring(0, 7); // YYYY-MM
        jobsByMonth[month] = (jobsByMonth[month] || 0) + 1;
      }
    });

    // 3. Thống kê applications
    const { data: applications } = await supabase
      .from("applications")
      .select("status, applied_at");

    const appsByStatus = {};
    const appsByMonth = {};
    (applications || []).forEach((a) => {
      appsByStatus[a.status] = (appsByStatus[a.status] || 0) + 1;
      if (a.applied_at) {
        const month = a.applied_at.substring(0, 7);
        appsByMonth[month] = (appsByMonth[month] || 0) + 1;
      }
    });

    // 4. Thống kê candidate_analyses
    const { data: analyses } = await supabase
      .from("candidate_analyses")
      .select("resume_score, reco_field, analyzed_at");

    const scoreRanges = { "0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
    const analysesByField = {};
    const analysesByMonth = {};
    (analyses || []).forEach((a) => {
      // Score distribution
      const s = a.resume_score;
      if (s <= 20) scoreRanges["0-20"]++;
      else if (s <= 40) scoreRanges["21-40"]++;
      else if (s <= 60) scoreRanges["41-60"]++;
      else if (s <= 80) scoreRanges["61-80"]++;
      else scoreRanges["81-100"]++;

      // By recommended field
      const field = a.reco_field || "Không xác định";
      analysesByField[field] = (analysesByField[field] || 0) + 1;

      if (a.analyzed_at) {
        const month = a.analyzed_at.substring(0, 7);
        analysesByMonth[month] = (analysesByMonth[month] || 0) + 1;
      }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: (users || []).length,
          byRole: usersByRole,
          byStatus: usersByStatus,
        },
        jobs: {
          total: (jobs || []).length,
          byStatus: jobsByStatus,
          byType: jobsByType,
          byWorkplace: jobsByWorkplace,
          byMonth: jobsByMonth,
        },
        applications: {
          total: (applications || []).length,
          byStatus: appsByStatus,
          byMonth: appsByMonth,
        },
        analyses: {
          total: (analyses || []).length,
          scoreRanges,
          byField: analysesByField,
          byMonth: analysesByMonth,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
