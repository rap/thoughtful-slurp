/***********
 * includes
 */

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

      // utility
      autoprefixer = require("autoprefixer"),
      browsersync = require("browser-sync").create(),
      copy = require("gulp-copy"),
      del = require("del"),
      newer = require("gulp-newer"),
      rename = require("gulp-rename"),
      plumber = require("gulp-plumber");

/************
 * variables
 */

const src = "src",
      dst = "htdocs",
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
 * methods
 */

gulp.task('browserSync', function(done) {
   browsersync.init({
     server: {
       baseDir: paths.src
     },
     port: 6969
   });
   done();
});

gulp.task('browserSyncReload', function(done) {
   browsersync.reload();
   done();
});

gulp.task('clean', function(done) {
   del([paths.dst]);
   done();
});

gulp.task('move:css', function() {
  return gulp.src([paths.styles.css.src + "/main.css"])
    .pipe(copy(paths.styles.css.dst));
});

gulp.task('move:css:vendor', function() {
  return gulp.src([paths.styles.css.src + "/vendor/**/*.css"])
    .pipe(copy(paths.styles.css.dst + "/vendor"));
});

gulp.task('move:html', function() {
  var srcPath = paths.html.src + "/*.html";
  return gulp.src([srcPath])
    .pipe(copy(paths.html.dst + "/", { prefix: srcPath.split("/").length - 1 }));
});

gulp.task('move:js', function() {
  return gulp.src([paths.scripts.src + "/script.min.js"])
    .pipe(copy(paths.scripts.dst));
});

gulp.task('move:js:vendor', function() {
  return gulp.src([paths.scripts.src + "/vendor/**/*.js"])
    .pipe(copy(paths.scripts.dst + "/vendor"));
});

gulp.task('images', function() {
  return gulp.src(paths.images.src + "/**/*")
    .pipe(newer(paths.images.dst))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest(paths.images.dst))
    .pipe(browsersync.stream());
});

gulp.task('scripts', function() {
  return gulp.src([paths.scripts.src + "/**/*.js"])
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
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
    .pipe(postcss([autoprefixer(), cssnano()]))
    // Now add/write the sourcemaps
    .pipe(sourcemaps.write())
    .pipe(rename({
      basename: "main",
      extname: ".min.css"
    }))
    .pipe(gulp.dest(paths.styles.css.src))
    .pipe(browsersync.stream());
});

gulp.task('watchFiles', function(done) {
  gulp.watch(paths.styles.css.src + "/**/*", styles);
  gulp.watch(paths.styles.sass.src + "/**/*", styles);
  gulp.watch(paths.scripts.src + "/**/*", scripts);
  gulp.watch(paths.images.src + "/**/*", images);
  done();
});

/**********
 * exports
 */

gulp.task('copypaste', gulp.series(
  gulp.parallel('move:html', 'move:css:vendor', 'move:js:vendor')
));

gulp.task('compile', gulp.series(
  gulp.parallel('images', 'styles', 'scripts'),
  'copypaste'
));

gulp.task('build', gulp.series(
  'clean',
  'compile'
));

gulp.task('default', gulp.series('build', 'watchFiles'))
