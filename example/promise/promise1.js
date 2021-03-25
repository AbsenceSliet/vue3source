const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";
// 有三种状态state = PENDING | RESOLVED | REJECTED
// value 成功的原因 reason 失败的原因
// 同一个promise中state 只能从 PENDING =>RESOLVED  或者 PENDING =>REJECTED  ，并且该状态是不可逆的
// 用户自己决定成功或者失败
// promise中 有一个立即执行函数作为参数
class Promise {
  constructor(excute) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    let resolve = (value) => {
      if (this.state === PENDING) {
        this.state = RESOLVED;
        this.value = value;
      }
    };
    let rejecte = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
      }
    };
    try {
      excute(resolve, rejecte);
    } catch (error) {
      rejecte(error);
    }
  }
  then(onFulfilled,onRejected){
      if(this.state===RESOLVED){
        onFulfilled(this.value)
      }
      if(this.state===REJECTED){
        onRejected(this.reason)
      }
  }
}
module.exports = Promise;
