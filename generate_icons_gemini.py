#!/usr/bin/env python3
"""Generate 10 test icons using prompts from agents.json, with id as filename prefix."""

import json
import urllib.request
import urllib.error
import base64
import time
import os

API_KEY = "AIzaSyDyfIeskAInbtQxFe1J6akGVUWaDfI7n38"
MODEL = "gemini-2.5-flash-image"
ICONS_DIR = "./agent_icons"
AGENTS_FILE = "./agents.json"

URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"


def generate_icon(prompt: str, output_path: str) -> bool:
    payload = json.dumps({
        "contents": [{"parts": [{"text": f"Generate an image: {prompt}"}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
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
    with open(AGENTS_FILE, "r", encoding="utf-8") as f:
        agents = json.loads(f.read())

    # Pick 10 agents with prompts, spread across different styles
    with_prompts = [a for a in agents if a.get("prompt")]
    # Take first 10
    selected = with_prompts[:10]

    os.makedirs(ICONS_DIR, exist_ok=True)
    success = 0

    for i, agent in enumerate(selected):
        aid = agent["id"]
        title = agent["title"]
        prompt = agent["prompt"]
        output_path = os.path.join(ICONS_DIR, f"{aid}.png")

        print(f"[{i+1}/10] 🎨 id={aid} | {title}")
        print(f"  📝 {prompt[:100]}...")

        ok = generate_icon(prompt, output_path)
        if ok:
            size_kb = os.path.getsize(output_path) // 1024
            print(f"  ✅ Saved: {aid}.png ({size_kb}KB)")
            success += 1
        else:
            print(f"  ❌ Failed")

        if i < 9:
            time.sleep(2)

    print(f"\n🏁 Done! {success}/10 success")


if __name__ == "__main__":
    main()
