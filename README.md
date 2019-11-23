<p align="center">
  <a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoM.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoW.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoL.png" width="20%" style="margin:0" /></a>
 </p>

# Hyppo-XD #
This is a desktop based software aimed to generate mapper object from dataset. We are continuously updating the software focusing on the user experience. If you have any suggestion, please [email](mailto:mhmethun@gmail.com) to the developer.

# Pre-requisite for installation #

1. Must need GCC version at least 5.0
2. Download and Install [boost](https://www.boost.org/) library


# Instructions for a developer #
* [Add library](#add-library)
* [Create Node environment](#create-node-environment)
* [Install required node packages](#install-required-node-packages)
* [Clean and build the package](#clean-and-build-the-package "Goto clean-and-build-the-package")
* [Run the desktop app](#run-the-desktop-app "Goto run-the-desktop-app")
* [Licence &amp; copyright](#licence-&-copyright "Goto licence-&-copyright")


## Add library ##

  1. Fork the git
  2. Open __src__ directiry
  3. Copy the [hyppox](https://github.com/xperthut/HYPPO-X/tree/master/Library) folder and paste it here.


## Create Node environment ##

  1. Download and install [nodeJS __v12.13.1__](https://nodejs.org/download/release/v12.13.1/). Current __V8__ interface is campatible with this version.
  2. Need python >= 2.7


## Install required node packages ##
Open terminal and redirect to the git folder prior running the following commands

```bash
  # Update npm
  sudo npm install -g npm
  
  # Install node-gyp
  sudo npm install -g node-gyp
  
  # Install nan package for node
  npm install --save nan
  
  # Install bindings for external sources
  npm install -g bindings
  
  # Install rebuild package
  npm install --save-dev rebuild
  
  # Install electron package
  npm install --save-dev electron
  
  # Install electron-packager package
  npm install --save-dev electron-packager
  npm install electron-packager -g
  
  # Install electron-rebuild package
  npm install --save electron-rebuild
  
  # Install jquery package
  npm install --save jquery
  
  # Install jquery package
  npm install --save jquery
  
  # Install asar package
  npm install --save-dev asar
  
  # For MAC user
  npm install electron-installer-dmg --save-dev
  npm install electron-installer-dmg -g
  
  # For WINDOWS user
  npm install --save-dev electron-winstaller
  
  # For LINUX user
  npm install --save-dev  electron-installer-debian
  npm install -g electron-installer-debian
```
After running all the commands, open the __package.json__ file. At the end of this file there has two keys named __dependencies__ and __devDependencies__ as follows. Sometimes __jquery__ moves to __devDependencies__ during installation then please move it to __dependencies__. Otherwise, JQUERY will not work in the distribution.

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

## Clean and build the package ##
Use following command to build the package
```bash
# Create build directory based on OS (a Makefile and associated property files will be created on Unix systems and a vcxproj file will be created on Windows)
node-gyp  configure

# Build the solution
node-gyp rebuild
```
If you already have solution in build directory then do the following:
```bash
# Clean node-gyp
node-gyp clean

# Remove build folder if still exists
rm -rf build/
```

## Run the desktop app ##
Run following commands to build the solution as a desktop application
```bash
# Three consecutive commands are concatenated by logical && operator
# If anyone failed then it will not execute the subsequent commands
node-gyp rebuild && npm run rebuild && npm start
```

## Licence &amp; copyright ##

Copyright (&copy;) 2019 Hyppo-XD Collaborators.

Hyppo-XD is licensed under an MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

