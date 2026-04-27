import io
import os
import re
import pandas as pd
import pdfplumber
import docx2txt
from datetime import datetime
from dateutil import relativedelta
from transformers import pipeline

import constants as cs

# ─── Lazy-loaded model singletons ────────────────────────────
_classifier = None
_ner_pipeline = None


def _get_classifier(model_path="autotrain-resume-classifier3"):
    """Lazy-load the text-classification pipeline (GPU → CPU fallback)."""
    global _classifier
    if _classifier is None:
        try:
            # Try to load local model first
            _classifier = pipeline(
                "text-classification",
                model=model_path,
                device=0,  # GPU
            )
        except Exception as e:
            print(f"Failed to load local model: {e}")
            print("Falling back to CPU or alternative model...")
            try:
                _classifier = pipeline(
                    "text-classification",
                    model=model_path,
                    device=-1,  # CPU fallback
                )
            except Exception as e2:
                print(f"Local model failed completely: {e2}")
                print("Using fallback: returning None - classification will be skipped")
                # Return None to skip classification
                return None
    return _classifier


def _get_ner_pipeline():
    """Lazy-load dslim/bert-base-NER for name extraction."""
    global _ner_pipeline
    if _ner_pipeline is None:
        try:
            _ner_pipeline = pipeline(
                "ner",
                model="dslim/bert-base-NER",
                aggregation_strategy="simple",
                device=0,
            )
        except Exception:
            _ner_pipeline = pipeline(
                "ner",
                model="dslim/bert-base-NER",
                aggregation_strategy="simple",
                device=-1,
            )
    return _ner_pipeline


# ═══════════════════════════════════════════════════════════════
# TEXT EXTRACTION
# ═══════════════════════════════════════════════════════════════

def extract_text_from_pdf(pdf_path):
    """
    Extract plain text from a PDF using pdfplumber.
    Supports both local files and remote URLs.

    :param pdf_path: file path (str), URL (str), or BytesIO object
    :return: full text as a single string
    """
    import requests

    text = ""
    pdf_source = None

    try:
        # ── Remote file (URL) ──
        if isinstance(pdf_path, str) and pdf_path.startswith(("http://", "https://")):
            response = requests.get(pdf_path, timeout=30)
            response.raise_for_status()
            pdf_source = io.BytesIO(response.content)

        # ── BytesIO object ──
        elif isinstance(pdf_path, io.BytesIO):
            pdf_path.seek(0)
            pdf_source = pdf_path

        # ── Local file ──
        else:
            pdf_source = pdf_path

        with pdfplumber.open(pdf_source) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

    except Exception:
        pass

    return text


def get_number_of_pages(file_path):
    """
    Return the number of pages in a PDF.

    :param file_path: file path (str) or BytesIO
    :return: int or None
    """
    try:
        if isinstance(file_path, io.BytesIO):
            file_path.seek(0)
            with pdfplumber.open(file_path) as pdf:
                return len(pdf.pages)
        if str(file_path).lower().endswith(".pdf"):
            with pdfplumber.open(file_path) as pdf:
                return len(pdf.pages)
        return None
    except Exception:
        return None


def extract_text_from_docx(doc_path):
    """
    Extract plain text from a .docx file using docx2txt.

    :param doc_path: path to .docx
    :return: text string
    """
    try:
        raw = docx2txt.process(doc_path)
        lines = [line.replace("\t", " ") for line in raw.split("\n") if line]
        return " ".join(lines)
    except Exception:
        return ""


def extract_text_from_doc(doc_path):
    """
    Extract plain text from a .doc file (requires textract).

    :param doc_path: path to .doc
    :return: text string
    """
    try:
        import textract
        return textract.process(doc_path).decode("utf-8")
    except (ImportError, Exception):
        return ""


