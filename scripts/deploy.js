import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📦 Building Vite application...');
execSync('npm run build', { stdio: 'inherit' });

console.log('📋 Creating 404 fallback for GitHub Pages SPA...');
fs.copyFileSync('dist/index.html', 'dist/404.html');

console.log('🚀 Deploying dist folder to gh-pages branch...');
const distDir = path.resolve('dist');
try {
  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.name "mahasrikuppusamy-eng"', { cwd: distDir, stdio: 'inherit' });
  execSync('git config user.email "mahasrikuppusamy@gmail.com"', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  execSync('git commit -m "Deploy to GitHub Pages"', { cwd: distDir, stdio: 'inherit' });
  execSync('git branch -M gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git remote add origin https://github.com/mahasrikuppusamy-eng/nihongo.git', { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
  console.log('✅ Successfully deployed to gh-pages branch!');
} finally {
  const gitFolder = path.join(distDir, '.git');
  if (fs.existsSync(gitFolder)) {
    fs.rmSync(gitFolder, { recursive: true, force: true });
  }
}
