import {initState} from './observe';
import {Watcher} from './render/watcher';

function myVue (options) {
    this._init(options);
}

myVue.prototype._init = function (options) {
    let vm = this;
    vm.$options = options;
    // MVVM原理 重新初始化数据  data
    initState(vm);

    if (options.el) {
        vm.$mount();
    }
}

MyVue.prototype.$mount = function () {
    let vm = this
    let el = vm.$options.el
    el = vm.$el = query(el) //获取当前节点

    let updateComponent = () =>{
        console.log("更新和渲染的实现");
        vm._update()
    }
    new Watcher(vm,updateComponent)
}

MyVue.prototype._update = function () {
    let vm = this
    let el = vm.$el
    // 渲染所有元素 把内容替换为数据
    let node = document.createDocumentFragment()
    let firstChild
    while (firstChild = el.firstChild){
        node.appendChild(firstChild)
    }
    // 文本替换
    compiler(node,vm)

    el.appendChild(node) //替换完再放进去
}

MyVue.prototype.$watch = function (key,handler) {
    let vm = this
    new Watcher(vm,key,handler,{user:true});
    
}

export default MyVue;