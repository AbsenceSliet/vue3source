/*
// 简洁版
// 发布订阅模式
class Event {
    constructor(){
        this.callbacks = {}
    }
    $on(name,fn){
        if(!this.callbacks[name]){
            this.callbacks[name] =[]
        }
        this.callbacks[name].push(fn)
    }
    $emit(){
        let name = Array.prototype.shift.call(arguments)
        let cbs = this.callbacks[name]
        if(!cbs||cbs.length===0){
            return false
        }
        cbs.forEach(cb=>{
            cb.apply(this,arguments)
        })
    }
    $cancel(name){
        this.callbacks[name] = null
    }
}
let demo = new Event()
demo.$on('test', arg=> {    
    console.log('监听事件',arg)
})
demo.$emit('test', {name:'test'})
demo.$on('test1', arg=> {
    console.log('监听事件',arg)
})
demo.$emit('test1', {name:'test1'})
*/
// 精简版本
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.eventbus = factory()));
})(typeof window !== "undefined" ? window : this, function () {
  let Event = "",
    _default = "default";
  Event = function () {
    let _listen,
      _trigger,
      _remove,
      _shift = Array.prototype.shift,
      _unshift = Array.prototype.unshift,
      namespaceCache = {},
      _create,
      find,
      each = function (ary, fn) {
        let ret;
        for (let i = 0, length = ary.length; i < length; i++) {
          let n = ary[i];
          ret = fn.call(n, i, n);
        }
        return ret;
      };
    _listen = function (key, fn, cache) {
      if (!cache[key]) {
        cache[key] = [];
      }
      cache[key].push(fn);
    };
    _remove = function (key, cache, fn) {
      if (cache[key]) {
        if (fn) {
          for (let i = cache[key].length; i >= 0; i--) {
            if (cache[key][i] === fn) {
              cache[key].splice(i, 1);
            }
          }
        } else {
          cache[key] = [];
        }
      }
    };
    _trigger = function () {
      let cache = _shift.call(arguments),
        key = _shift.call(arguments),
        _self = this,
        ret,
        stack = cache[key];
      if (!stack || !stack.length) {
        return;
      }
      return each(stack, function () {
        return this.apply(_self, args);
      });
    };
    _create = function (namespaces) {
      let namespace = namespaces || _default,
        cache = {},
        offlineStack = [];
      let ret = {
        listen: function (key, fn, last) {
          _listen(key, fn, cache);
          if (offlineStack === null) {
            return;
          }
          if (last === "last") {
            offlineStack.length && offlineStack.pop()();
          } else {
            each(offlineStack, function () {
              this;
            });
          }
          offlineStack = null;
        },
        one: function (key, fn, last) {
          _remove(key, cache);
          this.listen(key, fn, last);
        },
        remove(key, fn) {
          _remove(key, cache, fn);
        },
        trigger: function () {
          let fn,
            args,
            _self = this;
          _unshift.call(arguments, cache);
          args = arguments;
          fn = function () {
            return _trigger.apply(_self, args);
          };
          if (offlineStack) {
            return offlineStack.push(fn);
          }
          return fn();
        },
      };
      return namespace
        ? namespaceCache[namespace]
          ? namespaceCache[namespace]
          : (namespaceCache[namespace] = ret)
        : ret;
    };
    return {
      create: _create,
      one: function (key, fn, last) {
        let event = this.create();
        event.one(key, fn, last);
      },
      remove: function (key, fn) {
        let event = this.create();
        event.remove(key, fn);
      },
      listen: function (key, fn, last) {
        let event = this.create();
        event.listen(key, fn, last);
      },
      trigger: function () {
        let event = this.create();
        event.trigger.apply(this, arguments);
      },
    };
  };
  return Event
});

// 两数之和 ，给定一个数组
/**
 *
 * @param {*} arr
 * @param {*} target
 * @returns []
 */
function twoSum(arr, target) {
  let hashMap = new Map(),
    ret = [];
  for (let i = 0; i < arr.length; i++) {
    if (hashMap.has(target - arr[i])) {
      ret = [...ret, ...[hashMap.get(target - arr[i]), i]];
    }
    hashMap.set(arr[i], i);
  }
  return ret;
}
let arr1 = [1, 2, 3, 4, 5, 6, 7, 8],
  target = 15;
console.log(twoSum(arr1, target), 789789);
// 链式调用
Function.prototype.excute = function(){
  let that  = this; 
  return function(){
    return that.apply(this,arguments)
  }
}

Function.prototype.before= function(fn){
  let  that  = this; 
  return  function(){
    fn.apply(this,arguments)
    return that.apply(this,arguments)
  }
}
Function.prototype.after = function(fn){
  let  that  = this; 
  return function(){
    let ret  = that.apply(this,arguments)
    fn.apply(this,arguments)
    return ret
  }
}