<template>
  <div>
    <div class="contentXPage" v-if="isInit">
      <div class="content-main">
        <jso-note-list :convert-data="dataList" :config="config" @choose="handleItemChoosed" @deep="handleDeepRead" @light="handleLightRead"></jso-note-list>
      </div>
      <div class="content-float">
        <div class="content-float-item" @click="handleTopClick">
          <img src="@/assets/top_gray_icon.png">
        </div>
        <div class="content-float-edit"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import JsoNoteList from './JsoNoteList.vue'

  
  export default {
    components: {
      JsoNoteList
    },
    props: ['dataList', 'config'],
    data() {
      return {
        isDeep: false,
        isPC: false,
        isSimple: false,
        activeItem: '',
        isInit: false,
        adList: []
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
      },
      handleDeepRead() {
        this.isDeep = true
      },
      handleLightRead() {
        this.isDeep = false
      }
    },
    mounted() {
      this.initIdForList(this.dataList)
      this.isInit = true
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
  
  .contentXPage {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    flex-direction: row;
    .content-main {
      width: 100vw;
      padding: 2rem;
      transition: padding 0s ease 0s;
      background: white;
    }
    .content-float {
      position: fixed;
      right: 30px;
      z-index: 999;
      height: 90%;
      top: 0;
      bottom: 0;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
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
      }
    }
    .content-menu {
      animation: show 0.5s ease;
      //position: fixed;
      width: 300px;
      min-width: 300px;
      min-height: calc(~'100vh - 60px');
      left: 0;
      bottom: 0;
      background: #f4f5f5;
      display: flex;
      flex-direction: column;
      .content-menu-ad {
        margin: 20px;
      }
    }
    .deep {
      position: fixed;
      height: calc(~'100vh - 60px');
    }
  }
</style>