def extract_text(file_path):
    """
    Auto-detect extension and extract text from PDF / DOCX / DOC.

    :param file_path: file path (str) or BytesIO
    :return: raw text string
    """
    if isinstance(file_path, io.BytesIO):
        ext = os.path.splitext(file_path.name)[1].lower()
    else:
        ext = os.path.splitext(str(file_path))[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".docx":
        return extract_text_from_docx(file_path)
    elif ext == ".doc":
        return extract_text_from_doc(file_path)
    return ""


# ═══════════════════════════════════════════════════════════════
# MODEL-BASED LINE CLASSIFICATION
# ═══════════════════════════════════════════════════════════════

def classify_lines(text_raw, model_path="autotrain-resume-classifier3"):
    """
    Classify every non-empty line with the trained model.

    :param text_raw: raw resume text
    :param model_path: path/name of the text-classification model
    :return: dict  {label: [lines], ..., '_labeled_lines': [(line, label, score)]}
    """
    clf = _get_classifier(model_path)
    
    lines = [l.strip() for l in text_raw.split("\n") if l.strip()]
    if not lines:
        return {"_labeled_lines": []}

    # If classifier failed to load, use fallback keyword-based classification
    if clf is None:
        print("⚠️  Model not available, using keyword-based fallback classification")
        return _fallback_classify_lines(lines)

    try:
        results = clf(lines, truncation=True, max_length=512, batch_size=32)

        sections = {}
        labeled = []
        for line, res in zip(lines, results):
            label, score = res["label"], res["score"]
            labeled.append((line, label, score))
            sections.setdefault(label, []).append(line)

        sections["_labeled_lines"] = labeled
        return sections
    except Exception as e:
        print(f"⚠️  Classification failed: {e}, using fallback")
        return _fallback_classify_lines(lines)


def _fallback_classify_lines(lines):
    """
    Fallback keyword-based classification when model is not available.
    """
    import constants as cs
    
    sections = {}
    labeled = []
    
    for line in lines:
        line_lower = line.lower()
        label = "Other"  # default
        score = 0.5
        
        # Simple keyword matching
        if any(kw in line_lower for kw in ['objective', 'career objective']):
            label = "Obj"
            score = 0.8
        elif any(kw in line_lower for kw in ['summary', 'profile', 'about']):
            label = "Sum"
            score = 0.8
        elif any(kw in line_lower for kw in ['experience', 'work history', 'employment']):
            label = "Exp"
            score = 0.8
        elif any(kw in line_lower for kw in ['education', 'academic', 'qualification']):
            label = "Edu"
            score = 0.8
        elif any(kw in line_lower for kw in ['skill', 'technical', 'competenc']):
            label = "Skill"
            score = 0.8
        elif any(kw in line_lower for kw in ['project', 'portfolio']):
            label = "Proj"
            score = 0.8
        elif any(kw in line_lower for kw in ['contact', 'email', 'phone', 'address']):
            label = "Contact"
            score = 0.7
        
        labeled.append((line, label, score))
        sections.setdefault(label, []).append(line)
    
    sections["_labeled_lines"] = labeled
    return sections


# ═══════════════════════════════════════════════════════════════
# ENTITY EXTRACTION
# ═══════════════════════════════════════════════════════════════

def extract_email(text):
    """
    Extract the first email address from text.

    :param text: plain text
    :return: email string or None
    """
    if not text:
        return None
    matches = re.findall(
        r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text
    )
    return matches[0].strip(";").strip() if matches else None


def extract_mobile_number(text, custom_regex=None):
    """
    Extract the first phone number from text.
    Handles international (+XX), US, VN and generic formats.

    :param text: plain text
    :param custom_regex: optional custom regex string
    :return: phone string or None
    """
    if not text:
        return None

    if custom_regex:
        phone = re.findall(re.compile(custom_regex), text)
        if phone:
            return "".join(phone[0]) if isinstance(phone[0], tuple) else phone[0]
        return None

    patterns = [
        r"(\+\d{1,3}[-. ]?\d{4,14})",                               # +919467891831
        r"(\(?\d{3}\)?[-.\s]*\d{3}[-.\s]*\d{2}[-.\s]*\d{2,4})",  # (XXX) XXX XX XX
        r"(\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})",
        r"(\d{3}[-.\s]\d{3}[-.\s]\d{4})",
        r"(\d{10,12})",
    ]
    for pat in patterns:
        found = re.findall(pat, text)
        if found:
            digits_only = re.sub(r"[^\d+]", "", found[0])
            if len(digits_only.replace("+", "")) >= 7:
                return found[0].strip()
    return None


def extract_name(text):
    """
    Extract a person's name.
    1) Try NER (dslim/bert-base-NER → PER entities).
    2) Fallback: first line that looks like a name (2-5 alpha words).

    :param text: preferably the PI (Personal Info) section
    :return: name string or None
    """
    if not text or not text.strip():
        return None

    lines = text.split("\n")[:10]

    # ── Pre-process: detect spaced-out letter lines ──
    def _collapse_spaced(line):
        stripped = line.strip()
        parts = re.split(r"[\s.]+", stripped)
        if all(len(p) == 1 and p.isalpha() for p in parts) and len(parts) >= 2:
            return "".join(parts)
        return None

    spaced_parts = []
    for line in lines:
        collapsed = _collapse_spaced(line)
        if collapsed:
            spaced_parts.append(collapsed)
        elif spaced_parts:
            break  # stop at first non-spaced line after collecting

    if len(spaced_parts) >= 2:
        return " ".join(spaced_parts).title()

    # ── Strategy 1: heuristic — look for a standalone name line ──
    # In CVs, the name is usually a short line of 2-5 capitalised words

    for line in lines:
        clean = re.sub(r"[^a-zA-Z\s.]", "", line).strip()
        words = clean.split()
        if 2 <= len(words) <= 5 and len(clean) >= 3:
            # Names have at least one capitalised word
            if not any(w[0].isupper() for w in words if w):
                continue
            # Skip section headers
            if clean.lower() not in cs.SECTION_HEADERS:
                has_email = "@" in line
                has_url = bool(re.search(r"www\.|http|linkedin|bit\.ly", line, re.I))
                has_colon = ":" in line  # label:value lines (Phone:, Address:, etc.)
                has_salutation = bool(re.match(r"(?i)^(dear|mr\.?|mrs\.?|ms\.?|sir|madam)\b", clean))
                starts_with_label = any(
                    clean.lower().startswith(p) for p in cs.LABEL_PREFIXES
                )
                if not has_email and not has_url and not has_colon and not has_salutation and not starts_with_label:
                    return clean

    # ── Strategy 2: NER fallback ──
    try:
        ner = _get_ner_pipeline()
        # Use only the first few lines for NER — later lines (headers, labels)
        # can confuse the model and cause mis-classification
        first_lines = "\n".join(text.split("\n")[:5])
        # Clean text for NER: strip unicode icons, phone numbers, URLs, emails
        clean_for_ner = re.sub(r"[^\x00-\x7F]", " ", first_lines)     # non-ASCII → space
        clean_for_ner = re.sub(r"\+?\d[\d\s\-().]{6,}", " ", clean_for_ner)  # phone
        clean_for_ner = re.sub(r"https?://\S+", " ", clean_for_ner)   # URLs
        clean_for_ner = re.sub(r"\S+@\S+", " ", clean_for_ner)        # emails
        clean_for_ner = re.sub(r"\s+", " ", clean_for_ner).strip()
        entities = ner(clean_for_ner[:500])
        current, persons = "", []
        for ent in entities:
            if ent["entity_group"] == "PER":
                current = (current + " " + ent["word"].strip()).strip()
            else:
                if current:
                    persons.append(current)
                    current = ""
        if current:
            persons.append(current)

        for name in persons:
            name = name.strip("#").strip()
            if len(name) >= 2 and not name.isdigit():
                return name
    except Exception:
        pass

    return None


def extract_skills(text, skills_file=None):
    """
    Match text against skills.csv to find known skills.
    Checks unigrams, bigrams and trigrams.

    :param text: plain text (Skill + Exp + Summary sections recommended)
    :param skills_file: path to skills.csv (default: ./skills.csv)
    :return: sorted list of capitalised skill names
    """
    if not text or not text.strip():
        return []

    if not skills_file:
        skills_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "skills.csv"
        )

    try:
        data = pd.read_csv(skills_file)
        skills_db = {s.lower().strip() for s in data.columns.values}
    except Exception:
        return []

    text_lower = text.lower()
    tokens = set(re.findall(r"[\w#+.]+", text_lower))

    words = text_lower.split()
    bigrams = {" ".join(words[i : i + 2]) for i in range(len(words) - 1)}
    trigrams = {" ".join(words[i : i + 3]) for i in range(len(words) - 2)}

    all_tokens = tokens | bigrams | trigrams

    found = {
        skill
        for skill in skills_db
        if skill in all_tokens and skill not in cs.COMMON_WORDS
    }
    return sorted(s.capitalize() for s in found)


