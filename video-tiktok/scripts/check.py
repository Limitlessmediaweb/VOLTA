# Controllo dello spot finito:
#  - ffprobe: 1080x1920, 60 fps costanti, yuv420p, durata 20-24 s
#  - contact sheet con 1 fotogramma al secondo (check/contact-sheet.jpg) + safe zone disegnate
#  - frame neri/bianchi non voluti (luminanza media) fuori da 0,0-0,8 s
#  - lampeggi: conta i salti di luminanza > 20% in ogni finestra di 1 s (devono essere <= 3)
# Uso: python scripts/check.py [video]
import json, subprocess, sys, os
import numpy as np
from PIL import Image, ImageDraw

video = sys.argv[1] if len(sys.argv) > 1 else "volta-spot-tiktok.mp4"
os.makedirs("check", exist_ok=True)

p = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", video]))
v = next(s for s in p["streams"] if s["codec_type"] == "video")
a = [s for s in p["streams"] if s["codec_type"] == "audio"]
dur = float(p["format"]["duration"])
print(f"video: {v['width']}x{v['height']} {v['codec_name']} {v.get('profile')} {v['pix_fmt']} r={v['r_frame_rate']} avg={v['avg_frame_rate']} frames={v.get('nb_frames')}")
print(f"audio: {[s['codec_name'] for s in a]}  durata: {dur:.2f} s  dimensione: {int(p['format']['size'])/1048576:.1f} MB")
ok = v["width"] == 1080 and v["height"] == 1920 and v["pix_fmt"] == "yuv420p" and v["r_frame_rate"] == "60/1" and v["avg_frame_rate"] == "60/1" and 20 <= dur <= 24 and a
print("SPECIFICHE:", "OK" if ok else "NON OK")

# luminanza per fotogramma (ridotto a 54x96)
raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", video, "-vf", "scale=54:96,format=gray", "-f", "rawvideo", "-"])
L = np.frombuffer(raw, np.uint8).reshape(-1, 96, 54).astype(np.float32) / 255.0
mean = L.mean(axis=(1, 2))
fps = 60
bad = [(i / fps, float(m)) for i, m in enumerate(mean) if i / fps > 0.8 and (m < 0.004 or m > 0.92)]
print("frame neri/bianchi non voluti:", "nessuno" if not bad else bad[:10])
jumps = np.abs(np.diff(mean)) > 0.2
worst = max(int(jumps[i : i + fps].sum()) for i in range(0, max(1, len(jumps) - fps)))
print(f"lampeggi (salti di luminanza >20%) nella finestra di 1 s peggiore: {worst}  ->", "OK" if worst <= 3 else "TROPPI")

# contact sheet 1 fotogramma/s con safe zone (150 alto, 380 basso, 140 destra)
n = int(dur)
tw, th = 270, 480
cols = 6
sheet = Image.new("RGB", (cols * tw, ((n + cols - 1) // cols) * th), "#222")
d = ImageDraw.Draw(sheet)
for s in range(n):
    f = f"check/s{s:02d}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s + 0.5:.2f}", "-i", video, "-frames:v", "1", f], check=True)
    im = Image.open(f).convert("RGB").resize((tw, th))
    x, y = (s % cols) * tw, (s // cols) * th
    sheet.paste(im, (x, y))
    k = tw / 1080
    d.rectangle([x, y + 150 * k, x + tw - 140 * k, y + th - 380 * k], outline="#00ff66")
    d.text((x + 4, y + 4), f"{s + 0.5:.1f}s", fill="#00ff66")
sheet.save("check/contact-sheet.jpg", quality=88)
print("contact sheet: check/contact-sheet.jpg")
