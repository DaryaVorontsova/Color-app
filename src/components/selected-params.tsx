import { ChangeEvent } from 'react';

interface Props {
  selectedImages: string[];
  imagesPerRow: number;
  setImagesPerRow: (value: number) => void;
}

export const SelectedParams: React.FC<Props> = ({
  selectedImages,
  imagesPerRow,
  setImagesPerRow,
}) => {
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImagesPerRow(Number(event.target.value));
  };

  return (
    <div>
      {selectedImages.length > 0 && (
        <div className="flex flex-col items-center sm:col-span-3">
          <label
            htmlFor="imagesPerRow"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Количество картинок в строке: {imagesPerRow}
          </label>
          <div className="mt-2 w-full">
            <input
              type="range"
              id="imagesPerRow"
              name="imagesPerRow"
              min="3"
              max="8"
              value={imagesPerRow}
              onChange={handleSliderChange}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};
