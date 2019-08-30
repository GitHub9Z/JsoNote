<template>
  <div class="content">
    <jso-note-web v-if="!isEdit" :json="json"></jso-note-web>
    <jso-note-editor v-else :json="json"></jso-note-editor>
  </div>
</template>

<script>
  import JsoNoteWeb from './components/JsoNoteWeb.vue'
  import JsoNoteEditor from './components/JsoNoteEditor.vue'
  
  export default {
    components: {
      JsoNoteWeb,
      JsoNoteEditor
    },
    data() {
      return {
        json: '',
        isEdit: false
      }
    },
    methods: {
      async loadHome() {
        this.json = JSON.parse((await this.$axios({
          method: 'get',
          url: '/api/getJsoNoteWeb',
          params: {
            id: '727601',
          }
        })).data.data[0].json)
      }
    },
    async mounted() {
      let pathname = window.location.pathname
      console.log('页面路径', pathname)
      let key = pathname.split('/').filter(item => item)[1]
      let mode = pathname.split('/').filter(item => item)[2]
      console.log('key', key)
      console.log('mode', mode)
      if (key) {
        let res = (await this.$axios({
          method: 'get',
          url: '/api/getJsoNoteWeb',
          params: {
            id: key,
          }
        })).data.data[0]
        this.json = res ? JSON.parse(res.json) : this.loadHome()
      } else {
        this.loadHome()
      }
      if (mode === 'edit') this.isEdit = true
      else this.isEdit = false
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
  
  * {
    user-select: none;
    padding: 0;
    margin: 0;
    transition: all 0.3s;
    word-break: break-all;
    //white-space: pre-wrap;
  }
  
  .content {
    padding: 0;
    margin: 0;
  }
</style>
