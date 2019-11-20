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
1. Download and install [nodeJS](https://nodejs.org/download/release/v12.13.1/) v12.13.1. Current `V8` interface is campatible with this version.
2. Need python >= 2.7

## Install required node packages
Open terminal and redirect to the git folder prior running the following commands
```bash
# Update npm
sudo npm install -g npm

# Install node-gyp
sudo npm install -g node-gyp

# nan package for node
npm install --save nan

# bindings for external sources
npm install -g bindings

# rebuild package
npm install --save-dev rebuild

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

# For WINDOWS user
npm install --save-dev electron-winstaller

# For LINUX user
npm install --save-dev  electron-installer-debian
npm install -g electron-installer-debian

# asar package
npm install --save-dev  asar
```

After running all the commands, open the `package.json` file. At the end of this file there has two keys named `dependencies` and `devDependencies` as follows. Sometimes `jquery` moves to `devDependencies` during installation then please move it to `dependencies`. Otherwise, JQUERY will not work in the distribution.

```JSON
"dependencies": {
    "bindings": "^1.5.0",
    "electron-log": "^3.0.9",
    "jquery": "^3.4.1",
    "nan": "^2.14.0"
  },
 "devDependencies": {
    "asar": "^2.0.1",
    "electron": "^6.1.4",
    "electron-installer-debian": "^2.0.1",
    "electron-installer-dmg": "^3.0.0",
    "electron-packager": "^14.1.0",
    "electron-rebuild": "^1.8.8",
    "electron-winstaller": "^4.0.0",
    "rebuild": "^0.1.2"
  },
```

## Build the package
Use following command to build the package
```bash
# Create build directory based on OS (a Makefile and associated property files will be created on Unix systems and a vcxproj file will be created on Windows)
node-gyp  configure

# Build the solution
node-gyp rebuild
```
