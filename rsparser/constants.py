# ============================================================
# constants.py - Tập trung tất cả keywords / patterns / hằng số
# ============================================================

# Bằng cấp phổ biến (UPPER CASE bắt buộc)
EDUCATION_KEYWORDS = [
    'BE', 'B.E.', 'B.E', 'BS', 'B.S', 'B.S.',
    'ME', 'M.E', 'M.E.', 'MS', 'M.S', 'M.S.',
    'BTECH', 'B.TECH', 'M.TECH', 'MTECH',
    'PHD', 'PH.D', 'PH.D.',
    'MBA', 'BBA', 'BCA', 'MCA',
    'SSC', 'HSC', 'CBSE', 'ICSE',
    'X', 'XII', 'BACHELOR', 'MASTER', 'DIPLOMA',
    'BCOM', 'B.COM', 'MCOM', 'M.COM',
    'BA', 'B.A', 'B.A.', 'MA', 'M.A', 'M.A.',
    'BSC', 'B.SC', 'MSC', 'M.SC',
    'ASSOCIATE', 'DEGREE', 'CERTIFICATE', 'CERTIFICATION',
    'TECHNOLOGY', 'ENGINEERING',
    'UNIVERSITY', 'COLLEGE', 'INSTITUTE', 'SCHOOL', 'CENTER',
    'ACADEMY', 'GED', 'HIGH SCHOOL',
    'AA', 'AS', 'AAS', 'BFA', 'MFA', 'LLB', 'LLM', 'JD', 'MD',
    'DBA', 'EDD', 'BSIT', 'MSIT',
]

# Từ phổ biến dễ bị nhầm thành skill
COMMON_WORDS = {
    'email', 'website', 'mobile', 'phone', 'address', 'name',
    'construction', 'system', 'reports', 'travel', 'international',
    'process', 'filing', 'improvement', 'video', 'audio',
    'as',  # conflicts with 'AS' (Associate of Science)
}

# Regex patterns
NOT_ALPHA_NUMERIC = r'[^a-zA-Z\d]'
NUMBER = r'\d+'
YEAR_PATTERN = r'((?:19|20)\d{2})'

# Date patterns
MONTHS_SHORT = r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)'
MONTHS_LONG = r'(january|february|march|april|may|june|july|august|september|october|november|december)'
MONTH = r'(' + MONTHS_SHORT + r'|' + MONTHS_LONG + r')'
YEAR = r'(((20|19)(\d{2})))'

RESUME_SECTIONS_PROFESSIONAL = [
    'experience',
    'education',
    'interests',
    'professional experience',
    'publications',
    'skills',
    'certifications',
    'objective',
    'career objective',
    'summary',
    'leadership',
]

RESUME_SECTIONS_GRAD = [
    'accomplishments',
    'experience',
    'education',
    'interests',
    'projects',
    'professional experience',
    'publications',
    'skills',
    'certifications',
    'objective',
    'career objective',
    'summary',
    'leadership',
]

SECTION_HEADERS = {
    'summary', 'objective', 'experience', 'education', 'skills',
    'projects', 'certifications', 'interests', 'work experience',
    'professional experience', 'additional information', 'references',
    'career objective', 'key skills', 'technical skills', 'achievements',
    'extracurricular activity', 'research', 'publications', 'internship',
    'entrepreneurship', 'professional summary',
    'contact', 'my contact', 'about me', 'about', 'profile',
    'personal information', 'personal details', 'professional profile',
    'hard skill', 'soft skill', 'recognition', 'miscellaneous',
    'education background', 'academic background',
}

LABEL_PREFIXES = (
        'language', 'address', 'email', 'phone', 'mobile', 'tel',
        'objective', 'summary', 'skill', 'education', 'experience',
        'certification', 'additional', 'reference', 'interest',
        'nationality', 'date of birth', 'dob', 'gender', 'marital',
        'visa', 'passport', 'website', 'portfolio',
    )

# ── Section Scoring (hợp nhất section_map + search_terms) ──
# label: model classifier label
# name: tên hiển thị
# points: điểm cộng khi tìm thấy
# search_term: từ khóa fallback khi không có sections từ model
SECTION_SCORING = {
    'Obj':   {'name': 'Objective',  'points': 20, 'search_term': 'objective'},
    'Sum':   {'name': 'Summary',    'points': 20, 'search_term': 'summary'},
    'Exp':   {'name': 'Experience', 'points': 20, 'search_term': 'experience'},
    'Edu':   {'name': 'Education',  'points': 20, 'search_term': 'education'},
    'Skill': {'name': 'Skills',     'points': 10, 'search_term': 'skills'},
    'Proj':  {'name': 'Projects',   'points': 10, 'search_term': 'projects'},
}

# ── Tips & Ideas per section ──
SECTION_TIPS = {
    'Obj': {
        'found': 'Tuyệt vời! Bạn đã thêm mục tiêu nghề nghiệp (Objective).',
        'missing': 'Hãy thêm mục tiêu nghề nghiệp. Nó sẽ cho nhà tuyển dụng biết định hướng của bạn.',
    },
    'Sum': {
        'found': 'Tuyệt vời! Bạn đã có phần tóm tắt (Summary).',
        'missing': 'Hãy thêm phần tóm tắt bản thân. Nó giúp nhà tuyển dụng nắm bắt nhanh hồ sơ của bạn.',
    },
    'Exp': {
        'found': 'Tuyệt vời! Bạn đã có kinh nghiệm làm việc (Experience).',
        'missing': 'Hãy thêm kinh nghiệm làm việc. Đây là phần quan trọng nhất để chứng minh năng lực.',
    },
    'Edu': {
        'found': 'Tuyệt vời! Bạn đã có trình độ học vấn (Education).',
        'missing': 'Hãy thêm trình độ học vấn. Nhà tuyển dụng cần biết nền tảng học thuật của bạn.',
    },
    'Skill': {
        'found': 'Tuyệt vời! Bạn đã liệt kê các kỹ năng (Skills).',
        'missing': 'Hãy thêm phần kỹ năng. Nó giúp nhà tuyển dụng đánh giá bạn phù hợp với vị trí hay không.',
    },
    'Proj': {
        'found': 'Tuyệt vời! Bạn đã có các dự án (Projects).',
        'missing': 'Hãy thêm các dự án đã thực hiện. Nó cho thấy bạn đã có kinh nghiệm thực tế.',
    },
}