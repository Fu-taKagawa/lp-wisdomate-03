const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

// 設定
const baseDir = path.join(__dirname, 'src/ejs');
const inputFile = path.join(baseDir, 'index.ejs');
const outputFile = path.join(__dirname, 'dist/index.html');

// カスタムファイルローダー
function fileLoader(filePath) {
  const absolutePath = path.join(baseDir, filePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

// EJS テンプレートをレンダリング
ejs.renderFile(inputFile, {}, { root: baseDir, filename: inputFile, loader: fileLoader }, function(err, str) {
  if (err) {
    console.error('EJSレンダリングエラー:', err);
  } else {
    // レンダリング結果をファイルに保存
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, str);
    console.log('HTMLファイルが dist フォルダに保存されました。');
  }
});
