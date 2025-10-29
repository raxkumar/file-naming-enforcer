# File Naming Enforcer

A lightweight, developer-friendly GitHub Action that automatically checks your repository for inconsistent file names. It enforces a unified naming style — kebab-case, snake_case, or camelCase — helping teams maintain clean, predictable, and professional project structures.

## Features

By integrating this Action into your workflow, you can:

✅ Ensure code style consistency across all files

🚫 Prevent mixed naming patterns (like MyFile.js or data_File.py)

⚙️ Customize conventions and excluded folders easily

🧠 Catch violations automatically in pull requests

Ideal for teams who care about readability, consistency, and maintainability in large or growing repositories.

## Usage

### Basic Usage

Add this to your `.github/workflows/check-naming.yml`:

```yaml
name: Check File Naming

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: YOUR_USERNAME/file-naming-enforcer@v1
        with:
          convention: 'kebab'  # Options: 'kebab', 'snake', or 'camel'
          exclude: 'node_modules,dist,.git'
```

Replace `YOUR_USERNAME` with your GitHub username.

### Local Development

When you make changes to the action, rebuild it:

```bash
cd .github/actions/fne
npm install
npm run build
git add dist/
git commit -m "Update action"
```

### Options

- `convention`: Naming convention to enforce (`kebab`, `snake`, or `camel`). Default: `kebab`
- `exclude`: Comma-separated list of folders to ignore. Default: `node_modules,dist,.git`

## License

Licensed under the Apache License, Version 2.0
