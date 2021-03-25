// ES Module / CommonJs/ AMD/ CMD

/**
 * 起因：1、命名冲突 2、文件依赖关系
 * 好处：1、避免命名冲突2、更好的分离，按需加载3、更高复用性4、更高的可维护性
 */
// commonJs nodejs中 加载完成后才执行后面的操作
// 模块通过require 方法来同步加载所依赖的模块，通过module.exports导出需要暴露的接口


// AMD RequireJs中的产出 (异步模块定义)  异步加载模块，模块的加载不影响后面的语句执行，所有依赖这个模块的语句都定义在一个
// callback中，等加载完成之后，回调函数才会执行
// require([module])
// define(id?,deps.factory)
// requireJs实现了异步模块化，解决了明明冲突，文件依赖 ，增加了 文件的独立性，但 必须要提前加载所有的依赖项 才可以 使用，而不是按需加载
// 前置依赖，目标代码块执行前 ，必须保证所有的依赖都被引入并且执行


// CMD  一个文件即 一个模块 
// CMD 是按需加载 推崇依赖就近，延迟执行， 文件是提前加载好的， 只有的require的时候才去执行文件 
// 后置依赖，只有在目标代码中手动执行require(。。)相关依赖才会被加载并执行


// AMD 和CMD的区别 
// AMD的定位是浏览器环境，异步引入，
// CMD定位是浏览器环境和node环境，它可以require 同步引入， 也可以require.async异步引入


/**
 * define(function(require,exports,module){// 模块代码})
 */


 // ES6 Module
 // 几区了commonJs和AMD 的有点，支持异步加载，
 // ES6新增两个关键字 export 和import。 export用于把模块里的内容暴露出来 ，import  用于引入模块提供的功能
// ES6 Module 模块自动采用严格模式   2. 导出的模块默认是只读的，  不能变更  3.模块是静态化的，ESModule 模块不是对象
// 而是通过export 命令显示输出的指定代码片段 再 通过import 命令将代码命令输入， 在编译阶段输入确定模块之间的依赖关系

 /**
  * 模块化开发的演变
  * 1、全局函数
  * 2、对象命名空间
  * 3、私有共有成员分离  (立即执行函数)
  * 4、CommonJS
  * 5、AMD(require.js)
  * 6、CMD(sea.js)
  * 7、ES6 Module
  */
 