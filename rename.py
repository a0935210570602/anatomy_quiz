import os
import re

# 設定圖片資料夾路徑
images_dir = 'images'

# 取得資料夾中的所有檔案
files = os.listdir(images_dir)

# 過濾掉以 'image' 開頭的檔案
filtered_files = [f for f in files if not f.startswith('image')]

# 排序檔案名（可選）
filtered_files.sort()

# 重新命名檔案
for index, file_name in enumerate(filtered_files, start=6):
    # 原檔案完整路徑
    old_file_path = os.path.join(images_dir, file_name)
    
    # 新檔案名稱
    new_file_name = f'image{index}.jpg'
    new_file_path = os.path.join(images_dir, new_file_name)
    
    # 重新命名檔案
    os.rename(old_file_path, new_file_path)
    print(f'Renamed {old_file_path} to {new_file_path}')
