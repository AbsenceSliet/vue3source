import { proxya } from "./example/proxy";
import "./example/vue1";
import "./example/event"
import "./example/vueExample"
if (module.hot) {
  module.hot.accept();
}
const recast = require("recast");
console.log(proxya, "proxy");

const code = `
    function add(a,b){
        return a + b
    }
`;
const ast = recast.parse(code);
console.log(ast, "ast----");
// ast可以处理很巨大的代码文件
// 但我们现在只需要代码块的第一个body，即add函数
const add = ast.program.body[0];
console.log(add, "ast----");

// console.log(add.body.body)

const {
  variableDeclaration,
  variableDeclarator,
  functionExpression,
} = recast.types.builders;

ast.program.body[0] = variableDeclaration("const", [
  variableDeclarator(add.id, functionExpression(null, add.params, add.body)),
]);
const output = recast.print(ast).code;
console.log(output);

const code1 = `
    function check(a=1,b=6){
        // 返回一个数值
        return a*b
    }
`;
let output1 = recast.print(recast.parse(code1)).code;
console.log(output1);
const a = `
    var a = 1 
`;
const ast_a = recast.parse(a);
console.log(ast_a, ".program.body[0]----");

// 只能走1步或者2步， 走到80步 有多少种方法

/**getNum
 * @param num
 * @return total
 */
// 3 =  1+1+1 | 1+2 |2+1
// 4 = 1+1+1+1 | 1+1+2（3）
//  递归容易卡
function getNum(num) {
  if (num === 1) {
    return 1;
  }
  if (num === 2) {
    return 2;
  }
  return getNum(num - 1) + getNum(num - 2);
}
console.log(getNum(30), "getNum(3)");

function getNum1(num){
  
}
