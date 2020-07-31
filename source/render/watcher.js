import {} from '';

let id = 0
class Watcher {
    constructor(vm,exprOrFn,cb = ()=>{},opts){
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        this.cb = cb;
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        this.lazy = opts.lazy;
        this.dirty = this.lazy;
        if (typeof exprOrFn === 'function'){
            this.getter = exprOrFn
        } else {
            this.getter = function () {
                return util.getValue(vm,key);
            }
        }
        this.value = this.lazy? undefined : this.get(); //获得老值oldValue
    }
    get(){
        pushTarget(this);
        let value = this.getter();

        popTarget();
        return value;
    }

    addDep(dep) {
        if (!this.depsId.has(dep.id)) {
            this.deps.push(dep);
            this.depsId.add(dep.id);
        }
        dep.addSub(this);
    }

    update(){
        if (this.lazy) {
            this.dirty = true;
        } else {
            queueWacther(this);
        }
    }

    run() {
        let newValue = this.get();
        if (newValue !== this.value) {
            this.cb(newValue, this.value);
        }
    }

    evalValue() {
        this.value = this.get();
        this.dirty = false;
    }
}


let has = {}
let queue = []
function flushQueue() {
    console.log("执行了flushQueue");
    queue.forEach(watcher=>{
        watcher.run();
    })
    has = []
    queue = []
}
function queueWacther(watcher) {
    let id = watcher.id
    if(has[id] == null){
        has[id] = true
        queue.push(watcher)
    }
    nextTick(flushQueue);
}

let callbacks = []


function flushCallbacks() {
    callbacks.forEach(cb=>cb())
    callbacks = []
}

function nextTick(callback) {
    // push 多次更新页面?
    callbacks.push(callback);
    Promise.resolve().then(flushCallbacks);
}


export default Watcher;