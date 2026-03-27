#!/usr/bin/env python3
"""
Generate clean, unified 3D clay-style icon prompts for each agent.
No API calls needed — uses keyword matching to pick the right symbol.
"""

import json
import re

AGENTS_FILE = "./agents.json"

# ============================================================
# Category → (keywords, main_objects, background_colors)
# Each agent is matched to a category by title/description keywords.
# A main object is picked based on the best keyword match.
# ============================================================

CATEGORIES = [
    # --- Coding / Tech ---
    {
        "keywords": ["python", "code", "coding", "developer", "engineer", "programming", "debug",
                      "github", "copilot", "typescript", "javascript", "react", "vue", "angular",
                      "frontend", "front-end", "backend", "fullstack", "api", "sdk", "devops",
                      "leetcode", "algorithm", "sql", "database", "css", "html", "swift", "kotlin",
                      "java", "c++", "rust", "golang", "ruby", "php", "node", "deno", "terminal",
                      "ssh", "linux", "docker", "kubernetes", "git", "repo", "autoGen", "codey",
                      "10x engineer", "grimoire", "software"],
        "objects": [
            "a rounded laptop computer with a code bracket symbol on screen",
            "a pair of angled code brackets < > stacked together",
            "a small gear icon next to a code terminal window",
            "a rounded computer monitor showing a simple bracket symbol",
        ],
        "backgrounds": ["light indigo-to-lavender", "soft blue-to-white", "light slate-to-lavender"],
    },
    # --- AI / Machine Learning ---
    {
        "keywords": ["ai", "gpt", "llm", "machine learning", "neural", "deep learning", "model",
                      "chatgpt", "openai", "prompt", "diffusion", "midjourney", "dalle", "flux",
                      "autogpt", "langchain", "agent", "agi", "智能", "transformer"],
        "objects": [
            "a small glowing brain icon with a subtle sparkle",
            "a rounded robot head with friendly dot eyes",
            "a lightbulb with a tiny star inside",
            "a small chat bubble with a sparkle dot",
        ],
        "backgrounds": ["soft purple-to-lavender", "light blue-to-white", "soft violet-to-pink"],
    },
    # --- Writing / Content ---
    {
        "keywords": ["write", "writing", "writer", "essay", "blog", "article", "content", "copy",
                      "copywriting", "story", "novel", "book", "author", "script", "screenplay",
                      "ghostwriter", "文案", "写作", "文章", "作文", "笔记", "文书", "小说"],
        "objects": [
            "a fountain pen resting on a small notepad",
            "an open book with a few pages gently turning",
            "a quill pen next to a rolled scroll",
            "a pencil leaning against a small stack of papers",
        ],
        "backgrounds": ["warm cream-to-peach", "soft amber-to-cream", "light beige-to-soft-orange"],
    },
    # --- Translation / Language ---
    {
        "keywords": ["translate", "translation", "翻译", "language", "english", "spanish",
                      "french", "japanese", "chinese", "korean", "vocab", "grammar",
                      "proofreader", "校正", "语言", "日本語", "français", "español"],
        "objects": [
            "two overlapping speech bubbles in different colors",
            "a small globe with a speech bubble",
            "two arrows pointing in opposite directions between two dots",
            "an open dictionary with a bookmark ribbon",
        ],
        "backgrounds": ["soft teal-to-white", "light blue-to-mint", "soft cyan-to-cream"],
    },
    # --- Education / Learning ---
    {
        "keywords": ["tutor", "teacher", "learn", "education", "study", "course", "lesson",
                      "mentor", "coach", "training", "primer", "teach", "导师", "老师",
                      "学习", "教育", "辅导", "考试", "quiz", "flashcard", "math"],
        "objects": [
            "a graduation cap sitting on top of an open book",
            "a small chalkboard with a pointer stick",
            "an apple sitting on a stack of books",
            "a lightbulb above an open textbook",
        ],
        "backgrounds": ["warm yellow-to-cream", "soft green-to-white", "light amber-to-ivory"],
    },
    # --- Medical / Health ---
    {
        "keywords": ["doctor", "medical", "health", "medicine", "therapy", "therapist",
                      "diagnosis", "symptom", "mental health", "psychology", "counseling",
                      "fitness", "workout", "gym", "exercise", "nutrition", "diet", "wellness",
                      "医", "健康", "心理", "治疗", "痤疮", "健身"],
        "objects": [
            "a stethoscope draped in a gentle curve",
            "a heart shape with a small plus sign",
            "a first aid cross symbol with rounded corners",
            "a small pill capsule in two-tone colors",
        ],
        "backgrounds": ["soft mint-to-white", "light teal-to-cream", "soft green-to-white"],
    },
    # --- Business / Finance ---
    {
        "keywords": ["business", "startup", "ceo", "marketing", "sales", "finance", "stock",
                      "invest", "entrepreneur", "ecommerce", "ads", "advertising", "seo",
                      "analytics", "strategy", "negotiate", "tax", "accounting", "商业",
                      "创业", "营销", "广告", "金融", "swot"],
        "objects": [
            "a small bar chart with ascending bars",
            "a briefcase with a subtle upward arrow",
            "a line graph trending upward on a small card",
            "a coin stack with a small growth arrow",
        ],
        "backgrounds": ["soft blue-to-gray", "light navy-to-white", "soft slate-to-cream"],
    },
    # --- Art / Image / Design ---
    {
        "keywords": ["art", "artist", "design", "designer", "image", "photo", "draw", "paint",
                      "illustration", "logo", "icon", "creative", "color", "canvas", "sketch",
                      "sticker", "cartoon", "anime", "pixar", "watercolor", "coloring",
                      "绘画", "画", "设计", "美术", "插画"],
        "objects": [
            "an artist palette with a small brush",
            "a paintbrush leaving a colorful stroke",
            "a framed canvas with abstract color shapes",
            "a pencil and a small color wheel side by side",
        ],
        "backgrounds": ["soft pink-to-lavender", "light coral-to-cream", "soft peach-to-white"],
    },
    # --- Music / Audio ---
    {
        "keywords": ["music", "song", "audio", "sound", "melody", "piano", "guitar", "singing",
                      "podcast", "voice", "beat", "歌", "音乐", "曲"],
        "objects": [
            "a pair of headphones with a small music note floating above",
            "a music note symbol with soft rounded edges",
            "a small microphone with a subtle sound wave",
            "a vinyl record with a tiny music note",
        ],
        "backgrounds": ["soft purple-to-pink", "light coral-to-lavender", "warm rose-to-cream"],
    },
    # --- Video / YouTube ---
    {
        "keywords": ["video", "youtube", "tiktok", "film", "movie", "cinema", "thumbnail",
                      "streaming", "视频", "短视频", "影视"],
        "objects": [
            "a play button triangle on a rounded rectangle",
            "a small film clapboard",
            "a video camera with a subtle play icon",
            "a compact TV screen with a play triangle",
        ],
        "backgrounds": ["soft red-to-pink", "light coral-to-cream", "warm orange-to-peach"],
    },
    # --- Game / RPG ---
    {
        "keywords": ["game", "rpg", "adventure", "quest", "dungeon", "fantasy", "play",
                      "puzzle", "chess", "trivia", "江湖", "武林", "冒险", "遊戲", "游戏"],
        "objects": [
            "a game controller with rounded buttons",
            "a cute shield with a small star emblem",
            "a six-sided dice showing a star face",
            "a small treasure chest slightly open with a glow",
        ],
        "backgrounds": ["soft purple-to-blue", "light indigo-to-lavender", "soft teal-to-cyan"],
    },
    # --- Chat / Companion / Girlfriend/Boyfriend ---
    {
        "keywords": ["chat", "companion", "friend", "girlfriend", "boyfriend", "lover", "romance",
                      "date", "relationship", "sweetheart", "waifu", "bestie", "emotional",
                      "女友", "男友", "恋爱", "情感", "陪伴", "倾诉", "树洞", "聊天",
                      "女朋友", "妈妈", "爸爸", "sister", "bro"],
        "objects": [
            "two small heart shapes side by side",
            "a cute chat bubble with a heart inside",
            "a smiling rounded face emoji with rosy cheeks",
            "a small love letter envelope with a heart seal",
        ],
        "backgrounds": ["warm pink-to-peach", "soft rose-to-lavender", "light blush-to-cream"],
    },
    # --- Divination / Astrology / Fortune ---
    {
        "keywords": ["astrology", "tarot", "fortune", "zodiac", "horoscope", "divination",
                      "mystic", "occult", "占卜", "算命", "星座", "塔罗", "周易", "八卦",
                      "玄学", "风水", "命理"],
        "objects": [
            "a crystal ball on a small stand with subtle sparkles",
            "a crescent moon with a small star",
            "a tarot card with an abstract star pattern",
            "a yin-yang symbol in soft pastel tones",
        ],
        "backgrounds": ["soft violet-to-indigo", "deep lavender-to-purple", "soft navy-to-blue"],
    },
    # --- Food / Cooking ---
    {
        "keywords": ["food", "cook", "recipe", "chef", "bake", "kitchen", "meal", "restaurant",
                      "cocktail", "coffee", "tea", "美食", "烹饪", "菜谱"],
        "objects": [
            "a chef hat sitting on a steaming pot",
            "a fork and spoon crossed over a small plate",
            "a cupcake with a small cherry on top",
            "a steaming bowl with chopsticks resting on the rim",
        ],
        "backgrounds": ["warm orange-to-cream", "soft peach-to-yellow", "light coral-to-ivory"],
    },
    # --- Legal ---
    {
        "keywords": ["legal", "law", "lawyer", "attorney", "court", "contract", "compliance",
                      "法律", "律师", "法规"],
        "objects": [
            "a balanced scale of justice",
            "a small gavel on a wooden block",
            "a shield with a small balance scale inside",
        ],
        "backgrounds": ["soft navy-to-gray", "light slate-to-blue", "soft blue-to-white"],
    },
    # --- Travel / Geography ---
    {
        "keywords": ["travel", "trip", "tourism", "nomad", "city", "country", "weather",
                      "map", "trail", "hike", "outdoor", "旅游", "旅行", "天气"],
        "objects": [
            "a small globe with a location pin",
            "a compass with a simple needle pointing north",
            "a suitcase with a small plane icon",
            "a map pin marker with a subtle heart",
        ],
        "backgrounds": ["soft sky-blue-to-white", "light teal-to-cream", "soft green-to-blue"],
    },
    # --- Pet / Animal ---
    {
        "keywords": ["pet", "dog", "cat", "animal", "puppy", "kitten", "猫", "狗", "宠物"],
        "objects": [
            "a cute paw print with a small heart",
            "a small dog bone and a tiny heart",
            "a cat face silhouette with whiskers",
            "a rounded pet collar with a heart tag",
        ],
        "backgrounds": ["warm peach-to-cream", "soft orange-to-ivory", "light brown-to-cream"],
    },
    # --- Productivity / Tools ---
    {
        "keywords": ["productivity", "planner", "calendar", "todo", "task", "schedule",
                      "organize", "note", "excel", "pdf", "file", "convert", "ocr", "scan",
                      "summary", "summarize", "日程", "效率", "工具"],
        "objects": [
            "a clipboard with a small checkmark",
            "a calendar page with a highlighted date",
            "a gear icon with a small wrench",
            "a folded document with a small magnifier",
        ],
        "backgrounds": ["soft blue-to-white", "light gray-to-blue", "soft teal-to-cream"],
    },
    # --- History / Philosophy / Culture ---
    {
        "keywords": ["history", "philosophy", "culture", "ancient", "classic", "wisdom",
                      "confucius", "socrates", "stoic", "历史", "哲学", "文化", "国学",
                      "王阳明", "鲁迅", "孙子", "三国", "金庸", "论语"],
        "objects": [
            "an ancient scroll partially unrolled",
            "a small bamboo brush pen on an ink stone",
            "a traditional lantern with a soft glow",
            "an open old book with a bookmark ribbon",
        ],
        "backgrounds": ["warm amber-to-cream", "soft sepia-to-ivory", "warm gold-to-beige"],
    },
    # --- Security / Encryption ---
    {
        "keywords": ["security", "password", "encrypt", "guard", "protect", "shield", "secret",
                      "cipher", "hack", "安全", "密码", "加密"],
        "objects": [
            "a padlock with a small keyhole",
            "a shield with a lock icon in the center",
            "a key with a rounded bow",
        ],
        "backgrounds": ["soft gray-to-blue", "light slate-to-teal", "soft steel-to-white"],
    },
    # --- Social Media / Meme ---
    {
        "keywords": ["social media", "twitter", "instagram", "tiktok", "meme", "viral",
                      "hashtag", "小红书", "tweet", "post", "emoji"],
        "objects": [
            "a hashtag symbol with rounded edges",
            "a heart button with a small notification dot",
            "a megaphone with a tiny heart coming out",
            "a chat bubble with a trending arrow",
        ],
        "backgrounds": ["soft pink-to-blue", "light coral-to-lavender", "soft magenta-to-cream"],
    },
    # --- Email / Communication ---
    {
        "keywords": ["email", "mail", "newsletter", "inbox", "message", "邮件", "通讯"],
        "objects": [
            "a sealed envelope with a small paper plane",
            "an open envelope with a letter peeking out",
            "a mailbox with a small flag up",
        ],
        "backgrounds": ["soft blue-to-white", "light sky-to-cream", "soft gray-to-blue"],
    },
    # --- PPT / Presentation ---
    {
        "keywords": ["ppt", "presentation", "slide", "powerpoint", "keynote", "演示", "汇报"],
        "objects": [
            "a presentation screen on a small easel",
            "a slide frame with a simple pie chart inside",
            "a projector icon with a subtle light beam",
        ],
        "backgrounds": ["soft orange-to-cream", "light amber-to-white", "soft coral-to-peach"],
    },
    # --- Data / Research ---
    {
        "keywords": ["data", "research", "analysis", "analyst", "chart", "statistics",
                      "science", "paper", "academic", "scholar", "论文", "研究", "数据",
                      "分析", "学术"],
        "objects": [
            "a magnifying glass over a small bar chart",
            "a pie chart with distinct colored segments",
            "a beaker with a small atom symbol beside it",
            "a stack of papers with a small search icon",
        ],
        "backgrounds": ["soft blue-to-lavender", "light cyan-to-white", "soft teal-to-gray"],
    },
]

