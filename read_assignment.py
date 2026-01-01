from pypdf import PdfReader

try:
    reader = PdfReader("Full Stack Web Developer Intern - Assignment.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print("---START-CONTENT---")
    print(text)
    print("---END-CONTENT---")
except Exception as e:
    print(f"Error reading PDF: {e}")
