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
  <li>Download and install <a href="https://nodejs.org/download/release/v12.13.1/" target="_blank">nodeJS</a> <strong>v12.13.1</strong>. Current <strong>V8</strong> interface is campatible with this version.</li>
  <li>Need python &ge; 2.7</li>
</ol> 

<h2 id="install_required_node_packages">Install required node packages</h2>
Open terminal and redirect to the git folder prior running the following commands<br />
<div style="background-color: black;color: orange;">
  <span style="color: light gray">// Update npm</span><br />
  <span>sudo npm install -g npm</span><br />
  
  <span style="color: light gray">// Install node-gyp</span><br />
  <span>sudo npm install -g node-gyp</span><br />
  
</div>

 
  <h4>Install nan package for node</h4>
  <strong>npm install --save nan</strong>
  
  <h4>Install bindings for external sources</h4>
  <strong>npm install -g bindings</strong>
  
  <h4>Install rebuild package</h4>
  <strong>npm install --save-dev rebuild</strong>

  <h4>Install electron package</h4>
  <strong>npm install --save-dev electron</strong>

  <h4>Install electron-packager package</h4>
  <strong>npm install --save-dev electron-packager</strong><br />
  <strong>npm install electron-packager -g</strong>
  
  <h4>Install electron-rebuild package</h4>
  <strong>npm install --save electron-rebuild</strong>
  
  <h4>Install jquery package</h4>
  <strong>npm install --save jquery</strong>

  <h4>Install jquery package</h4>
  <strong>npm install --save jquery</strong>
  
  <h4>Install asar package</h4>
  <strong>npm install --save-dev asar</strong>
  
  <h4>For MAC user</h4>
  <strong>npm install electron-installer-dmg --save-dev</strong>
  <strong>npm install electron-installer-dmg -g</strong>

  <h4>For WINDOWS user</h4>
  <strong>npm install --save-dev electron-winstaller</strong>

  <h4>For LINUX user</h4>
  <strong>npm install --save-dev  electron-installer-debian</strong>
  <strong>npm install -g electron-installer-debian</strong>


<span>After running all the commands, open the <strong>package.json</strong> file. At the end of this file there has two keys named <strong>dependencies</strong> and <strong>devDependencies</strong> as follows. Sometimes <strong>jquery</strong> moves to <strong>devDependencies</strong> during installation then please move it to <strong>dependencies</strong>. Otherwise, JQUERY will not work in the distribution.</span><br />

<span>
"dependencies": {<br />
    "bindings": "^1.5.0",<br />
    "electron-log": "^3.0.9",<br />
    "jquery": "^3.4.1",<br />
    "nan": "^2.14.0"<br />
  },<br />
 "devDependencies": {<br />
    "asar": "^2.0.1",<br />
    "electron": "^6.1.4",<br />
    "electron-installer-debian": "^2.0.1",<br />
    "electron-installer-dmg": "^3.0.0",<br />
    "electron-packager": "^14.1.0",<br />
    "electron-rebuild": "^1.8.8",<br />
    "electron-winstaller": "^4.0.0",<br />
    "rebuild": "^0.1.2"<br />
  },<br />
</span>

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
