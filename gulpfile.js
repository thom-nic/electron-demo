'use strict';

let gulp = require('gulp'),
    gutil = require('gulp-util'),
    c = gutil.colors,
    eslint = require('gulp-eslint'),
    bs = require('browser-sync').create(),
    less = require('gulp-less'),
    mocha = require('gulp-mocha'),
    shell = require('gulp-shell'),
    join = require('path').join,
    del = require('del')


const OUTDIR = './dist',
      INDEX_HTML = join(__dirname,'assets/index.html'),
      CLIENT_SRC = join(__dirname,'lib/renderer'),
      CLIENT_MAIN = join(CLIENT_SRC,'index.js'),
      CSS_GLOB = './assets/css/**/*.less',
      LESS_INCLUDES = [
        'node_modules/skeleton-less/less'
      ],
      browserifyOpts = {
        entries: [CLIENT_MAIN],
        transform: ['babelify', 'mithrilify'],
        debug: true
      },
      reloadOpts = {stream:true}


gulp.task('js', function() {
  return gulp
    .src(join(CLIENT_SRC,'**/*.js'))
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('less', function() {
  return gulp.src(CSS_GLOB)
    .pipe(less({paths: LESS_INCLUDES}))
    .on('error', function(err) {
      gutil.log(c.red('[CSS]'), err.message)
      bs.notify('CSS error', err)
      this.emit('end')
    })
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('html', function() {
  return gulp.src(INDEX_HTML)
    .pipe(gulp.dest(OUTDIR))
    .pipe(bs.reload(reloadOpts))
})

gulp.task('lint', function() {
  return gulp.src([join(CLIENT_SRC,'**/*.js')])
    .pipe(eslint())
    .pipe(eslint.format())
    //.pipe(eslint.failOnError())
})

gulp.task('clean', function(done) {
  return del([OUTDIR], done)
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

gulp.task('mocha', ['build','browser-sync'], function() {
  process.env.NODE_ENV = process.env.NODE_ENV || "test"
  require('babel/register')
  return gulp.src('test/**/*.js', {read: false})
        .pipe(mocha({
          require: "babel/register",
          ui: "bdd",
          timeout: "6000",
          reporter: "nyan"
        }))
        .once('error', function() { process.exit(1) })
        .once('end', function() { process.exit() })
})

// electron-prebuilt is installed as `node_modules/.bin/electron`
gulp.task('launch', ['build'], function() {
  return gulp
    .src('.')
    .pipe(shell(['electron .' /* --proxy-server=http://localhost:3000'*/]))
    .once('end', process.exit)
})

gulp.task('build', ['js','less','html'])
gulp.task('test', ['mocha'])
gulp.task('run', ['build','lint','watch','launch'])
gulp.task('default', ['run'])

