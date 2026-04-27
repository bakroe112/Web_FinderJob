# Python (rsparser/api_server.py)
from flask import Flask, request, jsonify
from resume_parser import ResumeParser
import requests
from io import BytesIO
import Utils
import constants as cs
from Courses import SKILL_CATEGORIES
import logging

# Suppress pdfminer warnings
logging.getLogger('pdfminer').setLevel(logging.ERROR)

app = Flask(__name__)

# Increase max content length to 16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


def calculate_score(sections, extracted_data):
    """
    extracted_data dùng để cross-check: nếu model nói có Edu nhưng
    extracted education là [] thì vẫn không cộng điểm.
    """
    resume_score = 0
    feedback = []
    tips = []

    # Map label → extracted_data field để kiểm tra nội dung thực
    label_to_extracted = {
        'Exp': 'experience',
        'Edu': 'education',
        'Skill': 'skills',
    }

    for label, cfg in cs.SECTION_SCORING.items():
        name = cfg['name']
        points = cfg['points']

        # Kiểm tra: section có tồn tại và có nội dung từ classifier?
        section_lines = sections.get(label, []) if isinstance(sections, dict) else []
        has_section = bool(section_lines)

        # Cross-check với extracted_data: nếu có field tương ứng, nội dung không được null/empty
        extracted_field = label_to_extracted.get(label)
        if extracted_field and has_section:
            extracted_value = extracted_data.get(extracted_field)
            if not extracted_value:
                has_section = False

        if has_section:
            resume_score += points
            feedback.append(f"✓ Found {name}")
            tips.append({'section': label, 'found': True, 'message': cs.SECTION_TIPS[label]['found']})
        else:
            feedback.append(f"✗ Missing {name}")
            tips.append({'section': label, 'found': False, 'message': cs.SECTION_TIPS[label]['missing']})

    return resume_score, feedback, tips


def get_recommendations(skills):
    if not skills:
        return None, [], []

    for skill in skills:
        skill_lower = skill.lower()
        for field, data in SKILL_CATEGORIES.items():
            if skill_lower in data['keywords']:
                existing = set(s.lower() for s in skills)
                recommended = [s for s in data['recommended'] if s.lower() not in existing]
                return field, recommended[:10], data['courses'][:5]

    return None, [], []


@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    try:
        # Log incoming request for debugging
        print(f"Received request: {request.method} {request.path}")
        print(f"Content-Type: {request.content_type}")
        print(f"Content-Length: {request.content_length}")
        
        data = request.json
        print(f"Request data: {data}")
        
        file_url = data.get('file_url')
        candidate_id = data.get('candidate_id')

        if not file_url:
            return jsonify({'success': False, 'error': 'file_url is required'}), 400

        # Download file từ Supabase with timeout and headers
        print(f"Downloading file from: {file_url}")
        response = requests.get(file_url, timeout=30, stream=True)
        response.raise_for_status()
        
        file_buffer = BytesIO(response.content)
        file_buffer.name = file_url.split('/')[-1]
        print(f"Downloaded {len(response.content)} bytes")

        # Parse resume (handles text extraction + classification internally)
        print("Parsing resume...")
        parser = ResumeParser(file_buffer)
        extracted_data = parser.get_extracted_data()
        sections = parser.get_sections()

        # Get raw text for response
        file_buffer.seek(0)
        resume_text = Utils.extract_text(file_buffer)

        # Calculate score — truyền cả sections và extracted_data để cross-check
        resume_score, feedback, tips = calculate_score(sections, extracted_data)

        # Get skill recommendations
        skills = extracted_data.get('skills') or []
        reco_field, recommended_skills, recommended_courses = get_recommendations(skills)

        print(f"Analysis complete. Score: {resume_score}")
        
        return jsonify({
            'success': True,
            'resume_score': resume_score,
            'parsed_data': {
                'name': extracted_data.get('name'),
                'email': extracted_data.get('email'),
                'mobile_number': extracted_data.get('mobile_number'),
                'no_of_pages': extracted_data.get('no_of_pages'),
                'skills': skills,
                'education': extracted_data.get('education'),
                'experience': extracted_data.get('experience'),
                'total_experience': extracted_data.get('total_experience'),
                'text': resume_text[:500] if resume_text else '',
            },
            'details': {
                'feedback': feedback,
                'tips': tips,
                'reco_field': reco_field,
                'recommended_skills': recommended_skills,
                'recommended_courses': recommended_courses,
            }
        })
    except requests.exceptions.RequestException as e:
        print(f"Error downloading file: {str(e)}")
        return jsonify({'success': False, 'error': f'Failed to download file: {str(e)}'}), 400
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    # Use waitress for production-grade serving with proper header handling
    try:
        from waitress import serve
        print("Starting server with Waitress on http://127.0.0.1:5000")
        serve(app, host='127.0.0.1', port=5000, threads=4, channel_timeout=120)
    except ImportError:
        print("Waitress not installed, falling back to Flask dev server")
        print("Install waitress: pip install waitress")
        app.run(host='127.0.0.1', port=5000, debug=False, threaded=True)