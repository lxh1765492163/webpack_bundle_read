import {aa as esModule} from './esModule';
import commonJS from './commonJS';
import ReactDOM from 'react-dom'
import React from 'react'
// import Home from './home';


window.onload=()=>{
//     const B = require.ensure([], () => {require("./home"), 'home'});
// console.log(B);
    import(/* webpackChunkName: "group-confirm" */'./home')
    .then((Home)=>{
        console.log(Home,'home');
        ReactDOM.render(
        <>
            <Home.default/>
        </>, document.getElementById("root"));
    })
}


