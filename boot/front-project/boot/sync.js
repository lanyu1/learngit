var newer = require('gulp-newer');
var del = require('del');
var path = require('path');

gulp.task('sync', function() {
	return gulp.src('./a/**/*')
		.pipe(newer('./b'))
		.pipe(gulp.dest('./b'));
});

gulp.task('watch', function() {
	var watcher = gulp.watch('./a/**/*', ['sync']);
	watcher.on('change', function(ev) {
        if(ev.type === 'deleted') {
            del(path.relative('./', ev.path).replace('a/','b/'));
        }
    });
})