'use strict';

let gulp = require('gulp'),
    browserify = require('browserify'),
    //babelify = require("babelify"),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    eslint = require('gulp-eslint'),
    bs = require('browser-sync').create(),
    less = require('gulp-less'),
    shell = require('gulp-shell'),
    join = require('path').join,
    del = require('del')


const OUTDIR = './dist'
const INDEX_HTML = join(__dirname,'assets/index.html')
const DEST_JS_FILE = 'index.js'
const CLIENT_SRC = join(__dirname,'lib/renderer')
const CLIENT_MAIN = join(CLIENT_SRC,'index.js')
const CSS_GLOB = './assets/css/**/*.less'
const LESS_INCLUDES = [
  'node_modules/skeleton-less/less'
]
const browserifyOpts = {
  entries: [CLIENT_MAIN],
  transform: ['babelify', 'mithrilify'],
  debug: true
}
const reloadOpts = {stream:true}

let bundler = browserify(browserifyOpts)

bundler
  .on('error', function(err) {
    gutil.log('Browserify Error', err)
    bs.notify('Browserify error', err)
    this.emit('end')
  })
  .on('log', gutil.log)

gulp.task('js', function() {
  return bundler
    .bundle()
    .pipe(source(DEST_JS_FILE))
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('less', function() {
  return gulp.src(CSS_GLOB)
    .pipe(less({paths: LESS_INCLUDES}))
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('html', function() {
  return gulp.src(INDEX_HTML)
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('lint', function() {
  gulp.src([join(CLIENT_SRC,'**/*.js')])
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failOnError())
})

gulp.task('clean', function(done) {
  del([OUTDIR], done)
})

// TODO Unfortunately this doesn't seem to reload the Electron shell properly.
// gulp will rebuild changes but you will still have to press Ctrl-R to see
// it in the app.
gulp.task('browser-sync', function() {
  bs.init({
    open: false,
    server: { baseDir: OUTDIR }
  })
})

// TODO build incremental changes like this:
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/incremental-builds-with-concatenate.md
gulp.task('watch', function() {
  gulp.watch(`${CLIENT_SRC}/**/*.js`, ['js','lint'])
  gulp.watch(CSS_GLOB, ['less'])
  gulp.watch(INDEX_HTML, ['html'])
})

// electron-prebuilt is installed as `node_modules/.bin/electron`
gulp.task('launch', shell.task(['electron . --proxy-server=http://localhost:3000']))

gulp.task('run', ['js','less','html','browser-sync','watch','launch'])
gulp.task('default', ['run'])

