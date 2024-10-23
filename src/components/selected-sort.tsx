import React, { useState } from 'react';

interface Props {
  selectedImages: string[];
  sortOption: string;
  setSortOption: (value: string) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
  imageCount: number;
  setImageCount: (value: number) => void;
}

export const SelectedSort: React.FC<Props> = ({
  selectedImages,
  sortOption,
  setSortOption,
  selectedColor,
  setSelectedColor,
  imageCount,
  setImageCount,
}) => {
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    setImageCount(value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
  };

  return (
    <div>
      {selectedImages.length > 0 && (
        <div>
          <div className="flex flex-col items-center sm:col-span-3">
            <label
              htmlFor="sort"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Выберите вариант сортировки
            </label>
            <div className="mt-2">
              <select
                id="sort"
                name="sort"
                autoComplete="sort-name"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                onChange={handleSortChange}
              >
                <option value="spectrum">Сортировка по спектру</option>
                <option value="firstN">Первые N изображений</option>
              </select>
            </div>
          </div>

          {sortOption === 'firstN' && (
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Выберите цвет
              </label>
              <input
                id="color"
                type="color"
                value={selectedColor}
                onChange={handleColorChange}
              />

              <label
                htmlFor="imageCount"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Выберите количество изображений
              </label>
              <input
                id="imageCount"
                type="range"
                min="1"
                max={selectedImages.length}
                value={imageCount}
                onChange={handleSliderChange}
                style={{ width: '100%' }}
              />

              <div className="mt-2">
                <span className="text-sm font-medium text-gray-900">
                  Выбрано изображений: {imageCount}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
