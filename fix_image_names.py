import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace the old "Black and white" paths to the new "1st_item/1.png" style
    content = content.replace('Black and white/Black and white front 1.png', '1st_item/1.png')
    content = content.replace('Black and white/Black and white front 2.png', '1st_item/2.png')
    content = content.replace('Black and white/Black and white back 1.png', '1st_item/3.png')
    content = content.replace('Black and white/Black and white back 2.png', '1st_item/4.png')

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

# Update cart.js default add-to-cart image references
with open('src/cart.js', 'r', encoding='utf-8') as f:
    cart_js = f.read()

orig_cart = cart_js
cart_js = cart_js.replace('1st_item/1_Black_and_white_3d_1.png', '1st_item/1.png')
cart_js = cart_js.replace('Black and white/Black and white front 1.png', '1st_item/1.png')

if cart_js != orig_cart:
    with open('src/cart.js', 'w', encoding='utf-8') as f:
        f.write(cart_js)
    print("Updated src/cart.js")

