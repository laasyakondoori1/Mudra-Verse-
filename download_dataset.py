"""
MudraVerse -- Kaggle Multi-Dataset Downloader
Downloads both pose and mudra datasets, copies one representative
image per class into src/assets/mudras/ for use in the project.
"""

import sys
import shutil
from pathlib import Path

try:
    import kagglehub
except ImportError:
    sys.exit("Run:  pip install kagglehub")

dest = Path(__file__).parent / "src" / "assets" / "mudras"
dest.mkdir(parents=True, exist_ok=True)

# ── Helper ─────────────────────────────────────────────────────────────────────
def collect_images(root: Path):
    exts = ("*.jpg", "*.jpeg", "*.png", "*.webp")
    imgs = []
    for ext in exts:
        imgs.extend(root.rglob(ext))
    return imgs

def extract_classes(root: Path, all_images: list, skip_prefix: str = ""):
    """
    Returns dict {slug: first_image_path}.
    Looks one level deep (skipping a top-level wrapper folder if needed).
    """
    classes = {}
    for img_path in sorted(all_images):
        parts = img_path.relative_to(root).parts
        if len(parts) < 2:
            continue
        # If top-level folder matches skip_prefix, go one level deeper
        class_name = parts[1] if parts[0].lower().startswith(skip_prefix.lower()) and skip_prefix else parts[0]
        class_name = (class_name
                      .replace(" Augmented", "")
                      .replace(" augmented", "")
                      .replace("_", " ")
                      .strip())
        slug = class_name.lower().replace(" ", "-")
        if slug not in classes:
            classes[slug] = img_path
    return classes

# ── Dataset 1: Full-body poses ─────────────────────────────────────────────────
print("=" * 60)
print("Dataset 1: pranavmanoj/bharatnatyam-dance-poses")
print("=" * 60)
path1 = kagglehub.dataset_download("pranavmanoj/bharatnatyam-dance-poses")
print(f"Path: {path1}")
root1 = Path(path1)
imgs1 = collect_images(root1)
print(f"Found {len(imgs1)} images")
classes1 = extract_classes(root1, imgs1, skip_prefix="new")
for slug, src in classes1.items():
    dst = dest / f"pose-{slug}{src.suffix.lower()}"
    shutil.copy2(src, dst)
    print(f"  OK  pose-{slug}{src.suffix.lower()}")

# ── Dataset 2: Hand mudras (balanced) ─────────────────────────────────────────
print()
print("=" * 60)
print("Dataset 2: krithi9977/bharatanatyam-mudra-dataset-balanced")
print("=" * 60)
path2 = kagglehub.dataset_download("krithi9977/bharatanatyam-mudra-dataset-balanced")
print(f"Path: {path2}")
root2 = Path(path2)
imgs2 = collect_images(root2)
print(f"Found {len(imgs2)} images")

# Print folder structure to understand layout
folders = sorted({str(p.parent.relative_to(root2)) for p in imgs2})
print("Folder structure:")
for f in folders[:50]:
    n = len([p for p in imgs2 if str(p.parent.relative_to(root2)) == f])
    print(f"  {f}/ -> {n} images")

# Extract classes - try two-level deep first, then one-level
classes2 = {}
for img_path in sorted(imgs2):
    parts = img_path.relative_to(root2).parts
    if len(parts) < 2:
        continue
    # Try to find the most meaningful class name
    # Usually: <split>/<class>/<image> or <class>/<image>
    if len(parts) >= 3 and parts[0].lower() in ("train", "test", "val", "valid", "validation"):
        class_name = parts[1]
    elif len(parts) >= 2:
        class_name = parts[0] if len(parts) == 2 else parts[1]
    else:
        continue
    class_name = class_name.replace("_", " ").strip()
    slug = class_name.lower().replace(" ", "-")
    if slug not in classes2:
        classes2[slug] = img_path

print(f"\nClasses found ({len(classes2)}):")
for slug, src in classes2.items():
    dst = dest / f"mudra-{slug}{src.suffix.lower()}"
    shutil.copy2(src, dst)
    print(f"  OK  mudra-{slug}{src.suffix.lower()}")

# ── Summary ────────────────────────────────────────────────────────────────────
print()
print("=" * 60)
print(f"Total assets in {dest}:")
for f in sorted(dest.iterdir()):
    print(f"  {f.name}")
print("=" * 60)
print("Done.")
