/* eslint-env commonjs, node */
/* eslint-disable no-console */

'use strict';

var gulp        = require('gulp'),
    $$          = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    pipe        = require('multipipe'),
    version     = require('./package.json').version;

var name        = 'datasaur-filter',
    srcDir      = './',
    testDir     = './test/',
    jsFiles     = '**/*.js',
    buildDir    = './build/';

//  //  //  //  //  //  //  //  //  //  //  //

gulp.task('lint', lint);
gulp.task('test', test);
gulp.task('saurify', saurify);

gulp.task('default', function(callback) {
    clearBashScreen();
    runSequence(
        'lint',
        // 'test',
        'saurify',
        callback
    );
});

//  //  //  //  //  //  //  //  //  //  //  //

function clearBashScreen() {
    var ESC = '\x1B';
    console.log(ESC + 'c'); // (VT-100 escape sequence)
}

function lint() {
    return gulp.src([
        srcDir + jsFiles,
        testDir + jsFiles
    ])
        .pipe($$.excludeGitignore())
        .pipe($$.eslint())
        .pipe($$.eslint.format())
        .pipe($$.eslint.failAfterError());
}

function test() {
    return gulp.src(testDir + jsFiles)
        .pipe($$.mocha({reporter: 'spec'}));
}

function saurify() {
    return gulp.src(srcDir + 'index.js')
        .pipe($$.replace( // ...starting immediately following 'use strict' and...
            /var DataSourceIndexed .*;/,
            "(function() {\n\nvar DataSourceIndexed = window.datasaur.indexed;"
        ))
        .pipe($$.replace( // ...ending after modules.exports.
            /\w+\.exports(\s*=\s*)(\w+);/,
            'window.' + name.replace('-', '.') + '$1$2;\n})();'
        ))
        .pipe(
            $$.mirror(
                pipe(
                    $$.mirror(
                        pipe($$.rename(version + '/' + name + '.js')),
                        pipe($$.rename('edge/' + name + '.js'))
                    )
                ),
                pipe(
                    $$.uglify().on('error', $$.util.log),
                    $$.mirror(
                        pipe($$.rename(version + '/' + name + '.min.js')),
                        pipe($$.rename('edge/' + name + '.min.js'))
                    )
                )
            )
        )
        .pipe(gulp.dest(buildDir));
}


