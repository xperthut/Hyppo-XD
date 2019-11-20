<p align="center">
  <a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoM.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoW.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoL.png" width="20%" style="margin:0" /></a>
 </p>

# Hyppo-XD 
This is a desktop based software aimed to generate mapper object from dataset. We are continuously updating the software focusing on the user experience. If you have any suggestion, please [email](mailto:mhmethun@gmail.com) to the developer.

# Pre-requisite for installation
1. Must need GCC version at least 5.0
2. Download and Install [boost](https://www.boost.org/) library

# Instruction for developers
## Add library
1. Fork the git
2. Open `src` directiry
3. Copy the [hyppox](https://github.com/xperthut/HYPPO-X/tree/master/Library) folder and paste it here.

## Create Node environment
Download and install [nodeJS](https://nodejs.org/download/release/v12.13.1/) v12.13.1. Current `V8` interface is campatible with this version.

## Install required node packages
Open terminal and redirect to the git folder prior running the following commands
```bash
# Update npm
sudo npm install -g npm

# Install node-gyp
sudo npm install -g node-gyp

# nan package for node
npm install --save nan

# electron package
npm install --save-dev electron

# electron-packager package
npm install --save-dev electron-packager
npm install electron-packager -g

# electron-rebuild package
npm install --save electron-rebuild

# jquery package
npm install --save jquery

# For MAC user
npm install electron-installer-dmg --save-dev
npm install electron-installer-dmg -g

// For WINDOWS user
npm install --save-dev electron-winstaller

// For LINUX user
npm install --save-dev  electron-installer-debian
npm install -g electron-installer-debian

// asar package
npm install --save-dev  asar
```


