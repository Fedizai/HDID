import os
import shutil
import re

source_dir = '/Users/fedizayen/.gemini/antigravity/scratch/clothing-ecommerce'
theme_dir = os.path.join(source_dir, 'HDID-Custom-Theme')

# 1. Flatten Images
assets_dir = os.path.join(theme_dir, 'assets')
image_map = {}
images_dir = os.path.join(source_dir, 'images')
if os.path.exists(images_dir):
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.startswith('.'): continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, source_dir) # e.g., images/1st_item_tshirt/1.png
            safe_name = rel_path.replace('/', '_').replace('\\', '_').replace(' ', '_')
            shutil.copy(full_path, os.path.join(assets_dir, safe_name))
            image_map[f"./{rel_path}"] = safe_name
            image_map[f"/{rel_path}"] = safe_name
            image_map[rel_path] = safe_name

def apply_liquid_assets(html_str):
    for old_src, new_src in image_map.items():
        html_str = html_str.replace(old_src, f"{{{{ '{new_src}' | asset_url }}}}")
    return html_str

def map_hrefs(html_str):
    routes = {
        'shop.html': '/collections/all',
        'catalog.html': '/collections/all',
        'wishlist.html': '/pages/wishlist',
        't-shirts.html': '/collections/t-shirts',
        'sweatpants.html': '/collections/sweatpants',
        'accesories.html': '/collections/accesories',
        'index.html': '/',
        'cart.html': '/cart',
        'login.html': '/account/login',
        'return-policy.html': '/pages/return-policy',
        'pre-order-status.html': '/pages/pre-order-status',
        '1st_item_tshirt.html': '/products/1st-item-tshirt'
    }
    for old, new in routes.items():
        html_str = re.sub(fr'href="{old}"', f'href="{new}"', html_str)
        html_str = re.sub(fr"href='{old}'", f"href='{new}'", html_str)
    return html_str

def extract_main_content(file_path):
    if not os.path.exists(file_path): return ""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Attempt to extract <main>
    main_match = re.search(r'<main[^>]*>(.*?)</main>', content, re.DOTALL | re.IGNORECASE)
    if main_match:
        html = main_match.group(1)
    else:
        # Fallback to body minus header
        body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
        html = body_match.group(1) if body_match else content
        # Remove original header if it exists
        html = re.sub(r'<header[^>]*>.*?</header>', '', html, flags=re.DOTALL | re.IGNORECASE)
        
    html = map_hrefs(html)
    html = apply_liquid_assets(html)
    return html

# 2. Map pages to specific Section names and Schema names
pages = [
    ('shop.html', 'hdid-collection-all', 'collection.json', 'HDID Catalog Grid'),
    ('t-shirts.html', 'hdid-collection-tshirts', 'collection.t-shirts.json', 'HDID T-Shirts Grid'),
    ('sweatpants.html', 'hdid-collection-sweatpants', 'collection.sweatpants.json', 'HDID Sweatpants Grid'),
    ('accesories.html', 'hdid-collection-accessories', 'collection.accesories.json', 'HDID Accessories Grid'),
    ('1st_item_tshirt.html', 'hdid-product-tshirt', 'product.json', 'HDID Product Detail'),
    ('cart.html', 'hdid-cart-page', 'cart.json', 'HDID Custom Cart'),
    ('wishlist.html', 'hdid-wishlist-page', 'page.wishlist.json', 'HDID Custom Wishlist'),
    ('return-policy.html', 'hdid-return-policy', 'page.return-policy.json', 'HDID Return Policy'),
    ('pre-order-status.html', 'hdid-pre-order', 'page.pre-order-status.json', 'HDID Pre-Order Status'),
]

for html_file, section_name, template_name, schema_name in pages:
    source_path = os.path.join(source_dir, html_file)
    if not os.path.exists(source_path): continue

    content = extract_main_content(source_path)
    
    # Write SECTION
    section_code = f"""
<div class="hdid-custom-section">
  {{{{ 'style_v2.css' | asset_url | stylesheet_tag }}}}
  {content}
</div>

{{% schema %}}
{{
  "name": "{schema_name}",
  "settings": [],
  "presets": [
    {{
      "name": "{schema_name}"
    }}
  ]
}}
{{% endschema %}}
"""
    with open(os.path.join(theme_dir, 'sections', f'{section_name}.liquid'), 'w', encoding='utf-8') as f:
        f.write(section_code)

    # Write TEMPLATE JSON
    json_code = f"""{{
  "sections": {{
    "main": {{
      "type": "{section_name}",
      "settings": {{}}
    }}
  }},
  "order": [
    "main"
  ]
}}"""
    with open(os.path.join(theme_dir, 'templates', template_name), 'w', encoding='utf-8') as f:
        f.write(json_code)

# 3. Add JS
for js_file in ['src/main.js', 'src/carousel.js', 'src/side_panel.js', 'src/wishlist.js']:
    if os.path.exists(os.path.join(source_dir, js_file)):
        shutil.copy(os.path.join(source_dir, js_file), assets_dir)

print("Migration completed to HDID-Custom-Theme")
