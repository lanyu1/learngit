'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./config');
var merge = require('merge-stream');
var changeCase = require('change-case');
var debug = require('gulp-debug');
var template = require('gulp-template');
var fs = require('fs');
var foreach = require('gulp-foreach');
var newer = require('gulp-newer');
var del = require('del');
var runSequence = require('run-sequence');
var glob = require("glob");
var UrlPattern = require('url-pattern');
var nunjucksRender = require('gulp-nunjucks-api');

// 读取当前项目的父目录下符合条件的模块
var moduleFolders = fs.readdirSync(path.join(conf.paths.src, "../.."))
    .filter(function (file) {
        return file != "boot" && file.indexOf(".") < 0 && fs.statSync(path.join(conf.paths.src, "../..", file)).isDirectory();
    });
conf.paths.modules = moduleFolders;
console.info(conf.paths.modules);

// 将各模块app目录下的文件拷贝到src/app下
gulp.task('sync', function () {
    var syncTasks = conf.paths.modules.map(function (mod) {
        return gulp.src(path.join('../', mod, 'src/app/', mod, '/**/*'))
            .pipe(newer(path.join(conf.paths.src, 'app', changeCase.lowerCase(mod))))
            .pipe(debug({
                title: 'copy file:'
            })).pipe(gulp.dest(path.join(conf.paths.src, 'app', changeCase.lowerCase(mod))));
    });
    return merge(syncTasks);
});

//生成src/app/generate/store.js文件
gulp.task('generateStoresFile', function () {
    let pattern = new UrlPattern('src/app/:module/stores/globalStores/:filename.js')
    conf.paths.taskVars['imports'] = [];
    conf.paths.taskVars['defines'] = [];
    glob.sync(path.join('./src/app/*/stores/globalStores/*.js')).map(function (file) {
        let match = pattern.match(file);
        conf.paths.taskVars['imports'].push("import " + match.filename + " from " + "'../" + match.module + "/stores/globalStores/" + match.filename + "';");
        conf.paths.taskVars['defines'].push(match.filename + ":" + match.filename);
    });
    gulp.src('./templates/stores.js')
        .pipe(nunjucksRender({
            extension: 'inherit', autoescape: false, data: {
                imports: conf.paths.taskVars['imports'].join("\n"),
                defines: conf.paths.taskVars['defines'].join(",")
            }
        }))
        .pipe(gulp.dest(path.join(conf.paths.src, 'app/generate')));
});

//监听相应的文件变动，自动更新文件
gulp.task('watchForGenerateFile', function () {
    gulp.watch(path.join('./templates/stores.js'), function () {
        gulp.start("generateStoresFile");
    });

    var watcher=gulp.watch(path.join('./src/app/*/stores/globalStores/*.js'), function () {
        gulp.start("generateStoresFile");
    });
    watcher.on('change', function (ev) {
        if (ev.type === 'deleted') {
            gulp.start("generateStoresFile");
        }
    });

    return gulp.watch(path.join('./templates/AutoRouter.js'), function () {
        gulp.start("generateAutoRouterFile");
    });
});

//监听相应的文件变动，自动更新文件
gulp.task('generateFile', function () {
    gulp.start("generateStoresFile");
    gulp.start("generateAutoRouterFile");
});

//生成src/app/generate/AutoRouter.js文件
gulp.task('generateAutoRouterFile', function () {
    conf.paths.taskVars['routes'] = [];
    conf.paths.taskVars['asyncRoutes'] = [];
    conf.paths.modules.map(function (mod) {
        var IndexName = changeCase.upperCase(mod) + "Index"
        conf.paths.taskVars['routes'].push("<Route path='/" + changeCase.lowerCase(mod) + "' component={" + IndexName + "}/>");
        conf.paths.taskVars['asyncRoutes'].push("const " + IndexName + " = asyncRouter(() => import('../" + changeCase.lowerCase(mod) + "/containers/" + IndexName + "'))");
    });
    gulp.src('./templates/AutoRouter.js')
        .pipe(nunjucksRender({
            extension: 'inherit', autoescape: false, data: {
                routes: conf.paths.taskVars['routes'].join("\n"),
                asyncRoutes: conf.paths.taskVars['asyncRoutes'].join("\n")
            }
        }))
        .pipe(gulp.dest(path.join(conf.paths.src, 'app/generate')));
});

//按模块监听文件变动
gulp.task("watch", function () {
    conf.paths.modules.map(function (mod) {
        var watcher = gulp.watch(path.join('../', mod, 'src/**/*.*'), function () {
            gulp.src(path.join('../', mod, 'src/app/', mod, '/**/*'))
                .pipe(newer(path.join(conf.paths.src, 'app', changeCase.lowerCase(mod))))
                .pipe(debug({
                    title: 'copy file:'
                })).pipe(gulp.dest(path.join(conf.paths.src, 'app', changeCase.lowerCase(mod))));
        });
        watcher.on('change', function (ev) {
            if (ev.type === 'deleted') {
                console.log(ev);
                del(path.relative('../', ev.path).replace(path.join(mod, '/src/app'), path.join(conf.paths.src, '/app')));
            }
        });
    });
});

gulp.task("run", function () {
    runSequence('sync', 'watchForGenerateFile', 'generateFile', 'watch');
});

gulp.task('clean', function () {
    del([path.join(conf.paths.src, '/app')]);
});

gulp.task("start", function () {
  runSequence('sync', 'generateFile');
});