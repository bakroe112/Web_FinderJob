import os
import io
import pprint
import multiprocessing as mp

import Utils


class ResumeParser:
    def __init__(
        self,
        resume,
        skills_file=None,
        custom_regex=None,
        model_path="autotrain-resume-classifier3",
    ):
        self.__skills_file = skills_file
        self.__custom_regex = custom_regex
        self.__model_path = model_path

        self.__details = {
            "name": None,
            "email": None,
            "mobile_number": None,
            "skills": None,
            "education": None,
            "experience": None,
            "total_experience": None,
            "no_of_pages": None,
        }

        # Resolve file path
        self.__resume = resume
        self.__file_path = (
            resume.name if isinstance(resume, io.BytesIO) else resume
        )

        # Step 1 — extract raw text (pass actual file object, not just filename)
        if isinstance(resume, io.BytesIO):
            resume.seek(0)
        self.__text_raw = Utils.extract_text(self.__resume)
        self.__text = " ".join(self.__text_raw.split())

        # Step 2 — model classifies every line → grouped sections
        self.__sections = Utils.classify_lines(
            self.__text_raw, self.__model_path
        )

        # Step 3 — extract structured details from each section
        self.__get_basic_details()

    # ── public API ────────────────────────────────────────────

    def get_extracted_data(self):
        """Return the full extraction dict."""
        return self.__details

    def get_sections(self):
        """Return section groups (without debug info)."""
        return {
            k: v for k, v in self.__sections.items() if k != "_labeled_lines"
        }

    def get_labeled_lines(self):
        """Return list of (line, label, score) for debugging."""
        return self.__sections.get("_labeled_lines", [])

    # ── private extraction logic ──────────────────────────────

    def __get_basic_details(self):
        """
        Route each label's text to the matching extractor.
        Model labels: PI, Exp, Edu, Skill, Sum, Obj, QC, Others
        """
        pi_text = "\n".join(self.__sections.get("PI", []))
        exp_text = "\n".join(self.__sections.get("Exp", []))
        edu_text = "\n".join(self.__sections.get("Edu", []))
        skill_text = "\n".join(self.__sections.get("Skill", []))
        sum_text = "\n".join(self.__sections.get("Sum", []))

        # Name — prefer PI section, fallback full text
        self.__details["name"] = (
            Utils.extract_name(pi_text)
            if pi_text
            else Utils.extract_name(self.__text_raw)
        )

        # Email — PI first, then full text
        self.__details["email"] = Utils.extract_email(
            pi_text
        ) or Utils.extract_email(self.__text)

        # Phone — PI first, then full text
        self.__details["mobile_number"] = Utils.extract_mobile_number(
            pi_text, self.__custom_regex
        ) or Utils.extract_mobile_number(self.__text, self.__custom_regex)

        # Skills — Skill + Exp + Summary context
        skill_ctx = "\n".join([skill_text, exp_text, sum_text])
        self.__details["skills"] = Utils.extract_skills(
            skill_ctx if skill_ctx.strip() else self.__text_raw,
            self.__skills_file,
        )

        # Education — primarily from Edu section;
        # fallback to Exp text (some CVs mix edu into experience),
        # then full text
        edu_result = Utils.extract_education(edu_text) if edu_text.strip() else []
        if not edu_result:
            edu_result = Utils.extract_education(exp_text) if exp_text.strip() else []
        if not edu_result:
            edu_result = Utils.extract_education(self.__text_raw)
        self.__details["education"] = edu_result

        # Experience entries
        self.__details["experience"] = Utils.extract_experience(
            exp_text if exp_text else self.__text_raw
        )

        # Total experience (years)
        total_months = Utils.get_total_experience(
            exp_text if exp_text else self.__text_raw
        )
        self.__details["total_experience"] = (
            round(total_months / 12, 2) if total_months else 0
        )

        # Page count
        if isinstance(self.__resume, io.BytesIO):
            self.__resume.seek(0)
        self.__details["no_of_pages"] = Utils.get_number_of_pages(
            self.__resume
        )


# ── multiprocessing helper ────────────────────────────────────

def resume_result_wrapper(resume):
    """Convenience wrapper for pool.apply_async."""
    return ResumeParser(resume).get_extracted_data()

if __name__ == "__main__":
    file_path = "./resumes/resume 3.pdf"

    parser = ResumeParser(file_path)
    data = parser.get_extracted_data()

    print(f"\n{'=' * 60}")
    print(f"  {file_path}")
    print("=" * 60)

    print(f"  Name:        {data['name']}")
    print(f"  Email:       {data['email']}")
    print(f"  Phone:       {data['mobile_number']}")
    print(f"  Pages:       {data['no_of_pages']}")
    print(f"  Experience:  {data['total_experience']} years")

    print(f"\n  Education:")
    if data["education"]:
        for edu in data["education"]:
            if isinstance(edu, tuple):
                print(f"   - {edu[0]}  ({edu[1]})")
            else:
                print(f"   - {edu}")
    else:
        print("   (not found)")

    print(f"\n  Work Experience:")
    if data["experience"]:
        for exp in data["experience"]:
            print(f"   - {exp['position']} | {exp['period']}")
    else:
        print("   (not found)")

    print(f"\n  Skills ({len(data['skills']) if data['skills'] else 0}):")
    if data["skills"]:
        print(f"   {', '.join(data['skills'])}")
    else:
        print("   (not found)")

    # ── Labeled lines (model classification) ──
    print(f"\n{'─' * 60}")
    print("  Section Classification (label → text)")
    print("─" * 60)
    sections = parser.get_sections()
    for label in sorted(sections.keys()):
        lines = sections[label]
        print(f"\n  [{label}] ({len(lines)} lines)")
        for line in lines:
            print(f"    {line[:120]}")