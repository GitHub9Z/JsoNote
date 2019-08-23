import Vue from 'vue'
import App from './App.vue'
import vueHljs from "vue-hljs";
//if you want to use default color, import this css file
import "vue-hljs/dist/vue-hljs.min.css";
Vue.use(vueHljs)

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
}).$mount('#app')
