<p align="center">
  <a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/app/logo/logo.png" width="30%" style="margin:0" /></a>
 </p>

A desktop based cross platform application to generate mapper object from a dataset. I am continuously updating the software focusing on the user experience. If you have any suggestion, please [email](mailto:mhmethun@gmail.com) to the developer.

# Pre-requisite for installation #

Must need GCC version at least 5.0


# Instructions for a developer #
* [Create Node environment](#create-node-environment)
* [Install required node packages](#install-required-node-packages)
* [Clean and build the package](#clean-and-build-the-package)
* [Run the desktop app](#run-the-desktop-app)
* [Distribute app (Mac OSX host)](#distribute-app-mac-osx-host)
    * [Target: Machintos OSX](#target-machintos-osx)
        * [Complete commands for OSX](#complete-commands-for-osx)
    * [Target: Windows OS](#target-windows-os)
        * [Complete commands for WINDOWS](#complete-commands-for-windows)
    * [Target: Linux OS](#target-linux-os)
        * [Complete commands for LINUX](#complete-commands-for-linux)
* [Licence &amp; copyright](#licence--copyright)


## Create Node environment ##

  1. Download and install [nodeJS __v12.13.1__](https://nodejs.org/download/release/v12.13.1/). Current __V8__ interface is campatible with this version.
  2. Need python >= 2.7


## Install required node packages ##
Open terminal and redirect to the [git folder]/app prior running the following commands

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
  
  # Install logger
  npm install --save electron-log
  
  # For MAC OsX
  npm install electron-installer-dmg --save-dev
  npm install electron-installer-dmg -g
  
  # For WINDOWS Os
  npm install --save-dev electron-installer-windows
  npm install -g electron-installer-windows
  
  # For LINUX Os
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
    "electron-installer-windows": "^2.0.0",
    "electron-packager": "^14.1.0",
    "electron-rebuild": "^1.8.8",
    "rebuild": "^0.1.2"
  }
```

## Clean and build the package ##
(UNIX users) Use following commands to clean the solutions that you built earlier:
```bash
# Clean node-gyp
node-gyp clean

# Remove build folder if still exists
rm -rf build/

# Remove bin folder
rm -rf bin

# Remove release-builds folder
rm -rf release-builds/

# Remove release folder
rm -rf release/

# Shortcut: Just run following command to complete all the above actions of cleanup
npm run clean
```

Use following command to build the package
```bash
# Create build directory based on OS (a Makefile and associated property files will be created on Unix systems and a vcxproj file will be created on Windows)
node-gyp  configure

# Build the solution
node-gyp rebuild

# Build the app
npm run rebuild

# Shortcut: Just run following command to complete all the above actions to rebuild
npm run builder
```

## Run the desktop app ##
Run following commands to build the solution as a desktop application
```bash
# Three consecutive commands are concatenated by logical && operator
# If anyone failed then it will not execute the subsequent commands
node-gyp rebuild && npm run rebuild && npm start

# Or
npm run builder

# After rebuilding the app, run following command to run the app locally
npm start
```

## Distribute app (Mac OSX host) ##
Run following OS specific commands to generate distributed application. The following command can be run from the terminal of the Mac OSX.
### Target: Machintos OSX ###
```bash
# Build .app file
npm run package-mac

# Build .dmg file
npm run installer-mac

# Or run following command to do the above two action together
npm run mac
```
#### Complete commands for OSX ####
```bash
npm run clean && npm run builder && npm run mac
```

### Target: Windows OS ###
```bash
# Download and install Wine using Homebrew
brew cask install wine-stable

# Download and install mono using Homebrew
brew install mono

# Build .exe file
npm run package-win

# Build .exe file
npm run installer-win

# Or run following command to do the above two action together
npm run win
```

#### Complete commands for WINDOWS ####
```bash
npm run clean-win && npm run builder && npm run win
```

### Target: Linux OS ###
```bash
# Install this package
brew install fakeroot dpkg

# Build executable file
npm run package-linux

# Build executable file
npm run installer-linux

# Or run following command to do the above two action together
npm run linux
```

#### Complete commands for LINUX ####
```bash
npm run clean && npm run builder && npm run linux
```

### Generate solution for all target OSs (Discourage to use this) ###
Run following command to clean and build the package and make the installer for all target OSs
```bash
npm run install
```


## Licence &amp; copyright ##

Copyright &copy; 2019 Hyppo-XD Collaborators.

Hyppo-XD is licensed under an MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

