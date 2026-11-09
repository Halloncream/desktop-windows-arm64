# Open WebUI Desktop

Windows ARM64 compatibility fork of [open-webui/desktop](https://github.com/open-webui/desktop).
The desktop shell remains native ARM64; its Python backend uses Windows x64 emulation.
See [Windows ARM64 compatibility](#windows-arm64-compatibility) below.

[![Version](https://img.shields.io/github/v/release/open-webui/desktop?label=version&color=%2331c48d)](https://github.com/open-webui/desktop/releases)
[![Downloads](https://img.shields.io/github/downloads/open-webui/desktop/total?color=%23764abc)](https://github.com/open-webui/desktop/releases)
[![Discord](https://img.shields.io/discord/1170866489302188073?label=discord&color=%235865F2)](https://discord.gg/open-webui)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

![Open WebUI Desktop](./demo.png)

[Open WebUI](https://github.com/open-webui/open-webui), up and running in a few clicks. Desktop installs it on your computer, keeps it up to date, and opens it whenever you need it.

## Download

- **macOS:** [Apple Silicon](https://github.com/open-webui/desktop/releases/latest/download/open-webui-arm64.dmg) · [Intel](https://github.com/open-webui/desktop/releases/latest/download/open-webui-x64.dmg)
- **Windows:** [Intel / AMD (x64), upstream](https://github.com/open-webui/desktop/releases/latest/download/open-webui-x64-setup.exe) · [ARM64 compatibility build](https://github.com/Halloncream/desktop-windows-arm64/actions/workflows/windows-arm64.yml)
- **Linux (Debian / Ubuntu / Mint):** [Intel / AMD (x64)](https://github.com/open-webui/desktop/releases/latest/download/open-webui_amd64.deb) · [ARM64](https://github.com/open-webui/desktop/releases/latest/download/open-webui_arm64.deb)
- **Linux (AppImage):** [Intel / AMD (x64)](https://github.com/open-webui/desktop/releases/latest/download/open-webui_x86_64.AppImage) · [ARM64](https://github.com/open-webui/desktop/releases/latest/download/open-webui_arm64.AppImage)

If an AppImage fails to start with a `chrome-sandbox` error on Debian, Ubuntu, or Linux Mint, install the `.deb` package above. Its installer configures the sandbox permissions needed to start the app.

Snap and Flatpak packages are available on the [releases page](https://github.com/open-webui/desktop/releases).

Internet is required for installation and updates.

Enable **Automatic desktop updates** in **Settings → About** to update on quit.

## How It Works

Open the app and click **Get Started**. Desktop installs Open WebUI on your computer, starts it for you, and opens it in the app. You use the same Open WebUI you know, with setup and updates handled through Desktop.

Desktop runs your own local copy of Open WebUI. If you already use Open WebUI on another server, [Open WebUI Tether](https://github.com/open-webui/tether) is a companion app that extends what you can do with it.

## System Requirements

| | Requirements |
|--|-------------|
| **Disk** | 5 GB+ |
| **OS** | macOS 12+, Windows 10+, modern Linux (glibc 2.28+) |

## Windows ARM64 compatibility

On Windows ARM64, the desktop shell and llama.cpp remain native ARM64. The
Open WebUI backend uses x64 Python through Windows' built-in x64 emulation,
because required packages such as OpenCV do not publish Windows ARM64 wheels.
No WSL, Docker, or system Python installation is needed.

Setup downloads the checksum-verified x64 Python distribution and stores it in
`python-x64` under the installation directory. Its download cache is separate
from native Python. Existing `python` environments are preserved; chat data
continues to use the configured data directory. The first run installs the
backend dependencies into the new environment.

The compatibility launcher preloads scikit-learn's metrics before PyTorch to
avoid a Windows DLL-loader startup hang. OpenBLAS and OpenMP default to one
thread for this Python process; explicit environment settings take precedence.

This requires Windows with working x64 emulation. Python extensions run under
emulation and may be slower. This change does not add native ARM64 CUDA support;
llama.cpp acceleration still depends on the available runtime builds.

## Privacy

Desktop does not collect usage data. If you connect Open WebUI to an external AI provider, that provider's privacy policy applies.

## Community

- 💬 [Discord](https://discord.gg/open-webui) - Come hang out
- 🐛 [Issues](https://github.com/open-webui/desktop/issues) - Report bugs or request features
- 🌐 [Open WebUI](https://github.com/open-webui/open-webui) - The main project
- 📖 [Docs](https://docs.openwebui.com) - Full documentation

## Contributing

```bash
npm install
npm run dev
```

See [CHANGELOG.md](CHANGELOG.md) for release history. Licensed under [AGPL-3.0](LICENSE).
