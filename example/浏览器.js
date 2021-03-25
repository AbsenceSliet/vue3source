// 重绘和重排(回流)

// 重绘  url从输入到展示到客户做了什么
/**
 * DNS解析，将域名解析成IP地址
 * TCP连接  TCP三次握手
 * 发送HTTP请求
 * 服务器处理请求并返回HTTP报文
 * 浏览器解析渲染页面
 * 断开连接：TCP四次挥手
 */

 // 1、DNS解析 浏览器通过向DNS服务器发送域名，DNS服务器查询到与域名相对应的IP地址后返回给浏览器，浏览器再讲地址打在协议上
 // 同时请求参数也会在协议搭载，然后一并发送给对应的服务器，接下来是发送HTTP请求阶段，TCP三次 握手、HTTP请求响应信息、关闭TCP链接


 //2 、TCP三次握手   三次握手的原因，为了防止已失效的链接请求报文段突然又传送到了服务端，因而产生错误

 // 3、发送HTTP请求，请求文由请求行、请求头、请求体  
 // 请求行 请求方法 URL  协议版本
 // 请求头 键值对 类似于 method/post  keepalive  持久链接， 一个链接可以发多个请求，user-agent 请求发出者。兼容性以及定制化需求
 // 请求体  请求参数


 //4\服务器处理请求

 //5、浏览器解析渲染页面

 /**
  * 1、根据HTML解析出DOM树 DOM树解析过程是一个深度优先遍历，先构建当前节点的所有子节点，再构建下一个兄弟节点。若入到script，会暂停dom树的构建，直到脚本执行完毕
  * 2、根据CSS解析出css规则树 解析css规则树时js执行将暂停，直至css规则树就绪
  * 3、结合DOM树和CSS规则树，生成渲染树
  * 4、根据渲染树计算每个节点的信息(布局) 布局：通过渲染树信息计算每个渲染对象的位置 ，回流：布局完成之后，发现某个部分发生变化，影响了布局，就需要重新渲染
  * 5、根据计算好的信息绘制页面 重绘： 某个元素的背景 颜色，文字颜色，不影响元素周围或布局的属性，只会引起重绘 。回流：元素大小位置法神变化，重新渲染 resize 
  * 6、断开连接：TCP四次挥手  第四次挥手由浏览器发起，告诉服务器，响应报文接受完了。
  */


// 事件循环
// 宏任务(macrotasks): setTimeout setInterval setImmediate requestAnimationFrame I/O UI渲染
// 微任务(microtasks): promise process.nextTick Object.observe MuationObserver MessageChannel

// 当一个程序中有上述任务时，先执行
// 1、I/O  --> UI渲染 --> requestionAnimationFrame
// 2、再执行 process.nextTick ---> promise --->MuationObserver  ---> MessageChannel ---> Object.observe
// 3、再把setTimeout setInterval setImmediate  塞进宏任务中 ,setTimeout,setInterval ---> setImmediate 

// 例子1 
setImmediate(()=>{
    console.log(1)
},0)
setTimeout(()=>{
    console.log(2)
},0)
new Promise((resolve)=>{
    console.log(3)
    resolve()
    console.log(4)
}).then(()=>{console.log(5)})

console.log(6)
process.nextTick(()=>{
    console.log(7)
})
console.log(8)
// 顺序是 3，4，6，8，7，5，2，1

// MessageChannel  浏览器提供的一个异步操作API ，这个接口云讯我们创建一个新的消息通道，并通过他的两个messagePort属性发送数据

const channel = new MessageChannel()
const port1 = channel.port1
const port2 = channel.port2

port1.onmessage = e => { console.log( e.data ,'port1-----listen') }
port2.postMessage('from port2')
console.log( 'after port2 postMessage' )

port2.onmessage = e => { console.log( e.data ,'port2-----') }
port1.postMessage('from port1')
console.log( 'after port1 postMessage' )


// after port2 postMessage
// after port1 postMessage
// from port2 port1-----listen
// from port1 port2-----listen

// port2 和port1  是一组 接受或发送数据

// 利用MessageChannel 实现对象的深拷贝 

function structuralClone(obj){
    return new Promise(resolve=>{
        const {port1,port2} = new MessageChannel()
        port2.onmessage=ev =>resolve(ev.data)
        port1.postMessage(obj)
    })
}

async function test(){
    const obj = {a:{b:1}}
    const clonedObj = await structuralClone(obj)
    obj['a']['b'] = 2 
    console.log(clonedObj['a']['b'])
}
test() // 1


// 利用MessageChannel 实现vue的nextTick

function asyncCallByMutationObserver(callback){
    const div = document.createElement('div')
    let count = 0 
    const obserber = new MutationObserver(()=>{
        callback && typeof callback ==='function' && callback.call(null)
    })
    obserber.observe(div,{attributes:true})
    div.setAttribute('count',++count)
}

function asyncCallByMessageChannel(callback){
    let {port1,port2}= new MessageChannel()
    port1.onmessage = callback
    port2.postMessage(1)
}


// 下面的执行顺序

setTimeout(()=>{console.log(1)},0)
new Promise(resolve=>{
    console.log(2)
    for(let i =0;i<100000;i++){
        if(i === 99999) {
            resolve()
        }
    }
    console.log(3)
}).then(()=>{
    console.log(4)
})
console.log(5)
asyncCallByMessageChannel(()=>{console.log(6)})
asyncCallByMutationObserver(()=>{console.log(7)})
console.log(8)

// 执行顺序是 2，3，5，8，4，7，6，1





// Js执行时间  大多数设备帧率为60次/秒 每帧小号16.67 ms 能让用户感到相当流畅 
// requestIdleCallback 可以充分利用帧与帧之间的空闲时间执行js ，浏览器执行线程空时间去调用。
// 若callback 长时间无法执行，它已经设置了超时时间，一旦超过时间能使任务被强制执行
// react中使用requestAnimationFrame作为ployfill，通过频率动态调整，计算timeRemaining，模拟requestIdleCallbacl，从而实现时间分片，
// 一个时间片就是一个渲染帧内js 能获得的最大执行时间





// url到页面呈现

// 网络请求部分
/**
 * 1、构建请求
 * 2、查验缓存 强缓存 协商缓存？last-modified和Etag的区别以及有了last-modified为什么还会出现Etag？  
 * 3、DNS解析
 * 4、TCP连接  3次握手和4次挥手的原因？
 * 5、发送HTTP请求
 */
// 网络响应部分
// HTTP协议版本、状态码和状态描述

// 浏览器的解析过程
/**
 * 1、构建DOM树
 * 2、样式计算
 * 3、生成布局树
 */
// 浏览器的渲染过程
/**
 * 1、建立图层树
 * 2、生成绘制表
 * 3、生成图块并栅格化
 * 4、显示器显示内容
 */