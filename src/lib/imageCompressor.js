/**
 * Compresses an image file on the client side using HTML5 Canvas.
 * @param {File} file - The original file selected by the user.
 * @param {number} maxWidth - The maximum width of the output image in pixels.
 * @param {number} quality - The WebP compression quality (0.0 to 1.0).
 * @returns {Promise<File>} - A Promise that resolves to the compressed WebP File, or the original file if it's not an image.
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    // If not an image (e.g. PDF), return immediately without processing
    if (!file || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            try {
              if (blob) {
                // Ensure we return a proper File object just like the original one
                const originalName = file.name || 'image.bin';
                const newFileName = originalName.replace(/\.[^/.]+$/, "") + ".webp";
                const compressedFile = new File([blob], newFileName, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                // Fallback to original file if compression fails somehow
                resolve(file);
              }
            } catch (err) {
              console.error("Compression error:", err);
              resolve(file); // fallback
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => resolve(file);
    };
    
    reader.onerror = () => resolve(file);
  });
};
