import os

# 指定要遍歷的資料夾
folder_path = './data/group4/images'  # 替換為你的資料夾路徑

# 遍歷資料夾中的所有檔案
for filename in os.listdir(folder_path):
    old_path = os.path.join(folder_path, filename)

    # 進行替換
    new_filename = filename.replace('_', '.')
    new_filename = new_filename.replace(' (', '(')
    new_path = os.path.join(folder_path, new_filename)

    # 重新命名檔案
    if old_path != new_path:  # 確保新舊路徑不同
        os.rename(old_path, new_path)
        print(f'檔案 {filename} 已重新命名為 {new_filename}')
