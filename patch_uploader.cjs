const fs = require('fs');
const file = 'src/components/ImageUploader.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }`;

const replacement = `      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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
      }`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Target not found");
}
