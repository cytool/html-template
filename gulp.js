/**
 *
 *  1. pug + pug配置
 *  2. stylus + stylus配置
 *  3. style兼容性
 *  4. 图片压缩
 *  5. 资源大小检测与提示、阻止
 *  6. 提供 gulp build命令
 */

const {
    series,
    parallel,
    watch,
    src,
    dest
} = require('gulp')
const path = require('path')
const pug = require('gulp-pug') // 编译pug
prettify = require('gulp-prettify') // 美化html
const stylus = require('gulp-stylus') // 编译stylus
const autoprefixer = require('gulp-autoprefixer') //给css添加前缀;浏览器版本自动处理浏览器前缀
const browserSync = require('browser-sync').create() // browserSync模块,创建Browsersync实例
const { reload } = browserSync // 会通知所有的浏览器相关文件被改动，实时更新改动。

// 注：函数名不能和引入的插件变量名称重复

function func_pug() { 
    // todo
    return src('pug/*.pug') // pug/*.pug pug 目录下所有的.pug文件; pug/**/*.pug pug 目录下所有的.pug文件,含各种文件夹中的.pug文件; pug/**/!(_*.pug) pug 目录下所有的.pug文件,不含各种公共(_*)文件夹中的.pug文件
        .pipe(pug({
            pretty: true,
            self: true, // 是否使用一个叫做 self 的命名空间来存放局部变量
        }))
        .pipe(prettify({
            indent_size: 4,
        }))
        .pipe(dest('../'))
        .pipe(reload({
            stream: true
        }))
}

function func_stylus() {
    return src('stylus/*.styl')
        .pipe(stylus())
        .pipe(autoprefixer()) // 使可以很潇洒地写代码，不必考虑各浏览器兼容前缀
        .pipe(dest('../css'))
        .pipe(reload({
            stream: true
        }))
}

function func_browser_sync(cb) {
    // 初始化Browsersync服务器
    browserSync.init({
        server: {
            baseDir: path.resolve('..', './')
        }
    })
    // 4.0新版本直接引入watch即可实现任务监听功能,不用安装插件,series也可以配合watch按顺序执行设置的任务函数,注意这里不需要使用return
    watch('pug/**', {
        events: 'all', // 表示除 'ready' 和 'error' 之外的所有事件
        ignoreInitial: false //false，则在实例化过程中调用该任务，以发现文件路径。用于在启动期间触发任务
    }, func_pug)
    watch('stylus/**', {
        events: 'all',
        ignoreInitial: false
    }, func_stylus)
}

// 4.0版本的export.xxxx，这个xxxx就是在控制台中gulp执行任务的名称，可以同时export设置多个任务
// 如 export.build = build()，则在控制台输入gulp build加回车

exports.default = func_browser_sync

exports.build = exports.default