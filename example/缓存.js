/**
 * 按缓存位置分类
 * 1、service Worker 存储在 chrome的控制台Application -> Cache Storage
 * 2、memory cache(浏览器缓存) 所有的请求资源都进入memory cache 主要分为两个板块
 * preloader  （加载一个站点的过程） preload
 * 3、disk cache(http cache) 硬盘缓存，遵守http协议头中的字段 譬如 强缓存，对比缓存，以及cache-control
 */


 // 强缓存  客户端发起请求后，会先访问数据库看缓存是否存在，若存在则直接返回，不存在则请求真的服务器，响应之后在写入缓存数据库
 // 强缓存直接减少请求书 早层强制缓存的字段是 cache-control 和expires

/**
 * expires  缓存到期时间 代表的是绝对时间(当前时间+缓存时间) 
 * cache-control 代表相对时间  资源缓存的最大有效时间，在该时间内，客户端不需要向服务器发请求 max-age = 0 代表 不要在下次浏览时使用
 * no-cache 字面意思是 ”不要缓存“ 但实际是要求客户端缓存内容的，只是是否使用这个内容由后续的对比决定
 * cache-control的优先级高于expires
 */

 // 对比缓存(协商缓存)
 // 强缓存失效后，需要使用对比缓存，由服务器决定缓存内容是否失效 ，协商缓存在请求数上和 没有缓存是一致的，
 // 对比缓存可以和强制缓存一起使用，作为在强制缓存失效后的一种后备方案
 /**
  * 对比缓存的2 组字段
  * 1、 last-modified & if-modified-since .下次请求相同资源会将last-modified的值写入到请求头deif-modified-since字段，服务器拿到 If-Modified-Since 的值之后，
  * 与last-modified字段进行对比
  * 2、Etag&if-none-match  Etag存储的是文件的特殊标识 (一般都是hash生成的),流程与last-modified一致
  */

  // cookie 和session的区别

  // 1、cookie 在客户端 ，session 在服务端
  // 2、 cookie的安全性一般，其他人可以通过分析存放在本地的cookie，进行一系列基于cookie的操作
  // 3、session默认被存在服务器的一个文件夹里
  // 4、session的运行依赖session id，而session id 是存在cookie中的
  // 5、 用户验证这种场合一般会用session



  // csrf攻击
  // csrf是跨站点请求伪造，攻击者盗用身份，进行恶意请求。
  // 阻止方法：1、验证http Referer字段。该 字段记录了该http请求的来源地址，匹配来源地址是否是来自之前的地址
  // 2、在请求地址中增加token并验证，在用户登录之后生成session并存放于session中，然后每次请求是把token从session拿出，并与请求中的token
  // 进行对比

  // xss 攻击
  // 向网站中注入js代码，从而达到攻击用户的目的，可能会造成 盗用cookie，破坏页面结构，插入广告；D-doss攻击
  // 防止方法 1、转义+过滤  2、在cookie中设置httponly属性，那么通过js脚本就无法获取到cookie信息