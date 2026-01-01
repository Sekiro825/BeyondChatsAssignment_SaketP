from pdfminer.high_level import extract_text

try:
    text = extract_text("Full Stack Web Developer Intern - Assignment.pdf")
    with open("assignment_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Text saved to assignment_text.txt")
except Exception as e:
    print(f"Error: {e}")
