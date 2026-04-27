const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Lỗi: Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false, // Không tự động refresh token
    persistSession: false, // Không lưu session
  },
});

console.log("Đã kết nối Supabase thành công");

module.exports = supabase;