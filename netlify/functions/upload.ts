import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { image } = body;

    if (!image) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No image provided' }) };
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "tevarnews",
      resource_type: "auto",
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: result.secure_url,
        public_id: result.public_id
      })
    };
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Failed to upload image' })
    };
  }
};
