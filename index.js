const core = require('@actions/core');
const fs = require('fs');
const path = require('path');

// Common files that should be excluded from naming convention checks
const STANDARD_FILES = [
  'README.md', 'README', 'LICENSE', 'CHANGELOG.md', 'CHANGELOG',
  'CONTRIBUTING.md', 'CODE_OF_CONDUCT.md', 'SECURITY.md',
  'Makefile', 'Dockerfile', 'Jenkinsfile', 'Vagrantfile',
  '.gitignore', '.gitattributes', '.editorconfig', '.npmrc', '.nvmrc',
  '.dockerignore', '.eslintrc', '.prettierrc', '.babelrc',
  'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'composer.json', 'composer.lock', 'Gemfile', 'Gemfile.lock',
  'Cargo.toml', 'Cargo.lock', 'go.mod', 'go.sum'
];

function getAllFiles(dir, excludeDirs) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(getAllFiles(fullPath, excludeDirs));
      }
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function isStandardFile(filename) {
  // Check exact match
  if (STANDARD_FILES.includes(filename)) {
    return true;
  }
  // Check if it's a dotfile (starts with .)
  if (filename.startsWith('.')) {
    return true;
  }
  return false;
}

function getRegexForConvention(convention) {
  switch (convention) {
    case 'snake': return /^[a-z0-9]+(_[a-z0-9]+)*\.[a-z0-9]+$/;
    case 'camel': return /^[a-z0-9]+([A-Z][a-z0-9]+)*\.[a-z0-9]+$/;
    default:      return /^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+$/; // kebab-case
  }
}

async function run() {
  try {
    const convention = core.getInput('convention');
    const exclude = core.getInput('exclude').split(',').map(e => e.trim());
    const regex = getRegexForConvention(convention);

    const files = getAllFiles('.', exclude);
    const invalidFiles = files.filter(f => {
      const filename = path.basename(f);
      // Skip standard/conventional files
      if (isStandardFile(filename)) {
        return false;
      }
      return !regex.test(filename);
    });

    if (invalidFiles.length > 0) {
      core.setOutput('passed', false);
      core.setOutput('failed_count', invalidFiles.length.toString());
      core.setFailed(`❌ Found files that violate ${convention}-case naming:\n` + invalidFiles.join('\n'));
    } else {
      core.setOutput('passed', true);
      core.setOutput('failed_count', '0');
      console.log(`✅ All files follow ${convention}-case naming convention.`);
    }
  } catch (error) {
    core.setOutput('passed', false);
    core.setFailed(error.message);
  }
}

run();
