const fs = require('fs');
const file = 'vite.config.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],`;

const replacement = `export default defineConfig(() => {
  return {
    define: {
      'import.meta.env.VITE_CLOUDINARY_CLOUD_NAME': JSON.stringify(process.env.CLOUDINARY_CLOUD_NAME || ''),
      'import.meta.env.VITE_CLOUDINARY_API_KEY': JSON.stringify(process.env.CLOUDINARY_API_KEY || ''),
      'import.meta.env.VITE_CLOUDINARY_API_SECRET': JSON.stringify(process.env.CLOUDINARY_API_SECRET || ''),
    },
    plugins: [react(), tailwindcss()],`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Target not found");
}