def extract_education(text):
    """
    Find education entries from text.
    Strategy:
      1. Match lines containing EDUCATION_KEYWORDS → structured (degree, year)
      2. Fallback: any non-header line with a year pattern (model already
         classified the text as Edu, so it's likely education content)

    :param text: plain text (Edu section recommended)
    :return: list of (degree, year) tuples, degree strings, or raw education lines
    """
    if not text or not text.strip():
        return []

    # Header words to skip ("Education", "Academic Background", etc.)
    skip_headers = cs.SECTION_HEADERS

    edu_keywords_set = {kw.upper() for kw in cs.EDUCATION_KEYWORDS}
    edu = {}  # keyword → context line
    lines = [l.strip() for l in text.split("\n") if l.strip()]

    # ── Pass 1: keyword matching ──
    for i, line in enumerate(lines):
        # Skip pure section headers
        if line.lower().strip() in skip_headers:
            continue
        for word in line.split():
            clean = re.sub(r"[?|$|.|!|,;:()\-]", "", word)
            if (
                clean.upper() in edu_keywords_set
                and clean.lower() not in cs.COMMON_WORDS
            ):
                # Short keywords (≤2 chars like BE, ME, MS, BA) must be
                # UPPER CASE in the original text to avoid matching common
                # English words ("be", "me", "as", etc.)
                if len(clean) <= 2 and not word.isupper():
                    continue
                # Use the full line as key (more informative than just keyword)
                edu[line] = line
                if i + 1 < len(lines) and lines[i + 1].lower().strip() not in skip_headers:
                    edu[line] += " " + lines[i + 1]
                break  # one keyword per line is enough

    education = []
    for entry_line, ctx in edu.items():
        year = re.search(cs.YEAR_PATTERN, ctx)
        if year:
            education.append((entry_line, year.group(0)))
        else:
            education.append(entry_line)

    # ── Pass 2 fallback: if no keywords matched, grab lines with years ──
    if not education:
        for line in lines:
            if line.lower().strip() in skip_headers:
                continue
            year = re.search(cs.YEAR_PATTERN, line)
            if year:
                education.append((line, year.group(0)))

    # ── Pass 3 fallback: still empty? return all non-header lines ──
    if not education:
        for line in lines:
            if line.lower().strip() not in skip_headers:
                education.append(line)

    return education


