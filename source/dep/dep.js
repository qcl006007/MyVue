let id = 0;

export class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];
    }

    addSub(watcher){ //订阅
        this.subs.push(watcher)
    }
    depend(){
        if (Dep.target){
            Dep.target.addDep(this);
        }
    }

    notify() {
        this.subs.forEach(watcher => {
            watcher.update();
        });
    }
}
let stack = [];
export function pushTarget(watcher) {
    Dep.target = watcher
    stack.push(watcher)
}
export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}
 