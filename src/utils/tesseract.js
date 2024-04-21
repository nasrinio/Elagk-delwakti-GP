import Tesseract from 'tesseract.js';

export const performOCR = async (imageUrl) => {
  try {
    // Run OCR on the image
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng', // Specify language for text recognition
      { logger: (m) => console.log(m) } // Optional logger
    );

    return text; // Return the extracted text
  } catch (error) {
    console.error('Error performing OCR:', error);
    return null;
  }
};