const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";
// 有三种状态state = PENDING | RESOLVED | REJECTED
// value 成功的原因 reason 失败的原因
// 同一个promise中state 只能从 PENDING =>RESOLVED  或者 PENDING =>REJECTED  ，并且该状态是不可逆的
// 用户自己决定成功或者失败
// promise中 有一个立即执行函数作为参数 executor
//  executor 接受两个参数 分别是resolve,rejected
// promise 有一个value 保存成功状态的值。   该值可能是undefined thenable 或者promise  PromiseA+1.3
// promise 有一个reason 保存失败的值
// promise必须有一个then 方法 then 接受两个参数， 分别是promise成功的回调 onFulfilled 以及失败的回调onRejected
// 如果then中抛出了异常，那么会把这个异常作为参数，传递给下一个then的失败的回调  onRejected
// 如果调用then时，promise已经成功，则执行onFulfilled 并且把value 传过去
// 如果调用then时，promise已经失败，则执行onRejected 并且把reason 传过去
function resolvePromise(promise2, x, resolve, rejected) {
  // Promise/A+ 2.3.3.3.3 只能调用一次
  let thenCalledOrThrow;
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (promise2 === x) {
    return rejected(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  // // PromiseA+2.3.2
  // if (x instanceof Promise) {
  //   //如果x的状态没有确定，那么它是有可能被一个thenable决定最终状态值的
  //   if (x.state === PENDING) {
  //     x.then((value) => {
  //       resolvePromise(promise2, value, resolve, rejected);
  //     }, rejected);
  //   } else {
  //     x.then(resolve, rejected);
  //   }
  //   return;
  // }
  if ((x !== null && typeof x === "object" )|| typeof x === "function") {
    try {
      // 2.3.3.1 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
      // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
      // 即要判断它的类型，又要调用它，这就是两次读取
      then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (resolvedValue) => {
            if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
            thenCalledOrThrow = true;
            // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
             resolvePromise(promise2, resolvedValue, resolve, rejected);
          },
          (rejectedReason) => {
            if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
            thenCalledOrThrow = true;
            rejected(rejectedReason);
          }
        );
      } else {
        //如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x);
      }
    } catch (error) {
      if (thenCalledOrThrow) return; // 2.3.3.3.3 即这三处谁选执行就以谁的结果为准
      thenCalledOrThrow = true;
      rejected(error);
    }
  } else {
    //如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
    resolve(x);
  }
}
class Promise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; // 成功的回调
    this.onRejectedCallbacks = []; // 失败的回调
    let resolve = (value) => {
      // ======新增逻辑======
      // 如果 value 是一个promise，那我们的库中应该也要实现一个递归解析
      if(value instanceof Promise){
        // 递归解析 
        return value.then(resolve,rejecte)
    }
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
        // 依次执行函数
        for (let i = 0; i < this.onResolvedCallbacks.length; i++) {
          this.onResolvedCallbacks[i](value);
        }
      }
    };
    let rejecte = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        // 依次执行函数
        for (let i = 0; i < this.onRejectedCallbacks.length; i++) {
          this.onRejectedCallbacks[i](reason);
        }
      }
    };
    // 考虑到执行executor的过程中有可能出错，我们用try/catch块给包起来，并且在出错后以catch到的值reject掉这个Promise
    try {
      executor(resolve, rejecte);
    } catch (error) {
      rejecte(error);
    }
  }
  // then 方法 并接受两个参数 onFulfilled,onRejected
  // then 方法可以进行链式调用， then 可以在同一个promise中多次进行调用 PromiseA+2.2.6
  // then 方法必须return一个新的promise PromiseA+2.2.7
  // 值的穿透 PromiseA+2.2.7
  // 如果 onFullfilled或者onRejected 抛出异常，则promise2 一定会把这个异常作为参数传递下去
  // 如果onFullfilled 不是一个函数，并且promise1 是Fullfilled状态，则promise2 onFullfilled 则必然会把promise1 的值传递下去
  // 如果onRejected 不是一个函数，并且promise1 是rejected状态，则promise2  onRejected则必然会把promise1 的reason传递下去
  // then的参数可以省略，即onFullfilled或者onRejected不是函数，且依旧可以在下一个then中获取到之前返回的值 PromiseA+2.2.1
  // 如果 onFullfilled或者onRejected ，如果返回值 x 是一个promise ，则会等这个promise 执行完，若成功则走下一个then的成功onFullfilled，若失败，则走下一个then的onRejected, 如果抛出异常则走下一个then的失败
  // 如果then 的返回值 x 和promise是同一个引用对象，则会在成循环引用，会抛出异常，把异常传递给下一个then的失败的回调中 PromiseA+2.3.1
  then(onFulfilled, onRejected) {
    // 值的穿透 判断 两个参数是否为函数 then默认参数把值往后传或者抛异常
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    // 每次调用then 都返回一个新的promise对象  Promise/A+ 2.2.7
    let promise2 = new Promise((resolve, rejected) => {
      // 状态变为 成功
      if (this.state === RESOLVED) {
        // promiseA+3.1 2.2.4
        setTimeout(() => {
          try {
            // x 可能是一个promise
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, rejected);
          } catch (error) {
            rejected(error);
          }
        }, 0);
      }
      // 状态变为 失败
      if (this.state === REJECTED) {
        // promiseA+3.1 2.2.4
        setTimeout(() => {
          try {
            // x 可能是一个promise
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, rejected);
          } catch (error) {
            rejected(error);
          }
        }, 0);
      }
      // 状态是pending 则将onFulfilled,onRejected 存放到对应的队列中,等待状态确定之后，再去依次执行
      // 如果外部调用 为隔了1秒才进行resolve或者rejected，则状态开始为pending，一秒之后，变为resolved 或者rejected
      if (this.state === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              // x 可能是一个promise
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, rejected);
            } catch (error) {
              rejected(error);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          // promiseA+3.1 2.2.4
          setTimeout(() => {
            try {
              // x 可能是一个promise
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, rejected);
            } catch (error) {
              rejected(error);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
  // resolve 有一个等待的功能
  static resolve(data){
    if(data instanceof Promise) return data;
    return new Promise((resolve,reject)=>{
      if(data&& data.then&& typeof data.then ==='function'){
        data.then(resolve,reject)
      }else{
        resolve(reason)
      }
    })
  }
  static reject(reason){
    return new Promise((resolve,reject)=>{
      reject(reason)
    })
  }
}
// 是解决并发问题的，多个异步并发获取最终的结果（如果有一个失败则失败）
Promise.all = function(values){
  if(!Array.isArray(values)){
    const type = typeof values
    return new TypeError(`typeError:${type} ${values} is not iterable `)
  }
  return new Promise((resolve,rejected)=>{
    let resultArr= [],orderIndex =0;
    const processResultByKey = (value,index) =>{
      resultArr[index] = value
      if(++orderIndex===values.length){
        resolve(resultArr)
      }
    }
    for(let i=0;i<values.length;i++){
      let value = values[i]
      if(value&&typeof value.then ==='function'){
        value.then((v)=>{
          processResultByKey(v,i)
        },rejected)
      }else{
        processResultByKey(value,i)
      }
    }
  })
}
// Promise.race 用来处理多个请求，采用最快的（谁先完成用谁的）。
Promise.race = function(values){
  return new Promise((resolve,rejected)=>{
    for(let i=0;i<values.length;i++){
      let value = values[i]
      if(value&&typeof value.then ==='function'){
        value.then(resolve,rejected)
      }else{
        // 普通值
        resolve(val)
      }
    }
  })
}
Promise.prototype.finally = function(callback) {
  return this.then((value)=>{
    return Promise.resolve(callback()).then(()=>value)
  },(reason)=>{
    return Promise.resolve(callback()).then(()=>{throw reason})
  })  
}
Promise.prototype.catch = function(callback){
  return this.then(null,callback)
}
module.exports = Promise;
