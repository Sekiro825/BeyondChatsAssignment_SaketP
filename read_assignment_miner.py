from pdfminer.high_level import extract_text

try:
    text = extract_text("Full Stack Web Developer Intern - Assignment.pdf")
    print("---START-CONTENT---")
    print(text)
    print("---END-CONTENT---")
except Exception as e:
    print(f"Error reading PDF with pdfminer: {e}")
