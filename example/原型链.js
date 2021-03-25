function Person(name){
    this.name = name
}
let person1  = new Person('Bob')
let person2 = new Person('Jack')
console.log(person1.__proto__===person2.__proto__)// true
console.log(person1.constructor===Person) // true
console.log(Person.prototype.constructor===Person)// true
console.log(Person.prototype===person1.__proto__)// true
console.log(Person.__proto__===Function.prototype) // true 
console.log(Function.prototype.constructor ===Function) // true
console.log(person1.__proto__.__proto__===Object.prototype)//true
console.log(Object.prototype.__proto__===null) // 最终Object的原型链指向null

// 1、谈谈对原型和原型链的理解
// JS原型是指为其他对象提供共享属性访问的对象，在创建对象时，每个对象都包含一个隐式引用指向它的原型对象或者null

// 2、原型链的作用
// 在访问一个对象的属性时，实际上是在他的原型链上查找。这个对象是原型链上的第一个元素，先检查它是否包含属性名，如果包含则返回，否则检查原型链上的第二个元素

// 3、如何实现原型继承
// 一种通过Object.create或者Object.setPrototypeOf显示继承另一个对象，将它设置为原型
// 另一种通过constructor构造函数，使用new关键字实例化

// 4、constructorB如何继承constructorA？
//  编写新的 constructor，将两个constructor通过call或apply的方式，合并他们的属性初始化，
// 取出超类和子类的原型对象， 通过Object.create/Object.setPrototypeOf(即 new 实例化)显示原型继承的方式，设置子类的原型为超类原型

let obj  = {
    a:1
}
let value ='123'
Object.defineProperty(obj,'a',{
    get:function(){
        console.log(this,5678906789)
    },
    set:function(val){
        val = value
    }
})



function* countAppleSales () {
    var saleList = [3, 7, 5];
    for (var i = 0; i < saleList.length; i++) {
      yield saleList[i];
    }
  }
let generator = countAppleSales()
console.log(generator.next())
generator.next()
generator.next()
generator.next()
