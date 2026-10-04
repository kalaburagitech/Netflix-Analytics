import json
import sys
from pathlib import Path

nb_path = Path("notebooks/netflix_data_analysis.ipynb")
with open(nb_path, "r", encoding="utf-8") as f:
    nb = json.load(f)

# Update Title cell
nb["cells"][0]["source"] = [
    "# 🎬 KalaburagiTech Netflix Analytics Platform (EDA)\n",
    "\n",
    "Enterprise Exploratory Data Analysis on the Netflix Movies & TV Shows Dataset.\n",
    "Engineered and maintained by **KalaburagiTech**.\n",
    "\n",
    "This notebook performs end-to-end data ingestion, reproducible cleaning, and analytical visualizations exploring content types, maturity ratings, movie durations, international production hubs, genre distributions, and historical release trends.\n"
]

# Update data loading cell (cell index 2)
nb["cells"][2]["source"] = [
    "from pathlib import Path\n",
    "import pandas as pd\n",
    "import matplotlib.pyplot as plt\n",
    "\n",
    "# Ensure outputs directory exists\n",
    "output_dir = Path('outputs')\n",
    "if not output_dir.exists() and (Path('..') / 'outputs').exists():\n",
    "    output_dir = Path('..') / 'outputs'\n",
    "output_dir.mkdir(parents=True, exist_ok=True)\n",
    "\n",
    "# Locate dataset with relative fallback\n",
    "candidates = [\n",
    "    Path('data') / 'netflix_titles.csv',\n",
    "    Path('..') / 'data' / 'netflix_titles.csv',\n",
    "    Path('netflix_titles.csv'),\n",
    "    Path('..') / 'netflix_titles.csv'\n",
    "]\n",
    "\n",
    "data_path = None\n",
    "for c in candidates:\n",
    "    if c.exists():\n",
    "        data_path = c\n",
    "        break\n",
    "\n",
    "if not data_path:\n",
    "    raise FileNotFoundError(f'Could not find netflix_titles.csv in {candidates}')\n",
    "\n",
    "df = pd.read_csv(data_path)\n",
    "print(f'Loaded raw dataset from {data_path}: {df.shape[0]} rows, {df.shape[1]} columns')\n",
    "df.head(3)\n"
]

# Update author or metadata if any
if "authors" in nb.get("metadata", {}):
    nb["metadata"]["authors"] = [{"name": "KalaburagiTech"}]

with open(nb_path, "w", encoding="utf-8") as f:
    json.dump(nb, f, indent=1)

print("Notebook successfully updated with KalaburagiTech branding and robust path fallbacks.")
