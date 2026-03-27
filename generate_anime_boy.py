#!/usr/bin/env python3
"""
Generate cool anime style images based on a highly specific description of the boy.
"""

import json
import urllib.request
import urllib.error
import base64
import os
import time

API_KEY = "AIzaSyDyfIeskAInbtQxFe1J6akGVUWaDfI7n38"
MODEL = "gemini-2.5-flash-image"
OUT_DIR = "./anime_boy_icons"

URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

def generate_image(prompt: str, output_path: str) -> bool:
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "temperature": 0.7
        }
    }).encode("utf-8")

    req = urllib.request.Request(URL, data=payload, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode())
            for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
                if "inlineData" in part:
                    with open(output_path, "wb") as f:
                        f.write(base64.b64decode(part["inlineData"]["data"]))
                    return True
        return False
    except urllib.error.HTTPError as e:
        print(f"  ❌ HTTP {e.code}: {e.read().decode()[:150]}")
        return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    
    prompts = [
        # Prompt 1: Ghibli / Wholesome Anime style
        ("A high-quality Studio Ghibli style anime illustration of a 5-year-old Chinese boy with a round cute face, "
         "slightly chubby cheeks, and short neat black hair. He has a calm, cool, slightly serious expression. "
         "He is wearing a traditional festive red velvet vest with fluffy white fur trim, over a black long-sleeved shirt and black pants. "
         "He is sitting on a vintage wooden chair, holding a large shiny gold Yuanbao (ingot). "
         "Red festive background with subtle calligraphy. Warm studio lighting, masterpiece, detailed anime art."),
        
        # Prompt 2: Cool Shonen anime
        ("A stylish modern Shonen anime illustration of a 5-year-old Asian boy with a round face, short black hair, "
         "and a cool, serious boss-like expression. He is wearing a red traditional Chinese winter vest with white fur trim over black clothing. "
         "He is sitting confidently on a classic wooden chair holding a glowing giant gold ingot. The background is vibrant red with bold "
         "black ink calligraphy. Sharp lines, vibrant colors, cool anime shading, highly detailed."),
        
        # Prompt 3: Cool Chibi Style
        ("A highly adorable yet cool Kawaii Chibi anime illustration of a 5-year-old boy. He has a round chubby face, short black hair, "
         "and looks very cool and calm. He wears a traditional Chinese red vest with white fur edge, black shirt, and black pants. "
         "He sits on a classic wooden chair holding a giant gold Yuanbao. Solid red background with faint traditional patterns, "
         "soft lighting, vibrant bright colors, adorable yet cool expression, high quality anime render.")
    ]
    
    for i, p in enumerate(prompts):
        out_file = os.path.join(OUT_DIR, f"anime_boy_real_{i+1}.png")
        print(f"🎨 Generating Style {i+1}...")
        print(f"📝 Prompt: {p[:100]}...")
        if generate_image(p, out_file):
            print(f"✅ Saved to {out_file}\n")
        else:
            print(f"❌ Failed to generate style {i+1}\n")
        time.sleep(2)  

if __name__ == "__main__":
    main()
