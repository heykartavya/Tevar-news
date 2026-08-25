const fs = require('fs');
const file = 'src/components/ImageUploader.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const base64Image = await base64Promise;

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      let data;
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(\`Server returned \${response.status} \${response.statusText}: \${textResponse.substring(0, 50)}...\`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
    } catch (error: any) {`;

const replacement = `    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;
      const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Missing VITE_CLOUDINARY Environment Variables. Please add VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_API_KEY, and VITE_CLOUDINARY_API_SECRET to your hosting provider settings.");
      }

      // Generate Cloudinary Signature
      const timestamp = Math.round((new Date).getTime() / 1000).toString();
      const folder = "tevarnews";
      const strToSign = \`folder=\${folder}&timestamp=\${timestamp}\${apiSecret}\`;
      
      const msgBuffer = new TextEncoder().encode(strToSign);
      const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const response = await fetch(\`https://api.cloudinary.com/v1_1/\${cloudName}/image/upload\`, {
        method: 'POST',
        body: formData,
      });

      let data;
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(\`Cloudinary returned \${response.status}: \${textResponse.substring(0, 50)}...\`);
      }

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to upload image directly to Cloudinary');
      }

      setPreviewUrl(data.secure_url);
      onUploadSuccess(data.secure_url);
    } catch (error: any) {`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Target not found");
}
