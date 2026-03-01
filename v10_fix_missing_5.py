import os

files_to_update = ['1st_item_tshirt.html', 't-shirts.html', 'shop.html']

for path in files_to_update:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # The image currently right before the new ones
        target_img = '<img src="./images/1st_item_tshirt/4.png" alt="Black and White 4" class="product-img carousel-slide">'
        alt_target = '<img src="./images/1st_item_tshirt/4.png" alt="Black and White 4"\n                                class="product-img carousel-slide">'
        
        # We need to insert 5.png right after 4.png.
        # But wait, 6.PNG and 7.png are already there. 
        # Let's just find 4.png and slip 5.png immediately after it.
        img_5 = '\n                            <img src="./images/1st_item_tshirt/5.png" alt="1st_item_tshirt view 5" class="product-img carousel-slide">'
        
        # In 1st_item_tshirt.html the spacing is different
        alt_target_2 = '<img src="./images/1st_item_tshirt/4.png" alt="Black and White 4" class="product-img carousel-slide">'
        img_5_alt = '\n                    <img src="./images/1st_item_tshirt/5.png" alt="1st_item_tshirt view 5" class="product-img carousel-slide">'

        if path == '1st_item_tshirt.html':
            if alt_target_2 in content:
                content = content.replace(alt_target_2, alt_target_2 + img_5_alt)
                print(f"Added 5.png to {path}")
        else:
            if target_img in content:
                content = content.replace(target_img, target_img + img_5)
                print(f"Added 5.png to {path}")
            elif alt_target in content:
                content = content.replace(alt_target, alt_target + img_5)
                print(f"Added 5.png to {path} (alt spacing)")

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
