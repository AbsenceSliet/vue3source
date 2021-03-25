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

class Promise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; // 成功的回调
    this.onRejectedCallbacks = []; // 失败的回调
    let resolve = (value) => {
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
  then(onFulfilled, onRejected) {
    // 状态变为 成功
    if (this.state === RESOLVED) {
      onFulfilled(this.value);
    }
    // 状态变为 失败
    if (this.state === REJECTED) {
      onRejected(this.reason);
    }
    // 状态是pending 则将onFulfilled,onRejected 存放到对应的队列中,等待状态确定之后，再去依次执行
    //  如果外部调用 为隔了1秒才进行resolve或者rejected，则状态开始为pending，一秒之后，变为resolved 或者rejected
    // 使用发布订阅模式
    if (this.state === PENDING) {
      this.onResolvedCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}
module.exports = Promise;
