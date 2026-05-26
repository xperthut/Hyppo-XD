<a href="https://github.com/xperthut/Hyppo-XD/releases">
  <img src="https://github.com/xperthut/Hyppo-XD/blob/master/images/git-header.png" alt="Hyppo-XD Banner" style="width:100%;display:block;" />
</a>

<h1 align="center">Hyppo-XD</h1>

<p align="center">
  A cross-platform desktop application for generating <strong>Mapper objects</strong> from datasets — built on Electron.
</p>

<p align="center">
  <a href="https://github.com/xperthut/Hyppo-XD/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/xperthut/Hyppo-XD?label=release" /></a>
  <a href="LICENSE.md"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Platform" src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" />
  <img alt="Electron" src="https://img.shields.io/badge/electron-42.x-47848F?logo=electron" />
  <a href="mailto:mhmethun@gmail.com"><img alt="Contact" src="https://img.shields.io/badge/contact-email-green" /></a>
</p>

---

## Overview

Hyppo-XD is a desktop tool for topological data analysis. It lets you load a dataset, configure filter functions, and interactively visualize the resulting **Mapper graph** — a topological summary that reveals shape, clusters, and connectivity hidden in high-dimensional data.

Development is ongoing with a focus on user experience. Have a suggestion or found a bug? [Open an issue](https://github.com/xperthut/Hyppo-XD/issues) or [email the developer](mailto:mhmethun@gmail.com).

---

## Features

- 📂 Load CSV datasets and configure Mapper parameters through a clean UI
- 🔵 Interactive D3-powered graph visualization of the Mapper object
- 🖥️ Native desktop experience on **macOS**, **Windows**, and **Linux**
- ⚡ Built on [Electron](https://www.electronjs.org/) with a C++ backend via `node-gyp`
- 🔬 Topological view and mapper view in separate panels

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Developer Setup](#developer-setup)
  - [1. Create Node Environment](#1-create-node-environment)
  - [2. Install Node Packages](#2-install-node-packages)
  - [3. Clean and Build](#3-clean-and-build)
  - [4. Run the App](#4-run-the-app)
- [Distribution (from macOS host)](#distribution-from-macos-host)
  - [Target: macOS](#target-macos)
  - [Target: Windows](#target-windows)
  - [Target: Linux](#target-linux)
  - [All Platforms](#all-platforms)
- [Package Dependencies](#package-dependencies)
- [License & Copyright](#license--copyright)

---

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| [Node.js](https://nodejs.org/) | LTS (latest) |
| GCC / Clang | 5.0+ |
| Python | 3.7+ |
| Visual Studio (Windows only) | 2019+ (with C++ workload) |

---

## Developer Setup

All commands below should be run from the **`[repo]/app`** directory unless noted otherwise.

### 1. Create Node Environment

1. Download and install [Node.js (LTS)](https://nodejs.org/).
2. Ensure Python ≥ 3.7 is available (`python3 --version`).
3. **Windows only:** install [Visual Studio](https://visualstudio.microsoft.com/) with the *Desktop development with C++* workload.

### 2. Install Node Packages

Run the all-in-one upgrade script (installs/updates every dependency):

```bash
npm run upgrade
```

Or install everything step by step:

```bash
# Update npm itself
sudo npm install -g npm

# Install node-gyp (C++ addon build tool)
sudo npm install -g node-gyp

# Core native-addon dependencies
npm install --save nan
npm install --save bindings

# Electron and build tooling
npm install --save-dev electron
npm install --save-dev electron-packager
npm install --save-dev @electron/rebuild
npm install --save-dev asar
npm install --save-dev csv-parser
npm install --save-dev node-abi
npm install --save-dev rebuild

# Runtime dependencies
npm install --save @electron/remote
npm install --save electron-log
npm install --save jquery

# Platform installers
npm install --save-dev electron-installer-dmg       # macOS
npm install --save-dev electron-installer-windows   # Windows
npm install --save-dev electron-installer-debian    # Linux (Debian/Ubuntu)
```

> **Note on jQuery:** After installation verify that `jquery` appears under `"dependencies"` (not `"devDependencies"`) in `package.json`. If it was moved, correct it manually — otherwise jQuery will not work in the distributed build.

### 3. Clean and Build

**Clean** previously generated artifacts:

```bash
# Individual steps
node-gyp clean
rm -rf build/ bin/ release-builds/ release/

# Shortcut — runs all of the above
npm run clean
```

**Build** the native C++ addon and Electron app:

```bash
# Step by step
node-gyp configure        # generate platform Makefile / .vcxproj
node-gyp rebuild          # compile the C++ addon
npm run rebuild           # electron-rebuild to relink for the current Electron ABI

# Shortcut — runs all three steps
npm run builder
```

### 4. Run the App

```bash
# Full rebuild then launch
node-gyp rebuild && npm run rebuild && npm start

# Or using the shortcut
npm run builder && npm start

# If already built, just start
npm start
```

---

## Distribution (from macOS host)

The following commands build installable packages for each target OS. Cross-compilation for Windows and Linux requires additional tools installed on the Mac host.

### Target: macOS

```bash
npm run package-mac      # build .app bundle
npm run installer-mac    # wrap .app in a .dmg installer
npm run mac              # shortcut: both steps above

# Full clean → build → package
npm run clean && npm run builder && npm run mac
```

### Target: Windows

```bash
# Install Wine and Mono (required for cross-compilation)
brew install --cask wine-stable
brew install mono

npm run package-win      # build .exe
npm run installer-win    # wrap in a Windows installer

# Full sequence (note: use clean-win for Windows path cleanup)
npm run clean-win        # ignore any errors here
npm run builder && npm run win
```

### Target: Linux

```bash
# Install packaging tools
brew install fakeroot dpkg

npm run package-linux    # build Linux executable
npm run installer-linux  # build .deb package
npm run linux            # shortcut: both steps above

# Full clean → build → package
npm run clean && npm run builder && npm run linux
```

### All Platforms

> ⚠️ Not recommended for routine use — this takes a long time and requires all cross-compilation dependencies to be present.

```bash
npm run dist
```

---

## Package Dependencies

The current `package.json` dependency blocks (synced with v1.0.1):

```json
"dependencies": {
  "@electron/remote": "^2.1.3",
  "bindings": "^1.5.0",
  "electron-installer-redhat": "^3.0.0",
  "electron-log": "^3.0.9",
  "jquery": "^3.6.0",
  "nan": "^2.16.0"
},
"devDependencies": {
  "@electron/rebuild": "^3.7.2",
  "asar": "^3.2.0",
  "csv-parser": "^2.3.5",
  "electron": "^42.2.0",
  "electron-installer-debian": "^3.1.0",
  "electron-installer-dmg": "^3.0.0",
  "electron-installer-windows": "^3.0.0",
  "electron-packager": "^17.1.2",
  "node-abi": "^2.21.0",
  "node-gyp": "^12.3.0",
  "patch-package": "^8.0.1",
  "rebuild": "^0.1.2"
}
```

---

## License & Copyright

Copyright &copy; 2019 – 2026 Hyppo-XD Collaborators.

Hyppo-XD is released under the [MIT License](LICENSE.md). All rights not explicitly granted in the MIT license are reserved.
