# Node version
```R
Download from [https://nodejs.org](https://nodejs.org)
Node.js v10.16.3 to /usr/local/bin/node

npm v6.9.0 to /usr/local/bin/npm
```

# Installation instructions
```R
// Create a folder 
// Open terminal and neviage to the new folder

npm init

// It will create package.json and prompt to receive information about the contents of the JSON file
package name: (<folder>) GIVE A NAME
version: (1.0.0) 1.0.1
description: ADD A DESCRIPTION
entry point: (index.js) index.js
test command: This is a test
git repository: ADD REPOSITORY OR SKIP BY PRESSING ENTER
keywords: ADD KEYWORDS
author: ADD NAME
license: (ISC) ADD A LICENSE

// Finally type yes to complete
2. npm install --save nan
// It will install nan module
3. npm install --save electron
// It will install electron
4. npm i --save electron-packager
// Install electron-packager 
4. Create binding.gyp file and paste the content here
{
  "targets": [
    {
      "target_name": "hello",
      "include_dirs": [
        "<!(node -e \"require('nan')\")",
        "src"
      ],
      "sources": [
        "src/hello.cc"
      ],
      "cflags_c": [
        "-std=c++14",
      ]
    }
  ]
}

5. // Create a cpp file named hello.cc and paste the following content
#include <nan.h>

void Increment(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  // Validate the number of arguments.
  if (info.Length() < 1) {
    Nan::ThrowTypeError("Arity mismatch");
    return;
  }

  // Validate the type of the first argument.
  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument must be a number");
    return;
  }

  // Get the number value of the first argument. A JavaScript `number` will be a `double` in C++.
  //double arg = info[0]->NumberValue();
  int32_t arg = info[0]->Int32Value(Nan::GetCurrentContext()).FromJust();

  // Allocate a new local variable of type "number" in the JavaScript VM for our return value.
  v8::Local<v8::Number> num = Nan::New(arg + 1);

  // Set the return value.
  info.GetReturnValue().Set(num);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  // Bind the `Increment` function as the `increment` export.
  //exports->Set(Nan::New("increment").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(Increment)->GetFunction());


  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(Increment);
  tpl->SetClassName(Nan::New("increment").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  v8::Local<v8::Function> constructor = Nan::GetFunction(tpl).ToLocalChecked();
  v8::Local<v8::Object> instance = constructor->NewInstance(Nan::GetCurrentContext()).ToLocalChecked();
  //Nan::SetInternalFieldPointer(instance, 0, tree_sitter_elm());

  Nan::Set(instance, Nan::New("name").ToLocalChecked(), Nan::New("increment").ToLocalChecked());
  Nan::Set(module, Nan::New("exports").ToLocalChecked(), instance);
}

NODE_MODULE(hello, Init);

6. // Create the index.js and paste the following contents
const { app, BrowserWindow } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

7. npm install -g node-gyp
// It will install the node-gyp which helps to compile your code
8. node-gyp configure
// Create build directory based on OS (a Makefile and associated property files will be created on Unix systems and a vcxproj file will be created on Windows)
9. node-gyp rebuild
// to build the solution
// Main action starts here
rm -rf hyppox-darwin-x64/
npm run package // to build package

npm install --save-dev electron rebuild
npm run build
npm start

npm install --save electron-rebuild
./node_modules/.bin/electron-rebuild

cd /path-to-module/
HOME=~/.electron-gyp node-gyp rebuild --target=6.0.10 --arch=x64 --dist-url=https://electronjs.org/headers


npm install --save-dev jquery

```

# Remove npm modules
```R
1. rm -rf node_modules
2. npm cache clear --force
```

# Complete uninstall node from mac
```R
sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/{npm*,node*,man1/node*}

sudo rm -rf /Users/[homedir]/.npm

sudo rm -rf ~/.node-gyp

brew uninstall --ignore-dependencies node

brew cleanup

rm -f /usr/local/bin/npm /usr/local/lib/dtrace/node.d

rm -rf ~/.npm
```
