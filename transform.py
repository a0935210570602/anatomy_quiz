from PIL import Image
import pillow_heif
import os

def convert_image_to_jpg(input_path, output_path):
    # 獲取文件擴展名
    ext = os.path.splitext(input_path)[1].lower()
    
    if ext == '.heic':
        # 處理 .heic 圖片
        heif_file = pillow_heif.open_heif(input_path)
        image = Image.frombytes(
            heif_file.mode,
            heif_file.size,
            heif_file.data,
            "raw",
            heif_file.mode,
            heif_file.stride,
        )
    else:
        # 處理其他格式的圖片
        image = Image.open(input_path)

    # 將圖片轉換為 RGB 模式以保存為 JPEG
    rgb_image = image.convert('RGB')
    
    # 保存到指定的目錄
    rgb_image.save(output_path, 'JPEG')

def batch_convert_to_jpg(input_directory, output_directory):
    # 確保輸出目錄存在，若不存在則創建
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # 遍歷 "第一組" 資料夾下的所有文件
    for filename in os.listdir(input_directory):
        file_path = os.path.join(input_directory, filename)
        ext = os.path.splitext(filename)[1].lower()

        # 只處理圖片類型的文件
        if ext in ['.png', '.jpeg', '.jpg', '.heic']:
            output_filename = os.path.splitext(filename)[0] + '.jpg'
            output_path = os.path.join(output_directory, output_filename)

            try:
                # 轉換圖片並保存
                convert_image_to_jpg(file_path, output_path)
                print(f"成功轉換: {filename} -> {output_filename}")
            except Exception as e:
                print(f"無法轉換 {filename}: {str(e)}")
        else:
            print(f"跳過不支持的文件格式: {filename}")

# 使用範例：
input_directory = './data/group4/images'  # "第一組" 目錄路徑
output_directory = './data/group4/images1'  # "轉換後" 目錄路徑
batch_convert_to_jpg(input_directory, output_directory)
