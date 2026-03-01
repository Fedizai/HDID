import glob

html_files = glob.glob('*.html')
for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "&copy; 2026 HDID" in content:
        content = content.replace("&copy; 2026 HDID", "HDID &copy; 2026")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
