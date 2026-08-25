const fs = require('fs');
const file = 'server.ts';
let content = fs.readFileSync(file, 'utf8');

const target = `// Image Upload Route using Cloudinary
app.post("/api/upload", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided." });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured on the server." });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "tevarnews", // Optional: organizes images in a folder
      resource_type: "auto",
    });`;

const replacement = `// Image Upload Route using Cloudinary
app.post("/api/upload", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image provided." });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: "Cloudinary is not configured on the server." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: "tevarnews", // Optional: organizes images in a folder
      resource_type: "auto",
    });`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Target not found");
}