def extract_experience(text):
    """
    Extract experience entries that contain date ranges.
    Supports: Jan 2020 – Mar 2021, Aug '20 - Jan '21, 2019-2021, etc.

    :param text: plain text (Exp section recommended)
    :return: list of dicts  {'position': str, 'period': str}
    """
    if not text or not text.strip():
        return []

    # Month name (3+ chars)
    _mon = r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?"
    # Year: 2020 or '20
    _yr = r"(?:\d{4}|'\d{2})"
    # A single date token
    _date = rf"(?:{_mon}\s*{_yr}|\d{{1,2}}/{_yr}|{_yr})"

    date_re = re.compile(
        rf"({_date}\s*[-–—]\s*(?:{_date}|present|current|now))",
        re.IGNORECASE,
    )

    experiences = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        m = date_re.search(line)
        if m:
            period = m.group(0).strip()
            position = line[: m.start()].strip().rstrip("|,-–—")
            if not position:
                position = line[m.end() :].strip().lstrip("|,-–—")
            if not position:
                position = line
            experiences.append({"position": position.strip(), "period": period})
    return experiences


def get_total_experience(text):
    """
    Sum total months of work experience found in date ranges.
    Supports: Jan 2020 – Mar 2021, Aug '20 - Jan '21, 2019-2021, etc.

    :param text: plain text with date ranges
    :return: total months (int)
    """
    if not text or not text.strip():
        return 0

    _mon = r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?"
    _yr  = r"(?:\d{4}|'\d{2})"
    _date = rf"(?:{_mon}\s*{_yr}|{_yr})"

    total = 0
    for line in text.split("\n"):
        for m in re.finditer(
            rf"(?P<start>{_date})\s*[-–—]\s*(?P<end>{_date}|present|current|now)",
            line,
            re.IGNORECASE,
        ):
            total += _months_between(m.group("start"), m.group("end"))
    return total


# ─── private helpers ──────────────────────────────────────────

def _months_between(d1_str, d2_str):
    """Return the number of months between two date strings."""
    if d2_str.lower() in ("present", "current", "now"):
        d2_str = datetime.now().strftime("%b %Y")

    def _normalise(s):
        """Convert 'YY → 20YY and strip extra chars."""
        s = s.strip().strip("'")
        # Aug '20 → Aug 2020
        m = re.match(r"([a-zA-Z]+\.?)\s*'(\d{2})$", s.strip())
        if m:
            yr = int(m.group(2))
            full_yr = 2000 + yr if yr < 50 else 1900 + yr
            return f"{m.group(1)} {full_yr}"
        # '20 → 2020  (year only)
        m2 = re.match(r"'(\d{2})$", s.strip())
        if m2:
            yr = int(m2.group(1))
            full_yr = 2000 + yr if yr < 50 else 1900 + yr
            return str(full_yr)
        return s

    d1_str = _normalise(d1_str)
    d2_str = _normalise(d2_str)

    fmts = ["%b %Y", "%B %Y", "%b. %Y", "%m/%Y", "%Y"]

    def _parse(s):
        for f in fmts:
            try:
                return datetime.strptime(s.strip(), f)
            except ValueError:
                continue
        # Truncate long month name → 3 chars
        parts = s.strip().split()
        if len(parts) >= 2:
            try:
                return datetime.strptime(parts[0][:3] + " " + parts[-1], "%b %Y")
            except ValueError:
                pass
        return None

    d1, d2 = _parse(d1_str), _parse(d2_str)
    if d1 and d2:
        diff = relativedelta.relativedelta(d2, d1)
        return max(diff.years * 12 + diff.months, 0)
    return 0