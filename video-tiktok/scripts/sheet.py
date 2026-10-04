# Contact sheet: python scripts/sheet.py "<glob>" out.png cols [step]
import sys, glob
from PIL import Image, ImageDraw
pat, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3])
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
files = sorted(glob.glob(pat))[::step]
ims = [Image.open(f) for f in files]
w, h = ims[0].size
tw = 1800 // cols; th = int(h * tw / w)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * th), "#333")
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im.convert("RGB").resize((tw, th)), (x, y))
    d.text((x + 6, y + 6), f.replace("\\", "/").split("/")[-1], fill="#0f0")
sheet.save(out)
print(len(ims), sheet.size)
