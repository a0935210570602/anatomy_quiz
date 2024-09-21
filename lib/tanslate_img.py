import cv2
import numpy as np

# 讀取圖片
image = cv2.imread('adductor pollicis.jpg')

# 使用拉普拉斯濾波器來增強細節
laplacian = cv2.Laplacian(image, cv2.CV_64F)
sharp_image = cv2.addWeighted(image, 1.5, laplacian, -0.5, 0)

# 保存圖片
cv2.imwrite('sharp_output.jpg', sharp_image)
