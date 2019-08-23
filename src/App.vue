<template>
  <div class="content">
    <jso-note-web v-if="json" :json="json"></jso-note-web>
    <jso-note-editor v-else></jso-note-editor>
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
        json: ''
      }
    },
    methods: {},
    mounted() {
      let pathname = window.location.pathname
      let key = localStorage.getItem(pathname.split('/').join(''))
      if (key) this.json = JSON.parse(localStorage.getItem(pathname.split('/').join('')))
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
  }
  
  .content {
    padding: 0;
    margin: 0;
  }
</style>
