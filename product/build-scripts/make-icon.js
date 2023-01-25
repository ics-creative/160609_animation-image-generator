const fs = require('fs');
const icongen = require('icon-gen');
const sharp = require('sharp');

const root = './resources/app-icon';
const tmpDir = `${root}/tmp`;

const settings = {
  mac: {
    inPng: `${root}/mac-1024.png`,
    iconSizes: [16, 32, 64, 128, 256, 512, 1024],
    outName: 'app',
    format: 'icns'
  },
  win: {
    inPng: `${root}/win-1024.png`,
    iconSizes: [16, 24, 32, 48, 64, 128, 256],
    outName: 'app',
    format: 'ico'
  }
};

const deleteTmp = () => {
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true });
  }
};

const makeTmp = () => {
  deleteTmp();
  fs.mkdirSync(tmpDir, { recursive: true });
};

const makeIcon = async (setting) => {
  makeTmp();
  await Promise.all(
    setting.iconSizes.map((size) =>
      sharp(setting.inPng).resize(size, size).toFile(`${tmpDir}/${size}.png`)
    )
  );

  const result = await icongen(tmpDir, root, {
    report: true,
    [setting.format]: { name: setting.outName, sizes: setting.iconSizes }
  });

  deleteTmp();
  console.log(result);
};

const main = async () => {
  await makeIcon(settings.mac);
  await makeIcon(settings.win);
};

main();
