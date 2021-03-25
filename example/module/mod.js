let count = 1
let friends =[]
function plusCount() {
    count++
};

function plusYuanhua() {
    friends.push('袁华');
}
// setInterval(() => {
//     console.log('mod.js 每秒打印 - count', count);
//     console.log('mod.js 每秒打印 - friends', friends);
// }, 1000);
// plusCount()
module.exports={
    count,
    friends,
    plusCount,
    plusYuanhua,
}
