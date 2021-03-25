// loader 和 plugin 的区别 
// loader是一个转换器，操作的是文件 ，单纯的文件转换过程
// plugin 是一个扩展器，丰富了webpack本身，针对的是loader结束后，webpack打包的整个过程，它是基于事件机制工作的
// 会监听webpack打包过程中的某些生命周期，执行任务

// loader  是一个导出为function的node 模块，可以将匹配的文件进行转换 它是一个文件加载器，并对文件进行处理， 诸如 编译、压缩等 ，最终一起
// 打包到指定的文件中 

// 特性 
// 1、处理一个文件可以使用多个loader，loader 的执行顺序是和本身的顺序相反的，即最后一个loader最先执行
// 2、第一个执行的loader接受源文件内容作为参数，其他loader 接受上一个loader 的返回值作为参数，最后执行的
// loader会返回此模块的javascript源码
// 编写例子
module.exports = function (source) {
    console.log('第一个loader')
    // 进行一系列的操作， 可以使用正则替换或者进行压缩
    // 最后在返回出去操作的内容
    return source
}

// plugin 比loader强大，通过钩子可以涉及整个构建过程，可以做一些构建范围内的事情。

// 步骤如下
// 1、编写一个javascript 命名函数
// 2、在他的原型上定义一个apply方法
// 3、指定挂载的webpack事件钩子
// 4、处理webpack内部实例的特定数据
// 5、功能完成后调用webpack 的回调


//  webpack的插件是基于Tapable的，Tapable允许你添加应用到javascript模块中， 类似于NodeJs的EventEmitter，可以被继承和mixin到其他模块中

//提供的方法  
plugin(name,handle) // 类似于 addeventlistener
apply(plugininstance) // 类似于trigger 触发


function MyPlugin(options) {}
MyPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compilation',compilation=>{
        console.log('MyPlugin')
    })
}