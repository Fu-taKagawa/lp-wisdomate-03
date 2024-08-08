const gulp = require('gulp');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const prettier = require('gulp-prettier');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); // SCSSファイルを結合するために追加
const path = require('path');
const fs = require('fs');
const { src, dest, series, watch } = require('gulp');

const customFileLoader = (filePath) => {
  const rootPath = path.resolve('./src/ejs');
  const normalizedPath = filePath.replace(/^\//, '');
  const fullPath = path.resolve(rootPath, normalizedPath);

  console.log('Loading file:', fullPath); // デバッグ用

  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  } else {
    throw new Error('File not found: ' + fullPath);
  }
};

// EJSファイルをコンパイルする関数
const ejsFunc = (cb) => {
  return src(['./src/ejs/**/*.ejs', '!./src/ejs/**/_*.ejs'])
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(ejs({}, { ext: '.html' }, { basedir: './src/ejs', fileLoader: customFileLoader }))
    .pipe(rename({ extname: '.html' }))
    .pipe(
      prettier({
        printWidth: 150,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      })
    )
    .pipe(dest('./dist/'))
  cb();
};

// SCSSファイルを1つのCSSファイルにコンパイルする関数
const scssFunc = (cb) => {
  return src('./src/scss/style.scss')
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(dest('./dist/'))
  cb();
};

// ファイル監視関数
const watchFiles = () => {
  watch('./src/ejs/**/*.ejs', series(ejsFunc));
  watch('./src/scss/**/*.scss', series(scssFunc));
};

// gulpタスクの定義
exports.ejsFunc = ejsFunc;
exports.scssFunc = scssFunc;
exports.watchFiles = watchFiles;
exports.default = series(ejsFunc, scssFunc, watchFiles);
