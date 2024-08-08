const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

module.exports = function (source) {
  const callback = this.async();
  
  // プロジェクトルートパスを設定
  const rootPath = path.resolve(__dirname, '../'); // プロジェクトルートパス
  
  // EJS テンプレート内の相対パスを解決する関数
  function resolveIncludePath(includePath) {
    return path.resolve(rootPath, includePath);
  }

  // EJS テンプレートのパスを解決
  const filePath = resolveIncludePath('src/ejs/index.ejs');
  
  if (!fs.existsSync(filePath)) {
    return callback(new Error(`File not found: ${filePath}`));
  }

  ejs.renderFile(filePath, {}, { root: rootPath }, (err, result) => {
    if (err) return callback(err);
    callback(null, `module.exports = ${JSON.stringify(result)};`);
  });
};
