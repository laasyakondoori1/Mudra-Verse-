import os
import sys
import shutil
from pathlib import Path

try:
    from roboflow import Roboflow
except ImportError:
    sys.exit("Run: pip install roboflow")

# To download datasets from Roboflow Universe, you need a Private API Key, 
# not the Publishable key used for frontend inference.
api_key = os.environ.get("ROBOFLOW_API_KEY")

if not api_key:
    print("=" * 60)
    print("ERROR: Missing ROBOFLOW_API_KEY")
    print("To download the dataset, you need your Private API Key.")
    print("1. Go to https://app.roboflow.com/")
    print("2. Navigate to Settings > Roboflow Keys")
    print("3. Copy your Private API Key")
    print("4. Run this script like so (in PowerShell):")
    print("   $env:ROBOFLOW_API_KEY='your_private_key_here'; python download_roboflow_dataset.py")
    print("=" * 60)
    sys.exit(1)

dest = Path(__file__).parent / "src" / "assets" / "mudras"
dest.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("Downloading Dataset: soudamini-9akmp/kuchipudi-mudras/4")
print("=" * 60)

rf = Roboflow(api_key=api_key)
project = rf.workspace("soudamini-9akmp").project("kuchipudi-mudras")
version = project.version(4)
dataset = version.download("yolov8")

root = Path(dataset.location)

# YOLO format typically has a structure like:
# /train/images/
# /valid/images/
# /test/images/
# But wait, in Roboflow classification or object detection, image filenames are typically hashed.
# If it's classification, the folders are the class names: /train/class_name/img.jpg
# Since we need representative images for the UI, let's gather them.

def collect_images(folder: Path):
    exts = ("*.jpg", "*.jpeg", "*.png", "*.webp")
    imgs = []
    for ext in exts:
        imgs.extend(folder.rglob(ext))
    return imgs

print("\nExtracting representative images to src/assets/mudras...")
all_images = collect_images(root)

# Attempt to infer class from filename or folder structure.
# Often Roboflow filenames are formatted as: class_name_hash.jpg
classes = {}
for img in all_images:
    # If the parent folder is a split (train/valid/test), the next folder might be the class 
    # (if classification). If it's 'images', then the class might be in the filename.
    parts = img.relative_to(root).parts
    
    if "images" in parts:
        # Object detection format: labels are in a separate .txt file, but often the filename 
        # is prefixed with the class name, e.g., "Alapadma_001_jpg.rf.hash.jpg"
        filename = img.stem
        class_candidate = filename.split("_")[0].lower()
    else:
        # Classification format: train/class_name/img.jpg
        class_candidate = parts[-2].lower()
        
    slug = class_candidate.replace(" ", "-")
    
    if slug and slug not in classes and slug not in ["images", "train", "test", "valid"]:
        classes[slug] = img

for slug, src in classes.items():
    dst = dest / f"rf-{slug}{src.suffix.lower()}"
    shutil.copy2(src, dst)
    print(f"  OK  rf-{slug}{src.suffix.lower()}")

print("=" * 60)
print(f"Dataset downloaded to: {root}")
print("Representative images copied to src/assets/mudras!")
print("=" * 60)
