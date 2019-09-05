/***********
* settings *
***********/

const browser = "firefox",                      // replace with your fav
      debug_mode = true,                        // need gulp logging?
      destination_directory = "public_html",    // your output dir's name
      localhost_port = 3030,                    // self-explanatory
      source_directory = "src";                 // your working dir's name

/***********
* includes *
***********/

const gulp = require('gulp'),

      // css
      cssnano = require("cssnano"),
      postcss = require("gulp-postcss"),
      sass = require("gulp-sass"),
      sourcemaps = require("gulp-sourcemaps"),

      // js
      concat = require('gulp-concat'),
      uglify = require('gulp-uglify'),

      // images
      imagemin = require("gulp-imagemin"),
      imageminPngquant = require('imagemin-pngquant'),

      // utility
      autoprefixer = require("autoprefixer"),
      browsersync = require("browser-sync").create(),
      copy = require("gulp-copy"),
      del = require("del"),
      log = require('fancy-log'),
      newer = require("gulp-newer"),
      rename = require("gulp-rename"),
      plumber = require("gulp-plumber");

/************
* variables *
************/

const src = './' + source_directory,
      dst = './' + destination_directory,
      paths = {
        src: src,
        dst: dst,
        html: {
          src: src,
          dst: dst
        },
        images: {
          src: src + "/img",
          dst: dst + "/img"
        },
        styles: {
          sass: {
            src: src + "/sass",
            dst: dst + "/sass"
          },
          css: {
            src: src + "/css",
            dst: dst + "/css"
          }
        },
        scripts: {
          src: src + "/js",
          dst: dst + "/js"
        }
};

/**********
* methods *
**********/

gulp.task('clean', function(done) {
   del([paths.dst]);
   done();
});

gulp.task('cleanup', function(done) {
   del([
     paths.styles.css.src + "/style.min.css",
     paths.scripts.src + "/script.min.js"
   ]);
   done();
});

gulp.task('images', function() {
  return gulp.src([
    paths.images.src + "/**/*",
    "!" + paths.images.src + "/**/*.md"
  ])
    .pipe(newer(paths.images.dst))
    .pipe(
      imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          // imagemin.optipng({ optimizationLevel: 5 })
          imageminPngquant({ speed: 10 })
        ], {
          verbose: debug_mode
        })
    )
    .pipe(gulp.dest(paths.images.dst))
    .pipe(browsersync.stream());
});

gulp.task('move:css', function() {
  var srcPath = paths.styles.css.src + "/style.min.css";
  return gulp.src(srcPath)
    .pipe(copy(paths.styles.css.dst + "/",
      { prefix: srcPath.split("/").length - 2 }));
});

gulp.task('move:css:vendor', function() {
  var srcPath = paths.styles.css.src + "/vendor/**/*.css";
  return gulp.src(srcPath)
    .pipe(copy(paths.styles.css.dst + "/vendor/",
      { prefix: srcPath.split("/").length - 2 }));
});

gulp.task('move:html', function() {
  var srcPath = paths.html.src + "/*.html";
  return gulp.src(srcPath)
    .pipe(copy(paths.html.dst + "/",
      { prefix: srcPath.split("/").length - 1 }));
});

gulp.task('move:js', function() {
  var srcPath = paths.scripts.src + "/script.min.js"
  return gulp.src(srcPath)
    .pipe(copy(paths.scripts.dst + "/",
      { prefix: srcPath.split("/").length - 2 }));
});

gulp.task('move:js:vendor', function() {
  var srcPath = paths.scripts.src + "/vendor/**/*.js";
  return gulp.src(srcPath)
    .pipe(copy(paths.scripts.dst + "/vendor/",
      { prefix: srcPath.split("/").length - 2 }));
});

gulp.task('move:other', function(done) {
  // Add tasks here for anything else that needs to be moved, like
  // data, fonts, et al.
  done();
});

function reload(done) {
  browsersync.reload();
  done();
}

gulp.task('serve', function(done) {
   browsersync.init({
     browser: browser,
     open: "local",
     port: localhost_port,
     server: {
       baseDir: paths.dst
     }
   });
   done();
});

gulp.task('scripts', function() {
  return gulp.src([
      paths.scripts.src + "/**/*.js",
      "!" + paths.scripts.src + "/vendor/**/*.js"
    ])
    .pipe(plumber())
    .pipe(concat('script.min.js'))
    // .pipe(uglify())                                         // prod
    .pipe(gulp.dest(paths.scripts.src))
    .pipe(browsersync.stream());
});

gulp.task('styles', function() {
  return gulp.src(paths.styles.sass.src + "/main.scss")
    // Initialize sourcemaps before compilation starts
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .on("error", sass.logError)
    // Use postcss with autoprefixer and compress
    // .pipe(postcss([autoprefixer(), cssnano()]))             // prod
    // Now add/write the sourcemaps
    .pipe(sourcemaps.write())
    .pipe(rename({
      basename: "style",
      extname: ".min.css"
    }))
    .pipe(gulp.dest(paths.styles.css.src))
    .pipe(browsersync.stream());
});

gulp.task('watch', function(done) {
  gulp.watch([
    paths.styles.css.src + "/**/*",
    "!" + paths.styles.css.src + "/**/*.min.css",
  ], gulp.series(['styles', 'move:css', 'move:css:vendor', reload]));

  gulp.watch([
    paths.styles.sass.src + "/**/*",
    "!" + paths.styles.sass.src + "/**/*.min.css",
  ], gulp.series(['styles', 'move:css', 'move:css:vendor', reload]));

  gulp.watch([
    paths.scripts.src + "/**/*",
    "!" + paths.scripts.src + "/**/*.min.js",
  ], gulp.series(['scripts', 'move:js', 'move:js:vendor', reload]));

  gulp.watch(paths.images.src + "/**/*", gulp.series(['images', reload]));
  done();
});

/***********
 * exports *
 **********/

gulp.task('copypaste', gulp.series(
  gulp.parallel('move:html', 'move:css', 'move:css:vendor', 'move:js', 'move:js:vendor', 'move:other')
));

gulp.task('compile', gulp.series(
  gulp.parallel('images', 'styles', 'scripts'),
  'copypaste',
  'cleanup'
));

gulp.task('build', gulp.series(
  'clean',
  'compile'
));

gulp.task('clean', gulp.series(
  'clean',
));

gulp.task('default', gulp.series('build', 'serve', 'watch'));
