function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}
console.log(getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'));
console.log(getYouTubeId('https://youtu.be/dQw4w9WgXcQ'));
console.log(getYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ'));
console.log(getYouTubeId('https://youtube.com/shorts/dQw4w9WgXcQ?feature=share'));
