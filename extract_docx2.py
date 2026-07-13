import zipfile
import xml.etree.ElementTree as ET
import re

docx = r"C:\Users\PC\AppData\Roaming\Claude\local-agent-mode-sessions\711134a4-2887-4ee8-a9cd-39b85825bd0c\1b728fdb-a739-4c8d-b699-6ebfe6dad5e5\local_80adf3c0-b2b6-4112-ab70-e9589c7acf7b\uploads\nicola_fixed.docx"
out = r"C:\Users\PC\Desktop\umbrc\docx_content2.txt"

ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

with zipfile.ZipFile(docx) as z:
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)

root = tree.getroot()
lines = []
for para in root.iter(f'{ns}p'):
    texts = []
    for t in para.iter(f'{ns}t'):
        if t.text:
            texts.append(t.text)
    line = ''.join(texts).strip()
    if line:
        lines.append(line)

with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Done! {len(lines)} paragraphs extracted.")
