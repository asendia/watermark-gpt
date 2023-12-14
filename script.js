function handleFiles(files) {
  if (files.length) {
    const watermarkText = prompt('Enter watermark text:', 'OVERLAY');
    const reader = new FileReader();
    reader.onload = function (e) {
      createWatermark(e.target.result, watermarkText);
    };
    reader.readAsDataURL(files[0]);
  }
}

function createWatermark(imageSrc, watermarkText) {
  const img = new Image();
  img.src = imageSrc;
  img.onload = function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Dynamic font size: 2% of the image width
    const fontSize = Math.max(canvas.width * 0.02, 10); // Minimum font size of 10px
    ctx.font = fontSize + 'px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow for better visibility
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Calculate text width and adjust step dynamically
    const textWidth = ctx.measureText(watermarkText).width;
    const xStep = textWidth + fontSize; // Horizontal spacing based on text width and font size
    const yStep = fontSize * 1.5; // Vertical spacing based on font size

    ctx.save();
    ctx.rotate((-45 * Math.PI) / 180);

    for (let x = -canvas.width; x < canvas.width * 2; x += xStep) {
      for (let y = -canvas.height; y < canvas.height * 2; y += yStep) {
        ctx.fillText(watermarkText, x, y);
      }
    }

    ctx.restore();
  };
}

// Drag and Drop
const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (e) => {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (e) => {
  e.stopPropagation();
  e.preventDefault();
  const files = e.dataTransfer.files;
  handleFiles(files);
});
