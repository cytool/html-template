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
    watch,
    src,
    dest,
} = require('gulp')
const path = require('path')
const pug = require('gulp-pug') // 编译pug
const prettify = require('gulp-prettify') // 美化html
const stylus = require('gulp-stylus') // 编译stylus
const autoprefixer = require('gulp-autoprefixer') // 给css自动添加浏览器版本前缀，// v4.0，在根目录添加一个.browserslistrc文件进行gulp-autoprefixer配置
const base64 = require('gulp-base64') // css图片进行base64转码
const tinypngPlus = require('gulp-tinypng-nokey-plus') //压缩图片
const debug = require('gulp-debug') //输出当前gulp管道运行对象
const browserSync = require('browser-sync').create() // browserSync模块,创建Browsersync实例
const { reload, } = browserSync // 会通知所有的浏览器相关文件被改动，实时更新改动。

// 注：4.0版本使用了函数和return进行任务设置，函数名不能和引入的插件变量名称重复

const funcPug = () => {

    return src('pug/*.pug') // pug/*.pug pug 目录下所有的.pug文件; pug/**/*.pug pug 目录下所有的.pug文件,含各种文件夹中的.pug文件; pug/**/!(_*.pug) pug 目录下所有的.pug文件,不含各种公共(_*)文件夹中的.pug文件
        .pipe(pug({
            pretty: true,
            self: true, // 是否使用一个叫做 self 的命名空间来存放局部变量
        }))
        .pipe(prettify({ indent_size: 4, }))
        .pipe(dest('../'))
        .pipe(reload({ stream: true, }))

}

const funcStylus = () => {

    return src('stylus/*.styl')
        .pipe(stylus({ compress: true, }))
        .pipe(autoprefixer()) // 使可以很潇洒地写代码，不必考虑各浏览器兼容前缀
        .pipe(base64()) // 进行base64转码,防止本地图片删除
        .pipe(dest('../css'))
        .pipe(reload({ stream: true, }))

}

const funcImg = () => {

    console.log('---------- 开始压缩图片 ----------')
    return src('img/**')
        .pipe(tinypngPlus())
        .pipe(debug({ title: '编译:', }))
        .pipe(dest('../img'))
        .pipe(reload({ stream: true, }))

}

const funcBrowserSync = () => {

    // 初始化Browsersync服务器
    browserSync.init({ server: { baseDir: path.resolve('..', './'), }, })
    // 4.0新版本直接引入watch即可实现任务监听功能,不用安装插件,series也可以配合watch按顺序执行设置的任务函数,注意这里不需要使用return
    watch('pug/**', {
        events: 'all', // 表示除 'ready' 和 'error' 之外的所有事件
        ignoreInitial: false, //false，则在实例化过程中调用该任务，以发现文件路径。用于在启动期间触发任务
    }, funcPug)
    watch('stylus/**', {
        events: 'all',
        ignoreInitial: false,
    }, funcStylus)
    watch('img/**', {
        events: 'all',
        ignoreInitial: false,
    }, funcImg)

}

// 4.0版本的export.xxxx，这个xxxx就是在控制台中gulp执行任务的名称，可以同时export设置多个任务
// 如 export.build = build()，则在控制台输入gulp build加回车

exports.default = funcBrowserSync

exports.build = exports.default