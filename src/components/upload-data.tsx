import React, { useState, ChangeEvent } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface Props {
  selectedImages: string[];
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UploadData: React.FC<Props> = ({
  selectedImages,
  onImageUpload,
}) => {
  const [showImages, setShowImages] = useState(false);

  const handleShowImages = () => {
    setShowImages(true);
  };

  const handleHideImages = () => {
    setShowImages(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h3 className="mb-4 text-2xl font-bold">
        Выберите датасет для сортировки
      </h3>

      <div className="col-span-full">
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
          <div className="text-center">
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto h-12 w-12 text-gray-300"
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Выберите файлы</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={onImageUpload}
                />
              </label>
              <p className="pl-1">или перетащите</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, GIF, WEBP
            </p>
          </div>
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="mb-4">
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
              showImages
                ? 'bg-transparent text-gray-900'
                : 'bg-indigo-600 text-white'
            }`}
            onClick={handleShowImages}
          >
            Показать
          </button>
          <button
            className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
              showImages
                ? 'bg-indigo-600 text-white'
                : 'bg-transparent text-gray-900'
            }`}
            onClick={handleHideImages}
          >
            Скрыть
          </button>
        </div>
      )}

      {selectedImages.length > 0 && (
        <p className="mb-4 text-lg">
          Загружено изображений: {selectedImages.length}
        </p>
      )}

      {showImages && (
        <div className="mt-6 flex flex-wrap gap-4">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="h-36 w-36 overflow-hidden rounded-lg border shadow-md"
            >
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
