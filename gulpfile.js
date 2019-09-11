/***********
* settings *
***********/

var browser = "firefox",            // replace with your fav
    debug_mode = true,              // need gulp logging?
    destination_directory = "dst",  // your output dir's name
    localhost_port = 3030,          // self-explanatory
    prod_release = false,           // trade speed for quality
    source_directory = "src";       // your working dir's name


/***********
* includes *
***********/

const gulp = require('gulp'),

      // html
      pretty =            require("gulp-pretty-html"),

      // css
      cssnano =           require("cssnano"),
      postcss =           require("gulp-postcss"),
      sass =              require("gulp-sass"),
      sourcemaps =        require("gulp-sourcemaps"),

      // js
      concat =            require('gulp-concat'),
      uglify =            require('gulp-uglify'),

      // images
      imagemin =          require("gulp-imagemin"),
      imageminPngquant =  require('imagemin-pngquant'),

      // utility
      autoprefixer =      require("autoprefixer"),
      browsersync =       require("browser-sync").create(),
      copy =              require("gulp-copy"),
      del =               require("del"),
      fileinclude =       require("gulp-file-include"),
      gulpif =            require("gulp-if"),
      log =               require('fancy-log'),
      newer =             require("gulp-newer"),
      rename =            require("gulp-rename"),
      plumber =           require("gulp-plumber");


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

gulp.task('images', function() {
  return gulp.src([
    paths.images.src + "/**/*",
    "!" + paths.images.src + "/**/*.md"
  ])
    .pipe(newer(paths.images.dst))
    .pipe(
      gulpif(prod_release,
        // production - optimized for output
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 })
        ], {
          verbose: false
        }),
        // development - optimized for speed
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true }),
          imageminPngquant({ speed: 10 })
        ], {
          verbose: debug_mode
        }),
      )

    )
    .pipe(gulp.dest(paths.images.dst))
    .pipe(browsersync.stream());
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
    .pipe(fileinclude({
      prefix: '@@',
      basepath: paths.html.src + '/partials/'
    }))
    .pipe(pretty())
    .pipe(gulp.dest(paths.html.dst + "/"));
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
    .pipe(gulpif(prod_release, uglify()))
    .pipe(gulp.dest(paths.scripts.dst));
});

gulp.task('set:dev', function(done) {
  prod_release = false;
  done();
});

gulp.task('set:prod', function(done) {
  prod_release = true;
  debug_mode = false;
  done();
});

gulp.task('styles', function() {
  return gulp.src(paths.styles.sass.src + "/main.scss")
    .pipe(gulpif(!prod_release, sourcemaps.init()))
      .pipe(sass({ outputStyle: "expanded" }))
      .on("error", sass.logError)
      // Use postcss with autoprefixer and compress
      // https://github.com/gulp-sourcemaps/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
      .pipe(gulpif(prod_release, postcss([autoprefixer(), cssnano()])))
    .pipe(gulpif(!prod_release, sourcemaps.write()))
    .pipe(rename({
      basename: "style",
      extname: ".min.css"
    }))
    .pipe(gulp.dest(paths.styles.css.dst))
    .pipe(browsersync.stream());
});

gulp.task('watch', function(done) {
  gulp.watch([
    paths.styles.css.src + "/vendor/**/*",
    paths.styles.sass.src + "/vendor/**/*",
    paths.scripts.src + "/vendor/**/*",
  ], gulp.series(['move:css:vendor', 'move:js:vendor', reload]));

  gulp.watch([
    paths.styles.sass.src + "/**/*",
    "!" + paths.styles.sass.src + "/**/*.min.css",
    "!" + paths.styles.sass.src + "/vendor/**/*",
  ], gulp.series(['styles', 'move:css:vendor']));

  gulp.watch([
    paths.scripts.src + "/**/*",
    "!" + paths.scripts.src + "/**/*.min.js",
    "!" + paths.scripts.src + "/vendor/**/*"
  ], gulp.series(['scripts', 'move:js:vendor', reload]));

  gulp.watch([
    paths.images.src + "/**/*"
  ], gulp.series(['images', reload]));
  done();

  gulp.watch([
    paths.src + "/**/*.html"
  ], gulp.series(['move:html', reload]));
  done();
});


/***********
 * exports *
 **********/

gulp.task('build', gulp.series(
  'images',
  'styles',
  'scripts'
));

gulp.task('copypaste', gulp.parallel(
  'move:html',
  'move:css:vendor',
  'move:js:vendor',
  'move:other'
));

gulp.task('build:dev', gulp.series(
  'set:dev',
  'clean',
  'images',
  'styles',
  'scripts',
  'copypaste'
));

gulp.task('build:prod', gulp.series(
  'set:prod',
  'clean',
  'images',
  'styles',
  'scripts',
  'copypaste'
));

gulp.task('default', gulp.series(
  'clean',
  'build',
  'copypaste',
  'watch',
  'serve'
));
