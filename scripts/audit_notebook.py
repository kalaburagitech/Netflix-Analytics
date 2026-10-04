import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('notebooks/netflix_data_analysis.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

print(f"Total cells: {len(nb['cells'])}")
print("Metadata:", json.dumps(nb.get('metadata', {}), indent=2))

for i, cell in enumerate(nb['cells']):
    ctype = cell.get('cell_type')
    src = ''.join(cell.get('source', []))
    first_lines = ' | '.join(line.strip() for line in src.splitlines()[:2] if line.strip())
    print(f"[{i:02d}] ({ctype}): {first_lines[:120]}")
