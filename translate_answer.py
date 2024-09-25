import json

# 讀取 JSON 文件
folder_name = 'group4'
with open(f'./data/{folder_name}/image_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 定義轉換規則
def replace_terms(answer):
    answer = answer.lower()  # 轉換為小寫
    answer = answer.replace('m.', 'muscle')  # 替換 m. 為 muscle
    answer = answer.replace('n.', 'nerve')    # 替換 n. 為 nerve
    answer = answer.replace('a.', 'artery')   
    answer = answer.replace('v.', 'vein')   
    answer = answer.replace('lig.', 'ligament')   
    answer = answer.replace('ant.', 'anterior')   
    answer = answer.replace('post.', 'posterior')   
    answer = answer.replace('sup.', 'superior')   
    answer = answer.replace('inf.', 'inferior')   
    answer = answer.replace('med.', 'medial')   
    answer = answer.replace('lat.', 'lateral')   
    answer = answer.replace('br.', 'branch')

    answer = answer.replace('ivc', 'inferior vena cava')   
    answer = answer.replace('svc', 'superior vena cava')   
    answer = answer.replace('lca', 'left coronary artery')   
    answer = answer.replace('rca', 'right coronary artery')   
    
    # 去掉 '(' 及其後面的內容
    if '(' in answer:
        answer = answer.split('(')[0].strip()  # 去掉 '(' 及其後的內容，並去除前後空格
    return answer

# 將每個項目的 answer 欄位轉換
for item in data:
    item['answer'] = replace_terms(item['answer'])

# 將修改後的數據寫回 JSON 文件
with open(f'./data/{folder_name}/image_data1.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("所有答案已轉換為小寫並進行了規則替換，並去掉了括號及其後的內容。")
