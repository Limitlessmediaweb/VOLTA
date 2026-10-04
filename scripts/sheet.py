import sys, glob
from PIL import Image
pat, out, cols = sys.argv[1], sys.argv[2], int(sys.argv[3])
files = sorted(glob.glob(pat))
ims = [Image.open(f) for f in files]
w, h = ims[0].size
sc = 0.3 if w > 1000 else 0.45
tw, th = int(w*sc), int(h*sc)
rows = (len(ims)+cols-1)//cols
sheet = Image.new("RGB", (cols*tw, rows*th), "white")
for i, im in enumerate(ims):
    sheet.paste(im.resize((tw, th)), ((i%cols)*tw, (i//cols)*th))
sheet.save(out)
print(len(ims), sheet.size)
