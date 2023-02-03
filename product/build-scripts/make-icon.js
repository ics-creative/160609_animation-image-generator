const fs = require('fs');
const icongen = require('icon-gen');
const sharp = require('sharp');

const root = './resources/app-icon';
const assetsDir = `${root}/app-icon-assets`;
const tmpDir = `${root}/tmp`;
const windowsStoreIconDir = './resources/win-icon';

const settings = {
  mac: {
    inPng: `${assetsDir}/mac-1024.png`,
    iconSizes: [16, 32, 64, 128, 256, 512, 1024],
    outName: 'app',
    format: 'icns'
  },
  win: {
    inPng: `${assetsDir}/win-1024.png`,
    iconSizes: [16, 24, 32, 48, 64, 128, 256],
    outName: 'app',
    format: 'ico'
  },
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

const makeWindowsStoreIcon = async () => {
  makeTmp();
  const inPng = `${assetsDir}/win-1024.png`
  await Promise.all([
    [44, 50, 150].map((size) =>
      sharp(inPng)
        .resize(size, size)
        .toFile(`${windowsStoreIconDir}/SampleAppx.${size}x${size}.png`)
    ),
    sharp(inPng)
      .resize(44, 44)
      .toFile(`${windowsStoreIconDir}/Square44x44Logo.png`),
    sharp(inPng)
      .resize(44, 44)
      .toFile(
        `${windowsStoreIconDir}/Square44x44Logo.targetsize-44_altform-unplated.png`
      ),
    sharp(inPng)
      .resize(150, 150)
      .extend({
        left: 80,
        right: 80,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(`${windowsStoreIconDir}/SampleAppx.310x150.png`)
  ]);
};

const main = async () => {
  await makeIcon(settings.mac);
  await makeIcon(settings.win);
  await makeWindowsStoreIcon()
};

main();
