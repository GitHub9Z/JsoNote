<template>
  <div class="content">
    <img alt="Vue logo" src="../assets/logo.png">
    <div>
      <div class="content-main" :style="{ 'padding-left': isPC ? '' : '2rem', 'padding': isSimple ? '0 350px' : '' }">
        <jso-note-list :convert-data="dataList" @choose="handleItemChoosed"></jso-note-list>
      </div>
      <div class="content-menu" v-if="isPC && !isSimple">
        <jso-note-menu :convert-data="dataList" :active-item="activeItem" @choose="handleItemChoosed"></jso-note-menu>
      </div>
      <div class="content-float">
        <div class="content-float-item" @click="handleTopClick">
          <img src="@/assets/top_gray_icon.png">
        </div>
        <div class="content-float-item" @click="handleSimpleClick">
          <img src="@/assets/change_gray_icon.png">
        </div>
        <div class="content-float-edit"></div>
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
        isSimple: false,
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
      },
      handleTopClick() {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      },
      handleSimpleClick() {
        this.isSimple = !this.isSimple
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
    @keyframes show {
    0% {
      width: 0px;
      opacity: 0;
    }
    100% {
      width: 220px;
      opacity: 1;
    }
  }
  
  .content {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    .content-main {
      padding-left: 350px;
      padding-right: 2rem;
    }
    .content-float {
      position: fixed;
      right: 30px;
      z-index: 999;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .content-float-item {
        height: 50px;
        width: 50px;
        background: rgba(255, 255, 255, 0.63);
        border: 1px solid rgba(0, 0, 0, 0.068);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        img {
          height: 25px;
          width: 25px;
        }
        &:hover {
          background: rgba(0, 0, 0, 0.05);
        }
      }
    }
    .content-menu {
      animation: show 0.5s ease;
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
