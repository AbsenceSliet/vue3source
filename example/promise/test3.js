// const Promise = require('./promise3')
// 值的穿透 PromiseA+2.2.7
// 如果 onFullfilled或者onRejected ，如果返回值x是一个promise ，则会等这个promise 执行完，若成功则走下一个then的成功onFullfilled，若失败，则走下一个then的onRejected, 如果抛出异常则走下一个then的失败
// 如果 onFullfilled或者onRejected 抛出异常，则promise2 一定会把这个异常作为参数传递下去
// 如果onFullfilled 不是一个函数，并且promise1 是Fullfilled状态，则promise2 onFullfilled 则必然会把promise1 的值传递下去
// 如果onRejected 不是一个函数，并且promise1 是rejected状态，则promise2  onRejected则必然会把promise1 的reason传递下去

const Promise = require("./promise3");

// then的参数可以省略，即onFullfilled或者onRejected不是函数，且依旧可以在下一个then中获取到之前返回的值 PromiseA+2.2.1
new Promise((resolve, rejected) => {
  resolve("success");
  // rejected('失败了')
})
  .then(
    (val) => {
      console.log("result---->", val);
      // throw new Error("success throw error");
    },
    (err) => {}
  )
  .then(
    () => {},
    (err) => {
      console.log(err);
    }
  );

// 如果then 的返回值 x 和promise是同一个引用对象，则会在成循环引用，会抛出异常，把异常传递给下一个then的失败的回调中 PromiseA+2.3.1


Promise.resolve(456).finally(()=>{
  return new Promise((res,rej)=>{
    setTimeout(()=>{
      res('finaly test 123')
    },2000)
  })
}).then(val=>{
  console.log(val,'success12312')
})