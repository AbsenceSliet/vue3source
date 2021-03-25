function add(x, y) {
  return x + y;
}
// 函数柯里化  可以将多参数的函数转化为单参数的函数
// 1.参数复用 2. 提前返回 3. 延迟计算/运行
// 可以代码复用 ，减少维护成本

//函数参数定长的柯里化
function curry(fn) {
  // 获取原函数的参数长度
  let fnLen = fn.length;
  // 保存预置参数
  const presetArgs = [].slice.call(arguments, 1);
  // 返回一个新函数
  return function () {
    let resetArgs = [].slice.call(arguments);
    const allArgs = [...presetArgs, ...resetArgs];
    if (allArgs.length < fnLen) {
      return curry.call(null, fn, ...allArgs);
    } else {
      return fn.apply(this, allArgs);
    }
  };
}
let _add = curry(add);
// console.log(_add(1, 2),_add(1)(2));
console.log(_add(2)(3));
// _add(1,2)  // 3
// _add(1)(2) // 3

// 简易的柯里化  必须要固定参数
function curry1(fn, args = []) {
  return function () {
    let resetArgs = [].slice.call(arguments);
    return fn.apply(this, [...args, ...resetArgs]);
  };
}
const _add1 = curry1(add);
console.log(_add(1, 2), _add(1)(2));

// 参数不定长的柯里化

function curryUnFiexdLength(fn) {
  const presetArgs = [].slice.call(arguments, 1);
  function curried() {
    const resetArgs = [].slice.call(arguments);
    const allArgs = [...presetArgs, ...resetArgs];
    return curryUnFiexdLength.call(null, fn, ...allArgs);
  }
  curried.toString = function () {
    console.log(...presetArgs);
    return fn.apply(null, presetArgs);
  };
  return curried;
}
function dynamicAdd() {
  return [...arguments].reduce((prev, curr) => {
    return prev + curr;
  }, 0);
}
const _add2 = curryUnFiexdLength(dynamicAdd);
console.log(_add2(1)(2)(3));

// 柯里化时间绑定
// var addEvent = (function () {
//   if (window.addEventListener) {
//     return function (ele, type, fn, capture) {
//       ele.addEventListener(type, fn, capture);
//     };
//   } else if (window.attachEvent) {
//     return function (ele, type, fn) {
//       ele.attachEvent("on" + type, fn);
//     };
//   }
// })();

/**
 * call  apply bind  改变this 指针
 * 猫吃鱼，狗吃肉，奥特曼打小怪兽。
 * 有天 狗想吃鱼了
 * 猫.吃鱼.call(狗，鱼)
 * 狗就吃到鱼了
 * 猫成精了，想打怪兽
 * 奥特曼.打小怪兽.call(猫，小怪兽)
 */

// bind  函数
Function.prototype.myBind = function () {
  let self = this, // 保存原函数
    context = [].shift.call(arguments), //保存需要绑定的this 上下文
    args = [].slice.call(arguments); //将剩余的参数转为数组
  return function () {
    self.apply(context, [...args, ...arguments]);
  };
};
let b = { name: "test" };
function testa(x, y, z) {
  console.log(this.name, +"" + x + "" + y + "" + z);
}
testa.myBind(b, 7, 8)(9);
// apply 函数
Function.prototype.myApply = function (context) {
  let env = context || window;
  env.fn = this;
  let result;
  if (arguments[1]) {
    result = env.fn(...arguments[1]);
  } else {
    env.fn();
  }
  delete env.fn;
  return result;
};

// 实现call
Function.prototype.myCall = function (context) {
  let env = context || window;
  env.fn = this;
  let args = [...arguments].slice(1);
  let result = env.fn(...args);
  delete env.fn;
  return result;
};
function isComplexDataType(obj) {
  return (typeof obj === "function" || typeof obj === "object") && obj !== null;
}
// 实现一个new
function myNew() {
  let obj = Object.create({}),
    constructor = [].shift.call(arguments),
    args = [].slice.call(arguments);
  obj.__proto__ = constructor.prototype;
  let res = constructor.apply(obj, args);
  return isComplexDataType(obj) ? res : obj;
}
function Person(name) {
  this.name = name;
}
let person1 = new Person("Bob");
let person3 = new Person("Bob");

let person2 = myNew(Person, "Bob");
console.log(person1, person2, person1 === person3);

// 实现一个map 函数 不改变原数组，返回一个新数组

function myMap(arr, fn) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i, arr));
  }
  return result;
}
let mapA1 = [1, 2, 3, 4, 5, 6];
let mapResult = myMap(mapA1, (item) => item * 2);
console.log(mapA1, mapResult);

// 浅拷贝
function shallowCopy(obj) {
  let result;
  if (obj.constructor === "Array") {
    result = [...obj];
  } else {
    for (let key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// 深拷贝

function deepClone(obj) {
  let result;
  if (typeof obj === "object") {
    result = obj.constructor === "Array" ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === "object" ? deepClone(obj[i]) : obj[i];
    }
  } else {
    result = obj;
  }
  return result;
}
// requestIdleCallback 浏览器每秒 60 帧，一帧 16.67ms
// messageChanel  实现
function deepCloneMessage(obj) {
  return new Promise((res) => {
    const { p1, p2 } = new MessageChannel();
    p1.onMessage = (event) => res(event.data);
    p2.postMessage(obj);
  });
}

function selfNew() {
  let obj = Object.create({});
  let context = [].shift.call(arguments);
  let args = [].slice.call(arguments);
  obj.__proto__ = context.prototype;
  let result = context.apply(obj, args);
  return typeof obj === "object" ? result : obj;
}


// 函数防抖 单位时间内再次触发，重置settimeout直到不触发，执行最后一次
function debounce(fn,delay){
  let timer;
  return function () {
    let args = arguments
    if(timer){
      clearTimeout(timer)
    }else{
      timer = setTimeout(()=>{
        fn.apply(this,args)
      },delay)
    }
  }
}
// 常用场景 点击提交按钮


// 函数截流  单位时间内 不管触发多少次， 只执行一次， 高频姜维低频

function throttle(fn,delay) {
    let startTime = 0,timer;
    return function () {
      let context  = this,args = arguments,currentTime = +new Date();
      clearTimeout(timer)//总是干掉事件回调
      if(currentTime-startTime>=delay){
        fn.apply(context,args)
        startTime = currentTime
      }else{
        timer = setTimeout(function(){
          fn.apply(context,args)
        },delay)
      }
    }
}
// 降低频率，单位时间内 不管触发多少次 只执行一次， immediate 是否立即执行



// 函数截流 会用在比input keyup更频繁触发的时间中如window.resize  window.scroll  input 输入框 throttle会强制函数以
// 固定的频率去执行 



function myInstanceOf(left,right){
  if(typeof left !=='object'|| left ===null ){
    return false
  }
  let proto = Object.getPrototypeOf(left)
  while(true){
    if(proto === null ) {
      return false
    }
    if(proto  === right.prototype) {
      return true
    }
    proto = Object.getPrototypeOf(proto)
  }
}

// 生成器  generator  本身是一个迭代器

let  arr  =  [4,2,1]
let iterator =  arr[Symbol.iterator]()
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
// {value: 4, done: false}
// {value: 2, done: false}
// {value: 1, done: false}
// {value: undefined, done: true}

// 斐波那契书数列 
function*  fibonacci() {
  let [prev,cur] = [0,1]
  while(true){
    [prev,cur] =[cur,prev+cur]
    yield cur
  }
}
for(let item of fibonacci()){
  if(item>50) break;
  console.log(item)
}
export {
  throttle
}