import {observe} from './index';
import { Dep } from '../dep/dep';

class Observe {
    constructor(data){ // data就是我们定义的data vm._data实例
        // 将用户的数据使用defineProperty定义
        this.walk(data)
    }
    walk(data){
        let keys = Object.keys(data)
        for (let i = 0;i<keys.length;i++){
            let key  = keys[i]; // 所有的key
            let value = data[keys[i]] //所有的value
            defineReactive(data,key,value)
        }
    }
}


function defineReactive(data, key, value) {
    observe(data); 
    let dep = new dep();
    Object.defineProperty(data, key, {
        set(newValue) {
            if (value === newValue) return;
            value = newValue;
            observe(value);

            dep.notify();
        },
        get() {
            if (Dep.target) {
                dep.depend();
            }
            return value;
        }
    })
}

export default Observe;