const exec = require('child_process').exec,
      fs = require('fs'),
      gulp = require('gulp'),
      gulpif = require('gulp-if'),
      sequence = require('run-sequence'),
      cssmin = require('gulp-cssmin'),
      clean = require('gulp-clean'),
      terser = require('gulp-terser'),
      manifest = require('gulp-chrome-manifest'),
      distMasterDir = 'pwa',
      distParentDir = distMasterDir + '/Polyfills/edgeextension',
      distBaseDir = distParentDir + '/manifest',
      distDir = distBaseDir + '/Extension/',
      appxManifestFile = distBaseDir + '/appxmanifest.xml',
      appxOutput = distParentDir + '/package/edgeExtension.appx';

gulp.task('package', function () {
    let i = JSON.parse(fs.readFileSync('json/identity.json'));
    let m = JSON.parse(fs.readFileSync('manifest.json'));
    fs.readFile('appxmanifest-skeleton.xml', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        let result = data.replace(/__VERSIONID__/g, m.version)
            .replace(/__DISPLAYNAME__/g, m.name)
            .replace(/__DESCRIPTION__/g, m.description)
            .replace(/__IDNAME__/g, i.name)
            .replace(/__IDPUBLISHER__/g, i.publisher)
            .replace(/__IDPUBLISHERNAME__/g, i.displayName);
        fs.writeFile(appxManifestFile, result, 'utf8', function (err) {
            if (err) return console.log(err);
            /* this requires pwabuilder to be installed globally - npm install will take care of this global dependency */
            exec('pwabuilder package ' + distBaseDir + ' -l info', function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                if(err) return console.log(err);
                return gulp.src(appxOutput)
                    .pipe(gulp.dest('./'))
            });
        });
    });
});


gulp.task('build', function () {
    return gulp.src('manifest.json')
        .pipe(manifest({
            buildnumber: true
        }))
        .pipe(gulpif('css/**/*.css', cssmin()))
        .pipe(gulpif('js/**/*.js', terser()))
        .pipe(gulp.dest(distDir))
});

gulp.task('copyJSON', function () {
    return gulp.src('json/generationInfo.json')
        .pipe(gulp.dest(distParentDir));
});

gulp.task('copyStoreAssets', function () {
    return gulp.src('store/*')
        .pipe(gulp.dest(distDir + 'Assets'));
});

gulp.task('copyImages', function () {
    return gulp.src('css/images/*')
        .pipe(gulp.dest(distDir + 'css/images'));
});

gulp.task('copyManifest', function () {
    return gulp.src(distDir + 'manifest.json')
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function () {
    return gulp.src(distMasterDir, {read: false})
        .pipe(clean());
});

gulp.task('default', function () {
    return sequence('clean', 'build', 'copyImages', 'copyManifest', 'copyStoreAssets', 'copyJSON', 'package');
});