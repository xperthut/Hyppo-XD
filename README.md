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

# Packaging and distribution
```R
// for use in npm scripts
npm install electron-packager --save-dev

// for use from cli
npm install electron-packager -g

// For use in npm scripts
npm install electron-installer-dmg --save-dev

// For use from cli
npm install electron-installer-dmg -g

```


# Compile and run in together
```R
  node-gyp rebuild && npm run rebuild && npm start
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


# Data Science Take-Home Exercise

## Overview

Core within the Outreach application is the concept of a _sequence_. A sequence
is a series of automatic or manual touchpoints that are spread out over a period
of time. A _prospect_ can be placed within a sequence. A primary use case for
sequences is to elicit an email response from cold prospects who have not been
contacted before. For the purposes of this exercise, a sequence might be
considered to have a successful outcome if the prospect ultimately winds up
responding to an email. In reality, sequences can consist of non-email touch
points, but for the purposes of this exercise we will just be dealing with
email.

## Data

`sequence-mailings.csv` contains partial data corresponding to approximately 1M
emails sent via the Outreach platform by our internal sales team using
sequences. For privacy reasons, a limited amount of data has been included and
email content has been removed. Most of the fields in the csv file should be
somewhat self-explanatory, but some descriptions are below:

* `id` - The internal identifier of this mailing

* `message_id` - The GUID of the email message (an email standard)

* `parent_message_id` - If part of an email thread, the GUID of the parent message

* `to_domain` - The domain of the to address of the email.

* `from` - The from address of the email

* `is_thread_reply` - Was this message a reply to an existing thread

* `subject_customized` - Was the subject manually customized.

* `body_customized` - Was the body manually customized

* `subject_length` - The number of characters in the subject.

* `body_length` - The number of characters in the body (including HTML characters)

* `delivered_at` - The timestamp at which this particular email was delivered

* `thread_replied_at` - The timestamp at which any email in this particular sequence of emails was responded to. E.g. all emails in a thread of email messages will have this value set when a prospect replies.

* `track_clicks` - Whether link tracking is enabled.

* `track_opens` - Whether open tracking is enabled.

* `includes_link` - Whether the email body includes a link. If this is false, `clicked_at` will not be relevant.

* `replied_at` - The timestamp at which this particular email was directly replied to

* `opened_at` - The timestamp at which the email was opened by the prospect.

* `clicked_at` - The timestamp at which a tracked link in the email was opened by the prospect.

* `mailbox_id` - The internal id of the object representing the mailbox of the sender

* `template_id` - The internal id of the template used to construct the email

* `sequence_id` - The internal id of the sequence used
* `sequence_step_id` - The internal id of the sequence step used to construct the email
* `sequence_template_id` - The internal id of the a/b tested template that this particular mailing was placed into (each step in a sequence can have multiple templates).
* `sequence_state_id` - The internal id of object tracking the state of a sequence in relation to a particular prospect. All emails related to a prospect within a particular sequence will share the same sequence_state_id.

* `prospect_id` - The internal ID of the prospect
* `prospect_first_name` - The first name of the prospect
* `prospect_time_zone` - The time zone of the prospect
* `prospect_gender` - The gender of the prospect
* `prospect_dob` - The DOB of the prospect
* `prospect_occupation` - The occupation of the prospect
* `prospect_city` - The city the prospect resides
* `prospect_zip` - The prospect zip code
* `prospect_country` - The prospect country
* `prospect_website` - A website related to the prospect
* `prospect_opted_out` - The timestamp the prospect was opted out
* `persona` - The persona of the prospect
* `company_name` - The company name of the prospect
* `company_size` - The number of employees in the company
* `industry` - The industry of the company
* `website` - The website of the company
* `company_locality` - Where the company is located
* `company_tier` - An indicator of which customer tier the company belongs to
* `sequence_order` - The step in the sequence which generated this email (can be used to approximate how many emails came before this one).
* `tags` - Comma-separated list of tags on the prospect

## Problem

The purpose of this project is to determine which features–if any–are strong
indicators of whether or not a prospect will engage with an email. Specifically,
successful emails will have `replied_at` set to a non-null value. Things such as
`opened_at` and `clicked_at` are also indicators of an email's effectiveness.

For example, it could turn out that the time at which the email is delivered (as
indicated by `delivered_at`) is a significant predictor of whether the prospect
will open/reply to an email. If this is true, a feature could be built into the
product to automatically schedule the delivery of emails at optimal times.

## Goals

Successful completion of the project will include the following:

1. Come up with a hypothesis and statistical explanation regarding the data and
   which features are relevant to an email's effectiveness.
1. Build a statistical model based on this data set to predict whether or not a
   test email will be engaged with. Bonus points–depending on what features are
   most important–would be to come up with a model to either prioritize
   prospects or suggest changes to the email in order to maximize the
   effectiveness of an email. For example, if `delivered_at` is an important
   feature, this model would suggest at what time an email should be sent.

## Things We Look For

1. Basic competency in machine learning and statistics
1. Ability to roll with an ambiguous problem statement and to think creatively.
1. Scientific Depth
   * Understanding of common pitfalls of predictive modeling, over-fitting, data
     leakage, etc.
   * Ability to establish deep understanding of data schema in relation to the
     problem domain. For instance, message-threading, etc.
   * Exploratory analysis with strong business instincts.
1. Proclivity towards incorporation into actual product. Thinking with
   real-world applications in mind. How could the model be adapted into a
   product feature?
1. Strong iterative model building methodology. Intentional thinking around
   model comparison and evaluation– clear demonstration of the iterative path
   from a baseline model to further improved models and explanation of the
   source of improvement.