# Default fallback for unmatched agents
DEFAULT = {
    "objects": [
        "a friendly rounded robot face with dot eyes and a subtle smile",
        "a small sparkle star with a tiny chat bubble",
        "a rounded square with a subtle AI sparkle inside",
        "a lightbulb with a small gear symbol",
    ],
    "backgrounds": ["soft blue-to-lavender", "light gray-to-blue", "soft purple-to-white"],
}

PROMPT_TEMPLATE = (
    "A soft 3D clay-style {object}, matte finish with subtle shading, "
    "clean minimalist composition, soft diffused studio lighting, gentle shadows, "
    "{background} gradient background, rounded square app icon, centered, no text no letters"
)


def match_category(title: str, description: str) -> dict:
    """Match an agent to a category by keyword matching."""
    text = f"{title} {description}".lower()
    best_cat = None
    best_score = 0

    for cat in CATEGORIES:
        score = sum(1 for kw in cat["keywords"] if kw.lower() in text)
        if score > best_score:
            best_score = score
            best_cat = cat

    if best_cat and best_score > 0:
        return best_cat
    return DEFAULT


def generate_prompt(agent_id: int, title: str, description: str) -> str:
    """Generate a clean, unified icon prompt for an agent."""
    cat = match_category(title, description)
    objects = cat.get("objects", DEFAULT["objects"])
    backgrounds = cat.get("backgrounds", DEFAULT["backgrounds"])

    # Deterministic selection based on agent id for variety within category
    obj = objects[agent_id % len(objects)]
    bg = backgrounds[agent_id % len(backgrounds)]

    return PROMPT_TEMPLATE.format(object=obj, background=bg)


