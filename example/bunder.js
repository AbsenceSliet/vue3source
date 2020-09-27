#!/usr/bin/env node
const recast = require("recast");
const {
  identifier: id,
  expressionStatement,
  memberExpression,
  assignmentExpression,
  arrowFunctionExpression,
  blockStatement,
} = recast.types.builders;

// recast.run(function(ast,printsource){
//     // 创建一个块级作用于
//     console.log('\n\nstep1:')
//     printsource(blockStatement([]))
//     //  创建一个箭头函数
//     console.log('\n\nstep2:')
//     printsource(arrowFunctionExpression([],blockStatement([])))
//     // add  赋值为() => {}
//     console.log('\n\nstep3')
//     printsource(assignmentExpression('=',id('add'),arrowFunctionExpression([],blockStatement([]))))
//      // exports.add赋值为键头函数  exports.add = ()=>{}
//     console.log('\n\nstep4:')
//     printsource(expressionStatement(assignmentExpression('=',memberExpression(id('express'),id('add')),arrowFunctionExpression([],blockStatement([])))))
// })
// recast.run(function(ast,printsource){
//     let funcIds = []
//     recast.visit(ast,{
//         visitFunctionDeclaration(path){
//             const node = path.node
//             const funcName = path.id
//             console.log(funcName)
//             const params = path.params
//             const body = path.body
//             funcIds.push(funcName)
//             const rep = expressionStatement(assignmentExpression('=',memberExpression(id('exports'),funcName),arrowFunctionExpression(params,body)))
//             path.replace(rep)
//             return false
//         }
//     })
//     recast.visit(ast,{
//         visitCallExpression(path){
//             const node = path.node
//             if(funcIds.includes(node.callee.name)){
//                 node.callee = memberExpression(id('exports',node.callee))
//             }
//             return false
//         }
//     })
//     printsource(ast)
// })
recast.run(function (ast, printSource) {
  // 用来保存遍历到的全部函数名
  let funcIds = [];
  recast.types.visit(ast, {
    // 遍历所有的函数定义
    visitFunctionDeclaration(path) {
      //获取遍历到的函数名、参数、块级域
      const node = path.node;
      const funcName = node.id;
      const params = node.params;
      const body = node.body;

      // 保存函数名
      funcIds.push(funcName.name);
      // 这是上一步推导出来的ast结构体
      const rep = expressionStatement(
        assignmentExpression(
          "=",
          memberExpression(id("exports"), funcName),
          arrowFunctionExpression(params, body)
        )
      );
      // 将原来函数的ast结构体，替换成推导ast结构体
      path.replace(rep);
      // 停止遍历
      return false;
    },
  });

  recast.types.visit(ast, {
    // 遍历所有的函数调用
    visitCallExpression(path) {
      const node = path.node;
      // 如果函数调用出现在函数定义中，则修改ast结构
      if (funcIds.includes(node.callee.name)) {
        node.callee = memberExpression(id("exports"), node.callee);
      }
      // 停止遍历
      return false;
    },
  });
  // 打印修改后的ast源码
  printSource(ast);
});
