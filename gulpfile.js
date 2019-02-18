var gulp = require('gulp'),
    connect = require('gulp-connect'),
    pug = require('gulp-pug'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    htmlbeautify = require('gulp-html-beautify'),
    prettify = require('gulp-html-prettify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries');

// Parameters
function findParamArg(paramName, listCommands) {
    var index = listCommands.indexOf(paramName);
    if (index < 0) return null;
    var value = listCommands[index + 1];
    return value;
}

var pageName = findParamArg('-page', process.argv);
var cssName = findParamArg('-style', process.argv);
var htmlFile = "*";
var htmlPath = "**/*";
var cssFile = htmlFile;
var cssPath = htmlPath;

if (pageName) {
    htmlFile = pageName;
    htmlPath = pageName + '/' + pageName;

    if (!cssName) {
        cssFile = htmlFile;
        cssPath = htmlPath;
    } else if (cssName === "common") {
        cssFile = cssName;
        cssPath = cssFile + "/" + cssFile;
    }
}

// Server
gulp.task('connect', function () {
    connect.server({
        host: '0.0.0.0',
        root: '',
        livereload: true
    });
});

// Reload
gulp.task('reload', function () {
    gulp.src([
            htmlFile + '.html',
            'stylesheets/' + cssFile + '.css',
            '!stylesheets/' + cssFile + '.min.css'
        ])
        .pipe(connect.reload());
});

// Pug
gulp.task('pug', function () {
    return gulp.src('_pages/' + htmlPath + '.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest(''));
});

// HTML beautify
gulp.task('htmlbeautify', function() {
    return gulp.src(htmlFile + '.html')
        .pipe(prettify({indent_char: ' ', indent_size: 4, unformatted: ['i', 'b', 'strong']}))
        .pipe(gulp.dest(''));
});

// CSS
gulp.task('sass', function () {
    return gulp.src('_pages/' + cssPath + '.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('stylesheets/'));
});

// CSS autoprefixer
gulp.task('cssautoprefixer', function () {
    return gulp.src([
        'stylesheets/' + cssPath + '.css',
        '!stylesheets/' + cssPath + '.min.css'
    ])
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('stylesheets/'));
});

// CSS media queries group
gulp.task('mq-group', function () {
    return gulp.src([
        'stylesheets/' + cssPath + '.css',
        '!stylesheets/' + cssPath + '.min.css'
    ])
        .pipe(gcmq())
        .pipe(gulp.dest('stylesheets/'));
});

// CSS minify
gulp.task('cssmin', function () {
    return gulp.src([
            'stylesheets/' + cssPath + '.css',
            '!stylesheets/' + cssPath + '.min.css'
        ])
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('stylesheets/'));
});

// Flow 1
gulp.task('flow-1', function () {
    runSequence('pug', 'htmlbeautify', 'reload');
});

// Flow 2
gulp.task('flow-2', function () {
    runSequence('sass', 'cssautoprefixer', 'mq-group', 'cssmin', 'reload');
});

// Build
gulp.task('build', function () {
    runSequence('sass', 'cssautoprefixer', 'mq-group', 'cssmin', 'pug', 'htmlbeautify');
});

gulp.task('go', ['connect'], function () {
    gulp.watch([
        '_blocks/**/*.pug',
        '_pages/' + htmlPath + '.pug'
    ], ['flow-1']);

    gulp.watch([
        '_blocks/**/*.scss',
        '_pages/' + cssPath + '.scss'
    ], ['flow-2']);
});

gulp.task('default', function () {
});