def main():
    with open(AGENTS_FILE, "r", encoding="utf-8") as f:
        agents = json.load(f)

    total = len(agents)
    print(f"📊 Total agents: {total}")
    print(f"🎯 Generating unified clay-style prompts...\n")

    # Category stats
    cat_stats = {}

    for i, agent in enumerate(agents):
        aid = agent.get("id", i)
        title = agent.get("title", "Unknown")
        desc = agent.get("description", "")

        prompt = generate_prompt(aid, title, desc)
        agent["prompt"] = prompt

        # Track category for stats
        cat = match_category(title, desc)
        cat_name = "default"
        for ci, c in enumerate(CATEGORIES):
            if c is cat:
                # Get category name from first keyword
                cat_name = c["keywords"][0]
                break
        cat_stats[cat_name] = cat_stats.get(cat_name, 0) + 1

        if (i + 1) % 100 == 0 or i == 0:
            print(f"  [{i+1}/{total}] {title}: {prompt[:80]}...")

    # Save
    with open(AGENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(agents, f, ensure_ascii=False, indent=2)

    print(f"\n✅ All {total} prompts generated and saved!")
    print(f"\n📊 Category distribution:")
    for cat_name, count in sorted(cat_stats.items(), key=lambda x: -x[1]):
        print(f"  {cat_name}: {count}")


if __name__ == "__main__":
    main()
