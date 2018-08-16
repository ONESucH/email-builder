/* WARNING!! GULP сборка под mail рассылку */
'use strict';
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    cleanCSS = require('gulp-clean-css'),
    postCss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    autoPrefix = require('autoprefixer'),
    inlineCss = require('gulp-inline-css');

gulp.task('connect', function () {
    browserSync.init({
        server: 'build/'
    });
    gulp.watch([
        'app/**/*.less'
    ], ['builderLess']);
    gulp.watch([
        'app/*.html'
    ], ['htmlBuilder']);
});

gulp.task('htmlBuilder', function () {
    return gulp.src('app/*.html')
        .pipe(inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('reduce', function () {
    gulp.src('app/img/**/*.*')
        .pipe(plumber())
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest('build/img/'));
    browserSync.reload();
});

gulp.task('builderLess', function () {
    gulp.src(['app/*.less'])
        .pipe(plumber())
        .pipe(less())
        .pipe(cleanCSS({debug: true}, function (details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(postCss([autoPrefix({browsers: ['> 50%', 'IE 11', 'IE 10', 'IE 9', 'Firefox > 20', 'last 5 versions'], cascade: false})]))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/'));
    browserSync.reload();
});

gulp.task('default', ['connect', 'builderLess', 'htmlBuilder']);