export const downloadHtml = (
  uploadedImages: string[],
  imagesPerRow: number,
) => {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Загруженные изображения</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .image-grid {
            display: grid;
            grid-template-columns: repeat(${imagesPerRow}, minmax(0, 1fr));
            gap: 10px;
          }
          .image-grid img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        <h1>Загруженные изображения</h1>
        <div class="image-grid">
          ${uploadedImages
            .map(
              (imageUrl) => `
                <div>
                  <img src="http://127.0.0.1:5122/files/${imageUrl}" alt="Uploaded Image" />
                </div>
              `,
            )
            .join('')}
        </div>
      </body>
      </html>
    `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = 'uploaded_images.html';
  link.click();
};
