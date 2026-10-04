# Media dei sotto-fotogrammi (motion blur). Input: json [[out, sub1, sub2, ...], ...]
import json, sys
import numpy as np
from PIL import Image
for job in json.load(open(sys.argv[1])):
    out, subs = job[0], job[1:]
    acc = None
    for s in subs:
        a = np.asarray(Image.open(s).convert("RGB"), dtype=np.float32)
        # media in luce lineare (gamma 2.2) per scie più naturali
        a = (a / 255.0) ** 2.2
        acc = a if acc is None else acc + a
    img = ((acc / len(subs)) ** (1 / 2.2) * 255.0).clip(0, 255).astype(np.uint8)
    Image.fromarray(img).save(out, quality=95)
print("blend:", len(json.load(open(sys.argv[1]))), "fotogrammi")
