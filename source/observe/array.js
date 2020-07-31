import {observe} from "./index";

let oldArrayPrototypeMethods = Array.prototype;
// 复制一份 然后改成新的
export let arrayMethods = Object.create(oldArrayPrototypeMethods)

// 修改的方法
let methods = ['push','shift','unshift','pop','reverse','sort','splice']

arrayMethods.forEach(method => {
    arrayMethods[method] = function(...arg) {
        let res = oldArrayPrototypeMethods[method].apply(this,arg);
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = arg
                break
            case 'splice':
                inserted = arg.slice(2)
                break
            default:
                break
        }
        if (inserted){
            observerArray(inserted);
        }
        return res;
    };
});



export function observerArray(inserted){
    // 循环监听每一个新增的属性
    for(let i =0;i<inserted.length;i++){
        observe(inserted[i])
    }
}