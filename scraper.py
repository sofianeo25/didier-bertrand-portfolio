import urllib.request
import re
import json

base_url = 'https://didier-bertrand.com/'

def get_html(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        return urllib.request.urlopen(req).read().decode('utf-8')
    except Exception as e:
        return ""

pages = [
    '',
    'portfolios/',
    'about-me/',
    'contact-me/'
]

all_images = set()
about_text = ""

for page in pages:
    html = get_html(base_url + page)
    # Extracts all images
    images = re.findall(r'https?://didier-bertrand.com/wp-content/uploads/[^\s\"\'\>]+?\.jpg', html)
    for img in images:
        if '-150x' not in img and '-300x' not in img:
            all_images.add(img)
            
    # Quick extraction of paragraphs for About me
    if 'about' in page:
        # crude regex for paragraphs
        paras = re.findall(r'<p.*?>(.*?)</p>', html, re.DOTALL | re.IGNORECASE)
        # remove tags
        cleaned_paras = [re.sub(r'<[^>]+>', '', p).strip() for p in paras]
        cleaned_paras = [p for p in cleaned_paras if p and len(p) > 20]
        about_text = "\n\n".join(cleaned_paras)

# Filter out low-res variants if a higher-res one exists
filtered_images = []
for img in all_images:
    # Try to clean -1024x..., -768x... etc
    clean = re.sub(r'-\d+x\d+(\.jpg)$', r'\1', img)
    clean = re.sub(r'-scaled(\.jpg)$', r'\1', clean)
    filtered_images.append((clean, img))

# Prefer highest res or scaled
best_images = {}
for clean, original in filtered_images:
    if clean not in best_images:
        best_images[clean] = original
    else:
        if 'scaled' in original or '1536' in original or '2048' in original:
            best_images[clean] = original

final_images = list(best_images.values())

with open('scraped_data.json', 'w') as f:
    json.dump({"images": final_images, "about_text": about_text}, f, indent=2)

print("Scraping done.")
