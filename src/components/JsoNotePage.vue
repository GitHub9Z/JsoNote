<template>
  <div class="content">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
      <div class="content-main" :style="{ 'padding-left': isPC ? '' : '50px' }">
        <jso-note-list :convert-data="dataList" @choose="handleItemChoosed"></jso-note-list>
      </div>
      <div class="content-menu" v-if="isPC">
        <jso-note-menu :convert-data="dataList" :active-item="activeItem" @choose="handleItemChoosed"></jso-note-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import JsoNoteList from './JsoNoteList.vue'
  import JsoNoteMenu from './JsoNoteMenu.vue'
  
  export default {
    components: {
      JsoNoteList,
      JsoNoteMenu
    },
    props: ['dataList'],
    data() {
      return {
        isPC: false,
        activeItem: ''
      }
    },
    methods: {
      handleItemChoosed(id) {
        this.activeItem = id
      },
      initIdForList(list, fathId) {
        list.forEach((item, index) => {
          if (!fathId) item.id = index + ''
          else item.id = `${fathId}-${index}`
          if (item.child) this.initIdForList(item.child, item.id)
        })
      }
    },
    mounted() {
      this.initIdForList(this.dataList)
      this.isPC = !(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent))
      console.log(this.dataList)
    }
  }
</script>

<style lang="less" scoped>
  * {
    user-select: none;
  }
  
  .content {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    .content-main {
      padding-left: 350px;
      padding-right: 50px;
    }
    .content-menu {
      position: fixed;
      width: 220px;
      padding: 40px;
      height: calc(~'100% - 80px');
      left: 0;
      top: 0;
      background: #f4f5f5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 1px;
        /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        background: rgb(112, 168, 84);
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        background: transparent;
      }
      &::-webkit-scrollbar-thumb:window-inactive {
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        background: transparent;
      }
      &::-webkit-scrollbar-thumb:hover {
        -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        background: rgb(112, 168, 84);
      }
    }
  }
</style>
