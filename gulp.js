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
const pug = require('gulp-pug') // 编译pug
prettify = require('gulp-prettify') // 美化html
const stylus = require('gulp-stylus') // 编译stylus
const browserSync = require('browser-sync').create() // 自动刷新
const {reload} = browserSync

// 注：函数名不能和引入的插件变量名称重复

function trans_pug() { 
    // todo
    return src('pug/**/*.pug') // pug 目录下所有的.pug文件,含各种文件夹中的.pug文件
        .pipe(pug({
            pretty: true,
            self: true, // 是否使用一个叫做 self 的命名空间来存放局部变量
        }))
        .pipe(prettify({
            indent_size: 4,
        }))
        .pipe(dest('../'))
}

function browser_sync(cb) {
    browserSync.init({
        server: {
            baseDir: path.resolve('..', './')
        }
    })
    // 4.0新版本直接引入watch即可实现任务监听功能,不用安装插件,series也可以配合watch按顺序执行设置的任务函数,注意这里不需要使用return
    watch('pug/**', {
        events: 'all',
        ignoreInitial: false
    }, trans_pug)
}

exports.build = browser_sync()