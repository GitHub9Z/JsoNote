<template>
  <div class="content">
    <div class="content-pre" v-if="!isEdit">
      <jso-note-web v-if="platform === 'PC'" :json="json" :config="config" :site="site"></jso-note-web>
      <jso-note-web-mobile v-if="platform === 'Mobile'" :json="json" :config="config" :site="site"></jso-note-web-mobile>
    </div>
    <div class="content-pre" v-else-if="isPre">
      <jso-note-web :json="json" :config="config" :site="site"></jso-note-web>
      <div class="content-pre-btn" @click="isPre = false">退出预览</div>
    </div>
    <jso-note-editor v-else :json="json" :config="config" :siteInfo="siteInfo" @pre="isPre = true"></jso-note-editor>
  </div>
</template>

<script>
  import JsoNoteWeb from './components/PC/JsoNoteWeb.vue'
  import JsoNoteWebMobile from './components/Mobile/JsoNoteWeb.vue'
  import JsoNoteEditor from './components/Common/JsoNoteEasyEditor.vue'
  import Vue from 'vue'
  
  export default {
    components: {
      JsoNoteWeb,
      JsoNoteWebMobile,
      JsoNoteEditor
    },
    data() {
      return {
        site: '',
        siteInfo: null,
        json: {},
        config: {
          color: 'red'
        },
        isEdit: false,
        isPre: false,
        platform: 'PC'
      }
    },
    methods: {
      async loadHome() {
        this.json = JSON.parse("{\"入门\":[{\"title\":\"快速开始\",\"content\":[],\"child\":[{\"title\":\"为什么要设计JsoNote？\",\"content\":[{\"type\":\"reference\",\"updateTime\":1678341794547,\"text\":\"1.无代码个人站点创建平台，降低了建立博客/文档/官网的维护成本和门槛。  \"},{\"type\":\"reference\",\"updateTime\":1678341792311,\"text\":\"2.全面支持md语法/html语法，更加灵活地编辑网站。 \"},{\"type\":\"reference\",\"updateTime\":1678341791369,\"text\":\"3.独立的域名空间和类git版本控制，区别于其他富文本编辑平台。\"}],\"child\":[],\"id\":\"0-0\"},{\"title\":\"快速入门md语法\",\"content\":[{\"type\":\"reference\",\"updateTime\":1678342361460,\"text\":\"[任意门](http://www.jianshu.com/p/36d67d7d6985)  \"}],\"child\":[],\"id\":\"0-1\"}],\"id\":\"0\"}],\"config\":{\"color\":\"#70A854\",\"ads\":[{\"title\":\"欢迎使用广告位\",\"img\":\"https://img2.baidu.com/it/u=3639016417,2133300021&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=426\",\"mark\":\"JsoNote提供了广告位开放接口，欢迎用户体验。\"}]}}")
        this.config = this.json.config || {
          color: '#70A854',
          ads: [{
            title: 'Vue.js从入门到精通',
            img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567675885942&di=72987a640a52d80008306c99ebf13b14&imgtype=0&src=http%3A%2F%2Fww1.sinaimg.cn%2Forj480%2F795bf814gw1f8o5wmxwohj20xc0dwabl.jpg',
            mark: `Vue.js 是一套构建用户界面的渐进式框架,Vue 只关注视图层， 采用自底向上增量开发的设计。`
          }, {
            title: 'MarkDown语法解析',
            img: 'http://img.9553.com/uploadfile/2018/0716/20180716025451904.jpeg',
            mark: `Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。`
          }]
        }
        delete(this.json.config)
      }
    },
    async mounted() {
      this.platform = (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) ? 'Mobile' : 'PC'
      Vue.prototype.$config = this.config
      let pathname = window.location.pathname
      let key = pathname.split('/').filter(item => item)[1]
  
      let mode = pathname.split('/').filter(item => item)[2]
      console.log(pathname, key, mode)
      if (mode === 'edit') this.isEdit = true
      else this.isEdit = false
  
      this.site = key === 'new' ? 'jsoNote' : key
      if (key) {
        let res = (await this.$axios({
          method: 'get',
          url: '/jsonote/web/find',
          params: {
            id: key,
          }
        })).data.data
        if (!res || !res.json) {
          this.loadHome()
          return
        }
        this.json = JSON.parse(res.json)
        this.siteInfo = res.site_info
        this.config = JSON.parse(JSON.stringify(this.json.config)) || {
          color: '#70A854',
          ads: [{
            title: 'Vue.js从入门到精通',
            img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567675885942&di=72987a640a52d80008306c99ebf13b14&imgtype=0&src=http%3A%2F%2Fww1.sinaimg.cn%2Forj480%2F795bf814gw1f8o5wmxwohj20xc0dwabl.jpg',
            mark: `Vue.js 是一套构建用户界面的渐进式框架,Vue 只关注视图层， 采用自底向上增量开发的设计。`
          }, {
            title: 'MarkDown语法解析',
            img: 'http://img.9553.com/uploadfile/2018/0716/20180716025451904.jpeg',
            mark: `Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。`
          }]
        }
        console.log(this.config)
        delete(this.json.config)
      } else {
        this.loadHome()
      }
      // window.history.replaceState(null, null, '欢迎来到JsoNote');
      // console.log('window.history', window.history)
    }
  }
</script>

<style lang="less">
  @font-face {
    font-family: 'Dosis'; //重命名字体名
    src: url('./assets/font/Dosis-Regular-2.ttf'); //引入字体
    font-weight: normal;
    font-style: normal;
  }
  
  @font-face {
    font-family: 'source-code-pro'; //重命名字体名
    src: url('./assets/font/SourceCodePro-Regular.ttf'); //引入字体
    font-weight: normal;
    font-style: normal;
  }
  
  * {
    user-select: none;
    padding: 0;
    margin: 0;
    transition: all 0.3s;
    word-break: break-all;
    //white-space: pre-wrap;
    font-family: 'Microsoft YaHei';
    span {
      font-family: 'source-code-pro' !important;
    }
  }
  
  body {}
  
  html {
    height: 100vh;
  }
  
  .content {
    padding: 0;
    margin: 0;
    .content-pre {
      .content-pre-btn {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        z-index: 9999;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: auto;
        padding: 10px 20px;
        background: #E6A23C;
        font-weight: bold;
        color: white;
        border-radius: 2px;
      }
    }
  }
</style>
