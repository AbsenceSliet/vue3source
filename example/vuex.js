class Store {
    constructor(options){
        this.store = new Vuex({
            data(){
                return{
                    state:options.state
                }
            }
        })
        let getters = options.getters|| {}
        this.getters = {}
        Object.keys(getters).forEach(getterName=>{
            Object.defineProperty(this.getters,getterName,{
                get:function () {
                    return getters[getterName](this.state)
                }
            })
        })
        let mutations = options.mutations || {}
        this.mutations = {}
        Object.keys(mutations).forEach(mutationName=>{
            this.mutations[mutationName] =(arg)=>{
                mutations[mutationName](this.state,arg)
            } 
        })
        let actions = options.actions || {}
        this.actions =  {}
        Object.keys(actions).forEach(actionName=>{
            this.actions[actionName] =(arg)=>{
                mutations[actionName](this,arg)
            } 
        })
    }
    commit (name,arg){
        this.mutations[name](arg)
    }
    dispatch(name,arg){
        this.actions[name](arg)
    }
    get state(){
        return this.store.state
    }
}
let install  = function(Vue){
    Vue.mixin({
        beforeCreate(){
            if(this.$options&& this.$options.store ){
                this.$store = this.$options.store
            }else{
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}
const Vuex = {
    store:Store,
    install
}
export default Vuex