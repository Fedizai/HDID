import os

filepaths = ['shop.html', 't-shirts.html']

for path in filepaths:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. REMOVE THE BAD CARDS
        # We find everything between the first "New Product Insert" and the "Product 1" hook
        start_hook = '<!-- New Product Insert -->'
        end_hook = '<!-- Product 1: Black and White -->'
        
        if start_hook in content and end_hook in content:
            start_index = content.find(start_hook)
            end_index = content.find(end_hook)
            
            if start_index != -1 and end_index != -1 and end_index > start_index:
                content = content[:start_index] + content[end_index:]
                print(f"Removed bad cards from {path}")

        # 2. INJECT INTO THE T-SHIRT CAROUSEL
        # Find the end of the carousel for Product 1 and inject 6 and 7
        target_img_block = '<img src="./images/1st_item_tshirt/4.png" alt="Black and White 4"\n                                class="product-img carousel-slide">'
        
        # In shop.html the spacing is slightly different
        alt_target = '<img src="./images/1st_item_tshirt/4.png" alt="Black and White 4" class="product-img carousel-slide">'
        
        new_imgs = '''
                            <img src="./images/1st_item_tshirt/6.PNG" alt="1st_item_tshirt view 6" class="product-img carousel-slide">
                            <img src="./images/1st_item_tshirt/7.png" alt="1st_item_tshirt view 7" class="product-img carousel-slide">'''
        
        if target_img_block in content:
            content = content.replace(target_img_block, target_img_block + new_imgs)
            print(f"Injected new images into carousel for {path}")
        elif alt_target in content:
            content = content.replace(alt_target, alt_target + new_imgs)
            print(f"Injected new images into carousel for {path} (alt spacing)")
            
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

