<p align="center">
  <a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoM.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoW.png" width="20%" style="margin:0" /></a>&nbsp;<a href="https://github.com/xperthut/Hyppo-XD/releases"><img src="https://github.com/xperthut/Hyppo-XD/blob/master/logo/logoL.png" width="20%" style="margin:0" /></a>
 </p>

<h1> Hyppo-XD </h1>
This is a desktop based software aimed to generate mapper object from dataset. We are continuously updating the software focusing on the user experience. If you have any suggestion, please [email](mailto:mhmethun@gmail.com) to the developer.

<h1> Pre-requisite for installation </h1>
<ol>
  <li>Must need GCC version at least 5.0</li>
  <li>Download and Install <a href="https://www.boost.org/" target="_blank">boost</a> library</li>
</ol>

<h1> Instructions for a developer </h1>
<ul>
  <li><a href="#add_library"> Add library</a></li>
  <li><a href="#create_node_environment"> Create Node environment</a></li>
  <li><a href="#install_required_node_packages"> Install required node packages</a></li>
  <li><a href="#clean_and_build_the_package"> Clean and build the package</a></li>
  <li><a href="#run_the_desktop_app"> Run the desktop app</a></li>
  <li><a href="#licence_copyright"> Licence &amp; copyright</a></li>
</ul>

<h2 id="add_library">Add library</h2>
<ol>
  <li>Fork the git</li>
  <li>Open <strong>src</strong> directiry</li>
  <li>Copy the <a href="https://github.com/xperthut/HYPPO-X/tree/master/Library" target="_blank">hyppox</a> folder and paste it here.</li>
</ol> 

<h2 id="create_node_environment">Create Node environment</h2>
<ol>
  <li>Download and install <a href="https://nodejs.org/download/release/v12.13.1/" target="_blank">nodeJS</a> <strong>v12.13.1</strong>. Current `V8` interface is campatible with this version.</li>
</ol>
1. 
2. Need python >= 2.7

<h2 id="install_required_node_packages">Install required node packages</h2>
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

<h2 id="clean_and_build_the_package">Clean and build the package</h2>
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

<h2 id="run_the_desktop_app">Run the desktop app</h2>
Run following commands to build the solution as a desktop application
```bash
# Three consecutive commands are concatenated by logical && operator
# If anyone failed then it will not execute the subsequent commands
node-gyp rebuild && npm run rebuild && npm start
```

<h2 id="licence_copyright">Licence &amp; copyright</h2>

Copyright (&copy;) 2019 Hyppo-XD Collaborators.

Hyppo-XD is licensed under an MIT license. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.
