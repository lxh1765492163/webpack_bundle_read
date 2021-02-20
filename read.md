





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


> 入口文件
```
/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _esModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esModule */ "./esModule.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commonJS */ "./commonJS.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_commonJS__WEBPACK_IMPORTED_MODULE_1__);
```


#### __webpack_require__.r为当前module的导出对象添加__esModule， 
```
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
```

这个方法只有在跟入口以及esModule模块下调用 ， 如果模块为commonJS则不会调用

>但是为什么加symbol?
<br/>



##### webpack在导入es6模块与commonJS模块有区别

案例

```
/* harmony import */ var _esModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esModule */ "./esModule.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./commonJS */ "./commonJS.js");
/* harmony import */ var _commonJS__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_commonJS__WEBPACK_IMPORTED_MODULE_1__);
```

>_esModule__WEBPACK_IMPORTED_MODULE_0__为esModule导出规范
>_esModule__WEBPACK_IMPORTED_MODULE_1导出规范commonJS 

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

##### __webpack_require__.d

```
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
```




#### esModule 的导出模块分两种

> export default 的导出

 ```
 __webpack_exports__["default"] = 55555;
 ```

__webpack_exports ==  module.exports,  意思就是直接将值赋值给module.exports.default


__webpack_exports ==  module.exports == installedModules[moduleId].exports
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

这个方法主要是将导出的变量作为__webpack_exports__的一个监听属性 ， 当变量改变Object.defineProperty对这个属性重新赋值 ， 那样__webpack_exports__的属性值就是最新值
enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。

<br/>


#### commonJS 的导出
```
/***/ "./commonJS.js":
/*!*********************!*\
  !*** ./commonJS.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.aa = 5555555

/***/ }),
```

exports == installedModules[moduleId].exports, 利用形参传递对象存在引用问题直接将值赋保存







### 引入按需加载模块

> 动态引入需插件支持(网上说的)
原因：ECMAScript模块是完全静态的。你必须在编译时指明你要导入和导出的模块，并且它不能在运行时响应变化，
npm install --save-dev @babel/plugin-syntax-dynamic-import
plugins: ['@babel/plugin-syntax-dynamic-import']

>但是该项目直接使用import并没有报错
ECMAScript的提案“import()”已经进入到第三阶段了。它允许动态加载ECMAScript模块

原因：import()的支持
webpack v1：babel-plugin-dynamic-import-webpack是一个babel插件将import()转换成了require.ensure()
webpack v2：（v2.1.0-beta28及以后版本）：通过import()支持code-splitting。



> 注意如果html与打包后的模块代码不在一个文件目录下会存在报错。
访问本地的html发现在加载模块会报错， 报错原因是资源路径错误， 发现资源访问html 必须跟打包后的代码在同一个文件夹下。

esModule 中使用动态的import

```
//esModule.js
setTimeout(()=>{
    console.log('创建');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('点击'))
    p.onclick=()=>{
        import('./b')
        .then(()=>{
            console.log('异步加载成功');
        })
    }
    document.body.appendChild(p)
})
```
> 在esModule.js按需加载b,  编译后的代码为

```
/***/ "./esModule.js":
/*!*********************!*\
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "aa", function() { return aa; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bb", function() { return bb; });
setTimeout(()=>{
    console.log('创建');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('点击'))
    p.onclick=()=>{
        __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./b */ "./b.js"))
        .then(()=>{
            console.log('异步加载成功');
        })
    }
    document.body.appendChild(p)
})

/***/ }),
```

> 发现源码将import替换为了__webpack_require__.e , 而__webpack_require__.e相关的代码都是在使用了<b>按需加载后</b>， webpack多打包出来的一些代码


```
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".main.bundle.js"
/******/ 	}

/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};


/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
```




