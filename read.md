





# bundle自执行函数

#### 认识installedModules
存放整个bundle的依赖模块

> installedModules 是一个对象， moduleId为文件的路径名 ， exports作为当前这个模块导出对象
```
var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
```
<br/>


#### 认识__webpack_require__
```
	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
```
主要作用就是将模块存入到installedModules中，
<br/>


#### 自执行函数入口
```
__webpack_require__(__webpack_require__.s = "./index.js")
```
./index.js为webpack.config.js配置的entry路径， 
<br/>




#### esModule 的导出模块分两种

> export default 的导出

 ```
 __webpack_exports__["default"] = 55555;
 ```

__webpack_exports ==  module.exports,  意思就是直接将值赋值给
module.exports.default




__webpack_exports ==  module.exports == 
<br/>





> export 的导出

```
__webpack_require__.d(__webpack_exports__, 导出变量名, function() { return 导出变量名; });
const 导出变量名 = 变量值;
```
如果模块导出多个变量, 那么会相应执行多次__webpack_require__.d。
```
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
```
```
__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
```

> __webpack_require__.d

这个方法主要是将导出的变量作为__webpack_exports__的属性 ， 当变量改变Object.defineProperty对这个属性重新赋值 ， 那样__webpack_exports__的属性值就是最新值
enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。







#### __webpack_require__.r   专为es6导出模块添加esModule， 
```
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
```

>但是为什么加symbol?







#### webpack在导入es6模块与commonJS模块有区别

案例

```
/* harmony import */ var _esModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esModule */ "./esModule.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commonJS */ "./commonJS.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_commonJS__WEBPACK_IMPORTED_MODULE_1__);
```

_esModule__WEBPACK_IMPORTED_MODULE_1导出规范commonJS 

```
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
```
__webpack_require__.n  目前怎么看都是commonJS模块直接返回



#### __webpack_require__.d

```
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
```