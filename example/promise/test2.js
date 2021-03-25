const Promise = require('./promise2')
new Promise((resolve,rejected)=>{
    setTimeout(()=>{
        resolve('成功了')
    },1500)
}).then(val=>{
    console.log('result---->',val)
},err=>{
    console.log('error---->',err)
})