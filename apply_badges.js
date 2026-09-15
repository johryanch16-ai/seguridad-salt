const fs = require('fs');
const { Jimp } = require('jimp');
async function main() {
  const shield = await Jimp.read('assets/badge-shield.png');
  console.log('Shield dimensions:', shield.bitmap.width, shield.bitmap.height);
  const targets = [
    { file: 'hero_porteria.jpg', x: 0.655, y: 0.325, w: 0.055, rot: 4 },
    { file: 'showcase_tecnologia.jpg', x: 0.705, y: 0.465, w: 0.085, rot: 6 },
    { file: 'showcase_atencion.jpg', x: 0.765, y: 0.375, w: 0.042, rot: -3 },
    { file: 'showcase_rondas.jpg', x: 0.505, y: 0.305, w: 0.038, rot: 2 },
    { file: 'seguridad_fisica.jpg', x: 0.705, y: 0.445, w: 0.085, rot: 5 },
    { file: 'galeria_supervision.jpg', x: 0.585, y: 0.335, w: 0.055, rot: 4 },
    { file: 'galeria_acceso_vehicular.jpg', x: 0.385, y: 0.405, w: 0.050, rot: -4 },
    { file: 'galeria_rondas.jpg', x: 0.445, y: 0.265, w: 0.052, rot: 3 },
    { file: 'galeria_corporativo.jpg', x: 0.515, y: 0.315, w: 0.048, rot: 0 }
  ];
  for (const t of targets) {
    const imgPath = 'assets/images/' + t.file;
    if (!fs.existsSync(imgPath)) continue;
    const img = await Jimp.read(imgPath);
    const patchW = Math.round(img.bitmap.width * t.w);
    const patch = shield.clone();
    patch.resize({ w: patchW });
    if (t.rot) {
      // gentle tilt if desired, or skip rotation for razor-sharp crispness
    }
    const posX = Math.round(img.bitmap.width * t.x);
    const posY = Math.round(img.bitmap.height * t.y);
    img.composite(patch, posX, posY);
    await img.write(imgPath);
    console.log('Composited badge onto:', t.file);
  }
  console.log('ALL BADGES COMPOSITED SUCCESSFULLY!');
}
main().catch(console.error);