const gulp = require( 'gulp' );
const fs = require( 'fs' );

const gulpZip = require( 'gulp-zip' );
const zip = gulpZip.default || gulpZip;

// Remove old output so stale files never end up in the zip
function clean( done ) {
	fs.rmSync( 'bundled', { recursive: true, force: true } );
	fs.rmSync( 'zip', { recursive: true, force: true } );
	done();
}

// encoding: false keeps binary files (images, fonts) intact in gulp 5
function bundle() {
	return gulp
		.src(
			[
				'assets/**/*',
				'build/**/*',
				'inc/**/*',
				'languages/**/*',
				'public/**/*',
				'vendor/**/*',
				'iframe.html',
				'readme.txt',
				'streamcast.php',
			],
			{ base: '.', encoding: false }
		)
		.pipe( gulp.dest( 'bundled/streamcast' ) );
}

function zipBundle() {
	return gulp
		.src( [ 'bundled/**' ], { encoding: false } )
		.pipe( zip( 'streamcast.zip' ) )
		.pipe( gulp.dest( 'zip' ) );
}

exports.clean = clean;
exports.bundle = bundle;
exports.zip = zipBundle;
exports.package = gulp.series( clean, bundle, zipBundle );
