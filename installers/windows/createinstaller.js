const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller;
const path = require('path');

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  });

function getInstallerConfig () {
  console.log('creating windows installer');
  const rootPath = path.join('./');
  const outPath = path.join(rootPath, 'release-builds');

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Hyppo-X-win32-ia32/'),
    authors: 'Methun Kamruzzaman',
    noMsi: true,
    outputDirectory: path.join(rootPath, 'release'),
    exe: 'Hyppo-X.exe',
    setupExe: 'Hyppo-X.exe',
    setupIcon: path.join(rootPath, 'logo', 'icon.ico')
  });
}
