import { proxya } from "./example/proxy";
import "./example/vue1";
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
