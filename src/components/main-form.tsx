import React, { useState, ChangeEvent } from 'react';
import { UploadData } from './upload-data';
import { SelectedParams } from './selected-params';
import { SelectedSort } from './selected-sort';
import { downloadHtml } from './download-html';

type ImageData = {
  filename: string;
  dominant_color: string;
  color_counts: {
    [key: string]: number;
  };
};

export const MainForm = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startedSort, setStartedSort] = useState(false);
  const [imagesPerRow, setImagesPerRow] = useState(3);

  const [sortOption, setSortOption] = useState<string>('spectrum');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [imageCount, setImageCount] = useState<number>(1);

  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      const validFiles = fileArray.filter((file) =>
        validImageTypes.includes(file.type),
      );

      if (validFiles.length === 0) {
        setError(
          'Можно загружать только файлы форматов JPG, PNG, WEBP или GIF',
        );

        return;
      }

      setError(null);

      const fileURLs = validFiles.map((file) => URL.createObjectURL(file));

      setSelectedImages(fileURLs);

      const formData = new FormData();

      validFiles.forEach((file) => {
        formData.append('file', file);
      });

      setLoading(true);

      fetch('https://color-app-wj65.onrender.com/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка в ответе сервера');
          }

          return response.json();
        })
        .then((data) => {
          console.log('Данные с сервера:', data);
          // setUploadedImages(data.map((item: ImageData) => item.filename));
        })
        .finally(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error uploading images:', error);
        });
    }
  };

  const handleDownloadHtml = () => {
    downloadHtml(uploadedImages, imagesPerRow);
  };

  const handleStartSort = () => {
    const hexToRgb = (hex: string): [number, number, number] => {
      const trimmedHex = hex.replace('#', '');

      const bigint = parseInt(trimmedHex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;

      return [r, g, b];
    };

    setStartedSort(true);

    const rgbColor = hexToRgb(selectedColor);

    let sortData = {};

    if (sortOption === 'spectrum') {
      sortData = {
        sort_type: 'spectr',
      };
    } else {
      sortData = {
        sort_type: 'top_n',
        color: rgbColor,
        n: imageCount,
      };
    }

    console.log(JSON.stringify(sortData));

    fetch('https://color-app-wj65.onrender.com/sort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sortData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка в сортировке');
        }

        return response.json();
      })
      .then((data) => {
        console.log('Отсортированные данные:', data);
        setUploadedImages(data.map((item: ImageData) => item.filename));
        console.log('Массив картинок', uploadedImages);
      })
      .catch((error) => {
        console.error('Ошибка при сортировке:', error);
      });
  };

  return (
    <div className="flex justify-between gap-8 p-6">
      <div
        className={`flex flex-col justify-center overflow-hidden rounded bg-white px-6 py-12 shadow-lg transition-all duration-300 lg:px-8 ${
          startedSort ? 'w-[50%]' : 'w-full'
        }`}
      >
        <UploadData
          selectedImages={selectedImages}
          onImageUpload={handleImageUpload}
        />
        {error && <p>{error}</p>}
        <SelectedParams
          selectedImages={selectedImages}
          imagesPerRow={imagesPerRow}
          setImagesPerRow={setImagesPerRow}
        />
        <SelectedSort
          selectedImages={selectedImages}
          sortOption={sortOption}
          setSortOption={setSortOption}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          imageCount={imageCount}
          setImageCount={setImageCount}
        />
        {selectedImages.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <button
                className={`mx-auto mt-4 w-1/2 rounded-lg px-3 py-2 text-white ${loading ? 'cursor-not-allowed bg-blue-200' : 'bg-indigo-600'}`}
                onClick={handleStartSort}
                disabled={loading}
              >
                Сортировать
              </button>
              {loading && (
                <span className="ml-4 animate-pulse text-blue-600">
                  Идет загрузка данных на сервер...
                </span>
              )}
            </div>
            {startedSort && (
              <button
                onClick={handleDownloadHtml}
                className="mx-auto mt-4 w-1/2 rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Скачать html страницу
              </button>
            )}
          </div>
        )}
      </div>

      {startedSort && (
        <div
          className="grid w-[50%] gap-2 rounded bg-white p-4 shadow-lg"
          style={{
            gridTemplateColumns: `repeat(${imagesPerRow}, minmax(0, 1fr))`,
            gridAutoRows: 'max-content',
          }}
        >
          {uploadedImages.length > 0 ? (
            uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg border shadow-md`}
                style={{
                  aspectRatio: '1 / 1',
                }}
              >
                <img
                  src={`/files/${imageUrl}`}
                  alt={`Uploaded ${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">Нет загруженных изображений</p>
          )}
        </div>
      )}
    </div>
  );
};
