import os
import json

# 設定圖片資料夾名稱
image_folder = "data/group4/images"

# 構建包含圖片名稱和答案的列表
data_list = []

# 遍歷資料夾中的所有文件
for filename in os.listdir(image_folder):
    if filename.endswith(".jpg"):  # 檢查是否為 .jpg 圖片
        # 構建每個項目的字典，答案為文件名去掉擴展名
        item = {
            "image": filename,
            "answer": os.path.splitext(filename)[0]
        }
        data_list.append(item)

# 將列表保存為 JSON 文件
json_filename = "image_data.json"
with open(json_filename, 'w', encoding='utf-8') as json_file:
    json.dump(data_list, json_file, ensure_ascii=False, indent=4)

print(f"JSON file '{json_filename}' created successfully.")
