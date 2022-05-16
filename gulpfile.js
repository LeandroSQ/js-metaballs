/* eslint-env node */
const { src, dest, series, parallel, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const del = require("del");
const htmlMinify = require("gulp-htmlmin");
const sourcemaps = require("gulp-sourcemaps");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const sass = require("gulp-sass")(require("sass"));
const cssAutoPrefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

// Options
const browserSyncOptions = {
	open: false,
	browser: false,
	ui: false,
	host: "0.0.0.0",
	server: {
		baseDir: "./dist",
		port: 3000,
	},
};

const htmlOptions = {
	collapseWhitespace: true,
	removeComments: true,
	removeRedundantAttributes: true
};

const browserifyOptions = {
	entries: ["./src/scripts/main.js"],
	debug: true,
	transform: "babelify"
};

const babelOptions = {
	babelrc: true
};

const cssOptions = {
	outputStyle: "compressed",
	sourceComments: false,
	sourceMap: false,
};

// Tasks
function reload() {
	return browserSync.reload({ stream: true });
}

function handleHtml() {
	return src("src/**/*.html")
		.pipe(htmlMinify(htmlOptions))
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchHtml() {
	return watch("src/**/*.html", handleHtml);
}

function handleJs() {
	return src("src/**/*.js")
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchJs() {
	return watch("src/**/*.js", handleJs, {
		delay: 1500,
		awaitWriteFinish: true,
	});
}

// function handleJs() {
// 	return browserify(browserifyOptions)
// 		.transform(babelify, babelOptions)
// 		.bundle()
// 		.pipe(source("script.min.js"))
// 		.pipe(buffer())
// 		.pipe(sourcemaps.init({ loadMaps: true }))
// 		.pipe(uglify())
// 		.pipe(sourcemaps.write("./"))
// 		.pipe(dest("./dist/scripts"))
// 		.pipe(reload());
// }

function handleAssets() {
	return src(
		[
			"./src/image/**.*",
			"./src/audio/**.*",
			"./src/font/**.*",
			"src/lang/**.*",
			"src/assets/**.*",
		],
		{ base: "./src" }
	)
		.pipe(dest("./dist"))
		.pipe(reload());
}

function watchAssets() {
	return watch(
		[
			"src/image/**.*",
			"src/audio/**.*",
			"src/font/**.*",
			"src/lang/**.*",
			"src/assets/**.*",
		],
		handleAssets
	);
}

function handleSCSS() {
	return src("./src/styles/**.scss")
		.pipe(sourcemaps.init())
		.pipe(sass(cssOptions).on("error", sass.logError))
		.pipe(cssAutoPrefixer())
		.pipe(concat("style.min.css"))
		.pipe(sourcemaps.write("./"))
		.pipe(dest("./dist/styles"))
		.pipe(reload());
}

function watchSCSS() {
	return watch("./src/styles/**.scss", handleSCSS);
}

function clean() {
	return del("dist");
}

function initialize() {
	return browserSync.init(browserSyncOptions);
}

// Export tasks
module.exports.assets = handleAssets;
module.exports.html = handleHtml;
module.exports.js = handleJs;
module.exports.scss = handleSCSS;
module.exports.clean = clean;
module.exports.build = series(clean, handleAssets, handleSCSS, handleHtml, handleJs);
module.exports.dev = series(module.exports.build, parallel(watchAssets, watchSCSS, watchHtml, watchJs, initialize));
module.exports.default = module.exports.build;