from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
from flask_cors import CORS
import numpy as np
import os
import logging
import colorsys

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'uploads'

# Настройка логирования
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])

# Предопределенные спектральные цвета (RGB)
SPECTRAL_COLORS = {
    'красный': (255, 0, 0),
    'оранжевый': (255, 165, 0),
    'желтый': (255, 255, 0),
    'зеленый': (0, 255, 0),
    'голубой': (0, 191, 255),
    'синий': (0, 0, 255),
    'фиолетовый': (128, 0, 128),
    'черный': (0, 0, 0),
    'белый': (255, 255, 255)
}

# Конвертируем спектральные цвета в HLS
def rgb_to_hls(rgb):
    r, g, b = [x / 255.0 for x in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360, s, l

SPECTRAL_COLORS_HLS = {color: rgb_to_hls(rgb) for color, rgb in SPECTRAL_COLORS.items()}

# Функция для определения ближайшего спектрального цвета
def nearest_spectral_color(pixel_color):
    min_distance = float('inf')
    closest_color = None
    pixel_hls = rgb_to_hls(pixel_color)

    for color_name, spectral_hls in SPECTRAL_COLORS_HLS.items():
        distance = np.sqrt(sum((pixel_hls[i] - spectral_hls[i]) ** 2 for i in range(3)))  # Расстояние в HLS
        if distance < min_distance:
            min_distance = distance
            closest_color = color_name

    return closest_color

# Функция для подсчета спектральных цветов в изображении
def count_spectral_colors(image, resize_to=(100, 100)):
    color_count = {color: 0 for color in SPECTRAL_COLORS.keys()}
    image = image.convert('RGB').resize(resize_to)
    pixels = np.array(image)

    for row in pixels:
        for pixel in row:
            nearest_color = nearest_spectral_color(pixel)
            color_count[nearest_color] += 1

    return color_count

# Функция для сортировки по преобладающему цвету
def sort_by_spectral_dominance(spectral_data):
    # Определяем порядок цветов для сортировки
    color_order = ['белый', 'красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'синий', 'фиолетовый', 'черный']
    
    # Сортируем по порядку цвета и количеству пикселей
    sorted_data = sorted(spectral_data, key=lambda x: (color_order.index(x['dominant_color']), -x['color_counts'][x['dominant_color']]))
    return sorted_data

# Функция для поиска top_n изображений по цвету
def sort_by_top_n(spectral_data, target_color_rgb, n):
    target_color_hls = rgb_to_hls(target_color_rgb)

    def color_distance(image_data):
        dominant_color_hls = rgb_to_hls(SPECTRAL_COLORS[image_data['dominant_color']])
        return np.linalg.norm(np.subtract(dominant_color_hls, target_color_hls))

    sorted_data = sorted(spectral_data, key=color_distance)[:n]
    return sorted_data

# Глобальный список для хранения данных по загруженным изображениям
spectral_data = []

# Обрабатываем изображения и сохраняем результаты
@app.route("/upload", methods=["POST"])
def upload_images():
    uploaded_files = request.files.getlist("file")
    
    if not uploaded_files:
        return jsonify({"error": "No files uploaded"}), 400

    global spectral_data
    spectral_data = []

    for file in uploaded_files:
        try:
            img = Image.open(file)
            img_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            img.save(img_path)
            
            # Считаем спектральные цвета
            color_counts = count_spectral_colors(img)
            dominant_color = max(color_counts, key=color_counts.get)

            spectral_data.append({
                "filename": file.filename,
                "dominant_color": dominant_color,
                "color_counts": color_counts
            })
        
        except Exception as e:
            logging.error(f"Error processing image {file.filename}: {e}")
            return jsonify({"error": f"Error processing image {file.filename}: {str(e)}"}), 500
    
    return jsonify(spectral_data)

# Обрабатываем сортировку
@app.route("/sort", methods=["POST"])
def sort_images():
    sort_type = request.json.get("sort_type")
    
    if sort_type == "spectr":
        sorted_data = sort_by_spectral_dominance(spectral_data)
    elif sort_type == "top_n":
        target_color = request.json.get("color")
        n = request.json.get("n")
        sorted_data = sort_by_top_n(spectral_data, target_color, n)
    else:
        return jsonify({"error": "Invalid sort_type"}), 400

    return jsonify(sorted_data)

@app.route('/files/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/')
def index():
    return jsonify(True)

if __name__ == "__main__":
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5122)
