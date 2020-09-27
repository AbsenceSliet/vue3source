const native = {};
const person = {
  like: "vuejs",
};
const proxya = new Proxy(person, {
  get: function (target, propKey) {
    console.log(target, propKey);
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError('Prop name "' + propKey + '" does not exist.');
    }
  },
});
const { proxy, revoke } = Proxy.revocable({ name: "vue.js" }, {});
console.log(proxy.name); // vue.js
revoke();
// console.log(proxy.name); //proxy.js:18 Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked

// console.log(proxya.like);

//  对某个对象进行检测赋值

const target = {
  _id: "1024",
  name: "vuejs",
};
const validators = {
  _id(val) {
    return typeof val === "number" && val > 1024;
  },
  name(val) {
    return typeof val === "string";
  },
};
const createValidator = (target, validator) => {
  return new Proxy(target, {
    _validator: validator,
    set(target, propKey, value, proxy) {
      console.log(target, propKey, value, proxy);
      const isValidator = this._validator[propKey](value);
      if (isValidator) {
        return Reflect.set(target, propKey, value, proxy);
      } else {
        throw Error(`Cannot set ${propKey} to ${value}. Invalid type.`);
      }
    },
  });
};

const validatorProxy = createValidator(target, validators);
// console.log((validatorProxy._id = "67890"));   Cannot set _id to 67890. Invalid type.
validatorProxy._id = 12034;
console.log(validatorProxy, "validatorProxy");

// 数组更新变化 不影响试图 原因

console.log(Object.keys([1, 2, 3, 45, 6]));

function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get: function defineGet() {
      console.log(`get key: ${key} val: ${val}`);
      return val;
    },
    set: function defineSet(newVal) {
      console.log(`set key: ${key} val: ${newVal}`);
      val = newVal;
    },
  });
}

function observe(data) {
  Object.keys(data).forEach(function (key) {
    defineReactive(data, key, data[key]);
  });
}
let test = [1, 2, 3];

observe(test);

test[0] = 4;
console.log(test);

console.log(
  new Map([
    ["name", "vue3js.cn"],
    ["age", "18"],
  ])
);
const map = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
console.log([...map]); // [[1, 1], [2, 2], [3, 3]]

// Array.from()
const map1 = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
console.log(Array.from(map1));
const map2 = new Map([
  [1, 1],
  [2, 2],
  [3, 3],
]);
console.log(map2);
export { native, proxya };
