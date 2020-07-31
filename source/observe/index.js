import {arrayMethods} from './array';

export function initState (vm) {
    let opt = vm.$options;
    if (opt.data) {
        initData(vm);
    }
    if (opt.watch){
        initWatch(vm);
    }

    if (opt.computed) {
        initComputed(vm);
    }
}

function initData (vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function'? data.call(vm): data || {};
    
    Object.keys().forEach(key => {
        proxy(vm, '_data', key);
    });

    if (Array.isArray(data)) {
        Object.setPrototypeOf(data, arrayMethods);
    } else {
        observe(data);
    }    
}


function initWatch(vm) {
    let watch = vm.$options.watch;
    for (let key in watch) {
        let handler = watch[key];
        createWatch(vm, key, handler);
    }
}
function createWatch(vm, key, handler) {
    vm.$watch(key, handler);
}


function initComputed(vm) {
    let watchers = vm._watcherComputed = Object.create(null);
    for(let key in computed){
        let userDef = computed[key];
        watchers[key] = new Watcher(vm,userDef,()=>{},{lazy:true});

        // 当用户取值的时候，我们将key定义到vm上
        Object.defineProperty(vm,key,{
            get:createComputedGetter(vm,key)
        })
    }
}

function createComputedGetter(vm,key) {
    let watcher = vm._watcherComputed[key];
    return function () {
        if (watcher) {
            if (watcher.dirty){
                // 页面取值的时候，dirty如果为true，就会调用get方法计算
                watcher.evalValue();
            }
            return watcher.value;
        }
    }
}

function proxy (vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    });
}

export function observe (data) {
    if (typeof data !== 'object' || data == null) {
        return;
    }
    return new Observe(data);
}
