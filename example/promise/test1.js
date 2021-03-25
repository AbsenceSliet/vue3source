const Promise = require('./promise1')
new Promise((resolve,rejected)=>{
    // resolve('success')
    rejected('失败了')
}).then(val=>{
    console.log('result---->',val)
},err=>{})