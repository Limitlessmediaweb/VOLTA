#!/usr/bin/env bash
# Encode finale: bloom sulle sole alte luci (copia sfocata sommata in screen), grana fine temporale,
# H.264 High yuv420p CRF 18 preset slow, AAC muto, faststart. Uso: bash scripts/encode.sh
set -euo pipefail
cd "$(dirname "$0")/.."
GRADE="format=gbrp,split[a][b];[b]curves=all='0/0 0.72/0 1/1',gblur=sigma=26[bl];[a][bl]blend=all_mode=screen:all_opacity=0.42,noise=alls=7:allf=t+u,scale=out_color_matrix=bt709:out_range=tv,format=yuv420p"
ffmpeg -y -hide_banner -loglevel warning -stats \
  -framerate 60 -i frames/%05d.jpg \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -filter_complex "[0:v]${GRADE}[v]" -map "[v]" -map 1:a -shortest \
  -c:v libx264 -profile:v high -preset slow -crf 18 -pix_fmt yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -r 60 -fps_mode cfr \
  -c:a aac -b:a 128k -movflags +faststart \
  volta-spot-tiktok.mp4
SIZE=$(stat -c %s volta-spot-tiktok.mp4)
echo "dimensione: $((SIZE/1024/1024)) MB"
if [ "$SIZE" -gt $((30*1024*1024)) ]; then
  ffmpeg -y -hide_banner -loglevel warning -i volta-spot-tiktok.mp4 \
    -c:v libx264 -profile:v high -preset slow -crf 20 -maxrate 9M -bufsize 18M -pix_fmt yuv420p -r 60 \
    -c:a aac -b:a 128k -movflags +faststart volta-spot-tiktok-share.mp4
  echo "creato volta-spot-tiktok-share.mp4"
fi
