import fs from 'fs';

export const readImageFile = (filePath) => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64String = imageBuffer.toString("base64");
    return `data:image/png;base64,${base64String}`;
  } catch (error) {
    console.error('Error reading image file:', error);
    return null;
  }
};