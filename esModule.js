setTimeout(()=>{
    console.log('创建');
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('点击'))
    p.onclick=()=>{
        import('./b')
        .then(()=>{
            console.log('异步加载成功');
        });
        import('./c')
    }
    document.body.appendChild(p)
})
export const aa = 55555;
export const bb = 66666;