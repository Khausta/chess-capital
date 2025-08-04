// Импорт пакетов
const gulp = require('gulp')
const less = require('gulp-less')
const stylus = require('gulp-stylus')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const ts = require('gulp-typescript')
//const coffee = require('gulp-coffee')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const gulppug = require('gulp-pug')
const newer = require('gulp-newer')
const browsersync = require('browser-sync').create()
const del = require('del')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  // pug: {
  //   src: 'src/**/*.pug',
  //   dest: 'dist'
  // },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css'],
    dest: 'dist/css/'
  },
  scripts: {
    src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/**',
    dest: 'dist/fonts/'
  },
  // video: {
  //   src: 'src/video/**',
  //   dest: 'dist/video/'
  // }
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
  return del(['dist/*', '!dist/img'])
}

// Обработка html и pug
function pug() {
  return gulp.src(paths.pug.src)
  .pipe(gulppug())
  // .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.pug.dest))
  .pipe(browsersync.reload({stream: true}))
}

// Обработка html и pug
function html() {
  return gulp.src(paths.html.src)
  //.pipe(gulppug())
  .pipe(htmlmin({ collapseWhitespace: false }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream())
}


function fonts() {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
    .pipe(browsersync.stream())
}

// function video() {
//   return gulp.src(paths.video.src)
//     .pipe(gulp.dest(paths.video.dest))
//     .pipe(browsersync.stream())
// }


// Обработка препроцессоров стилей
 function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
  // .pipe(rename({suffix: '.min', prefix: ''}))
  .pipe(autoprefixer())
  // .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())
};


// Обработка Java Script, Type Script и Coffee Script
function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  //.pipe(coffee({bare: true}))
  /*
  .pipe(ts({
    noImplicitAny: true,
    outFile: 'main.min.js'
  }))
  */
  .pipe(babel({
    presets: ['@babel/env']
  }))
  // .pipe(uglify())
  // .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

// Отслеживание изменений в файлах и запуск лайв сервера
function watch() {
  browsersync.init({
    server: {
        baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  // gulp.watch(paths.pug.dest).on('change', browsersync.reload)
  // gulp.watch(paths.pug.src, pug)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.fonts.src, fonts)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.pug = pug
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.watch = watch

// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(fonts, styles, scripts, img), watch)