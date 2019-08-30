<template>
  <div class="content">
    <div class="content-nav">
      <div class="content-nav-item" v-for="(value, key) in json" @click="handleNavClick(key)" :style="currentPage === key ? { border: '1px solid rgba(0, 0, 0, 0.05)', 'border-right': '2px solid rgb(112, 168, 84)' } : {}">
        {{key}}
      </div>
      <div class="content-nav-add" @click="handleNavAddClick()">
        <img src="@/assets/add_green_icon.png">
      </div>
    </div>
    <div class="content-tree">
      <div class="content-tree-bar">
        <div class="content-tree-bar-back" @click="handleBackClick()">
          <img src="@/assets/back_green_icon.png">
        </div>
        <div class="content-tree-bar-add" @click="handleAddClick()">
          添加
        </div>
      </div>
      <div class="content-tree-list">
        <div class="content-tree-list-item" v-for="value in getCurrentChild" @click="handleTreeClick(value)" :style="currentChildId === value.id ? { color: 'rgb(112, 168, 84)', 'border-right': '2px solid rgb(112, 168, 84)' } : {}">
          <div class="content-tree-list-item-shade">
            {{value.title}}
          </div>
        </div>
      </div>
    </div>
    <div class="content-editor">
      <div class="content-editor-nav" v-if="getCurrentNav.length > 0">
        <div class="content-editor-nav-item" v-for="item in getCurrentNav" @click="handleEditorNavClick(item.id)">{{item.title}} </div>
      </div>
      <div class="content-editor-title" v-if="currentChildId">
        <input type="text" v-model="getItemById(currentChildId).title">
      </div>
      <div class="content-editor-main">
        <jso-note-list-item status="edit" :contentList="getItemById(currentChildId).content" :currentInput="currentInput" @activeInput="handleActiveInput" @top="handleTopClick" @bottom="handleBottomClick"></jso-note-list-item>
      </div>
    </div>
    <div class="content-tool">
      <div class="content-tool-save" @click="handleSaveClick()">保存</div>
      <div class="content-tool-item" v-for="value in toolConfig" @click="handleToolClick(value)" v-if="currentChildId">
        {{value.label}}
      </div>
      <div class="content-tool-delete" @click="handleDeleteClick()" v-if="typeof(currentInput) === 'number'">删除</div>
    </div>
  </div>
</template>

<script>
  import JsoNoteListItem from './JsoNoteListItem.vue'
  
  export default {
    components: {
      JsoNoteListItem
    },
    props: ['json'],
    created() {},
    data() {
      return {
        currentFathId: '',
        currentChildId: '',
        currentInput: -1,
        currentPage: '主页',
        toolConfig: [{
          label: '常规',
          type: 'normal'
        }, {
          label: '备注',
          type: 'mark'
        }, {
          label: '引用',
          type: 'reference'
        }, {
          label: '代码',
          type: 'code'
        }, {
          label: '表格',
          type: 'table'
        }, {
          label: '无序',
          type: 'list',
          bonus: 'ul'
        }, {
          label: '有序',
          type: 'list',
          bonus: 'ol'
        }]
      }
    },
    computed: {
      getCurrentChild() {
        if (!this.currentPage) return []
        if (!this.currentFathId) return this.json[this.currentPage]
        let levals = this.currentFathId.split('-')
        let currentChild = this.json[this.currentPage]
        levals.forEach(leval => {
          currentChild = currentChild[leval].child
        })
        return currentChild
      },
      getCurrentNav() {
        if (!this.currentPage) return []
        if (!this.currentFathId) return [{
          id: '',
          title: this.currentPage,
          child: this.json[this.currentPage]
        }]
        let levals = this.currentFathId.split('-')
        let currentChild = {
          id: '',
          title: this.currentPage,
          child: this.json[this.currentPage]
        }
        let NavList = []
        levals.forEach(leval => {
          NavList.push(currentChild)
          currentChild = currentChild.child[leval]
        })
        NavList.push(currentChild)
        console.log('kkk', NavList)
        return NavList
      }
    },
    methods: {
      handleNavClick(key) {
        this.currentPage = key
        this.currentChildId = ''
        this.currentFathId = ''
        this.currentInput = -1
      },
      handleNavAddClick() {
        let title = prompt("请输入新建菜单名称");
        if (title) {
          this.json[title] = []
          this.initId()
          this.$forceUpdate()
        }
      },
      handleToolClick({
        type,
        bonus
      }) {
        // 没有进入编辑状态
        if (!this.currentChildId) return
        // 正常情况 插入选中行下面
        if (type === 'table') this.getItemById(this.currentChildId).content.splice((this.currentInput + 1), 0, {
          type,
          text: JSON.stringify([{
            '字段1': 'fuck',
            '字段2': 'fuck',
            '字段3': 'fuck'
          }, {
            '字段1': 'fuck',
            '字段2': 'fuck',
            '字段3': 'fuck'
          }, {
            '字段1': 'fuck',
            '字段2': 'fuck',
            '字段3': 'fuck'
          }, {
            '字段1': 'fuck',
            '字段2': 'fuck',
            '字段3': 'fuck'
          }], null, 4)
        })
        else if (type === 'list') this.getItemById(this.currentChildId).content.splice((this.currentInput + 1), 0, {
          type,
          bonus,
          text: JSON.stringify({
            'list1': {
              'list1-1': {},
              'list1-2': {},
              'list1-3': {
                'list1-3-1': {},
                'list1-3-1': {}
              }
            }
          }, null, 4)
        })
        else this.getItemById(this.currentChildId).content.splice((this.currentInput + 1), 0, {
          type,
          text: '请输入任意文字'
        })
        this.initId()
      },
      handleTreeClick(value) {
        if (this.currentChildId === value.id) {
          this.currentFathId = this.currentChildId
          this.currentChildId = ''
        } else {
          this.currentChildId = value.id
        }
        this.currentInput = -1
      },
      handleBackClick() {
        let tmp = this.currentFathId.split('-')
        if (tmp.length < 1) return
        tmp.pop()
        this.currentFathId = tmp.join('-')
        this.currentChildId = ''
      },
      handleEditorNavClick(id) {
        this.currentFathId = id
      },
      handleAddClick() {
        if (this.currentFathId) {
          this.getItemById(this.currentFathId).child.push({
            title: `新建章节${this.getCurrentTime()}`,
            content: [],
            child: []
          })
        } else this.json[this.currentPage].push({
          title: `新建章节 ${this.getCurrentTime()}`,
          content: [],
          child: []
        })
        this.initId()
        this.$forceUpdate()
      },
      async handleSaveClick() {
        // localStorage.setItem("test", JSON.stringify(this.json))
        let pathname = window.location.pathname
        let key = pathname.split('/').filter(item => item)[1]
        if (key === 'new') key = ''
        let randomId = Math.round(Math.random()*1000000)
        await this.$axios({
          method: 'get',
          url: '/api/jsoNoteUpload',
          params: {
            id: key || randomId,
            json: JSON.stringify(this.json)
          }
        })
        window.location.href = `http://www.imgker.com/jsoNote/${key || randomId}`
      },
      handleDeleteClick() {
        if (this.currentInput + 1) {
          this.getItemById(this.currentChildId).content.splice(this.currentInput, 1)
          this.currentInput = -1
        } else if (this.currentChildId) {
          if (this.currentChildId.split('-').length > 1) {
            let index = Number(this.currentChildId.split('-').pop())
            this.getItemById(this.currentFathId).child.splice(index, 1)
          } else {
            let index = Number(this.currentChildId.split('-').pop())
            this.json[this.currentPage].splice(index, 1)
          }
          this.currentChildId = ''
          this.currentInput = -1
        } else if (this.currentPage) {
          delete(this.json[this.currentPage])
          this.currentFathId = ''
          this.currentChildId = ''
          this.currentInput = -1
          this.currentPage = ''
        }
        this.initId()
        this.$forceUpdate()
      },
      handleActiveInput(index) {
        this.currentInput = index
      },
      handleTopClick() {
        let tmp = JSON.parse(JSON.stringify(this.getItemById(this.currentChildId).content[this.currentInput]))
        this.getItemById(this.currentChildId).content.splice(this.currentInput, 1)
        this.getItemById(this.currentChildId).content.splice((this.currentInput - 1), 0, tmp)
        this.currentInput --
        console.log('当前活跃', this.currentInput)
        this.initId()
        this.$forceUpdate()
      },
      handleBottomClick() {
        let tmp = JSON.parse(JSON.stringify(this.getItemById(this.currentChildId).content[this.currentInput]))
        this.getItemById(this.currentChildId).content.splice(this.currentInput, 1)
        this.getItemById(this.currentChildId).content.splice(this.currentInput + 1, 0, tmp)
        this.currentInput ++
        console.log('当前活跃', this.currentInput)
        this.initId()
        this.$forceUpdate()
      },
      getCurrentTime() {
        return new Date().toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
      },
      getItemById(id) {
        if (!id) return {}
        let levals = id.split('-')
        let item = {
          child: this.json[this.currentPage]
        }
        levals.forEach(leval => {
          item = item.child[leval]
        })
        return item
      },
      initIdForList(list, fathId) {
        list.forEach((item, index) => {
          if (!fathId) item.id = index + ''
          else item.id = `${fathId}-${index}`
          if (item.child && item.child.length) this.initIdForList(item.child, item.id)
        })
      },
      initId() {
        for (let key in this.json) {
          this.initIdForList(this.json[key])
        }
      }
    },
    mounted() {
      this.initId()
    }
  }
</script>

<style lang="less" scoped>
  [contenteditable]:focus {
    outline: none;
  }
  
  @keyframes show {
    0% {
      max-height: 0;
      opacity: 0;
    }
    100% {
      max-height: 300px;
      opacity: 1;
    }
  }
  
  .content {
    height: 100vh;
    display: flex;
    flex-direction: row;
    color: #304455;
    .content-nav {
      width: 100px;
      min-width: 100px;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      .content-nav-item {
        padding: 15px 0;
        text-align: center;
        border: 1px solid white;
        transition: all 0s ease 0s;
      }
      .content-nav-item:hover {
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-right: 2px solid rgb(112, 168, 84);
      }
      .content-nav-add {
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        &:hover {
          opacity: 0.6;
          img {
            height: 28px;
            width: 28px;
          }
        }
        img {
          height: 25px;
          width: 25px;
        }
      }
    }
    .content-tree {
      width: 300px;
      min-width: 300px;
      overflow: auto;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      background: #F2F6FC;
      display: flex;
      flex-direction: column;
      .content-tree-bar {
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background: white;
        // border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0px 0px 10px 0px rgba(17, 127, 225, 0.2);
        z-index: 99;
        .content-tree-bar-back {
          height: 100%;
          width: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          img {
            height: 20px;
            width: 20px;
          }
        }
        .content-tree-bar-back:hover {
          background: #F2F6FC;
        }
        .content-tree-bar-add {
          padding: 20px;
          color: #303133;
        }
        .content-tree-bar-add:hover {
          color: rgb(112, 168, 84);
        }
      }
      .content-tree-list {
        flex: 1;
        overflow: auto;
        .content-tree-list-item {
          background: white;
          color: #606266;
          padding: 15px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          min-height: 50px;
          animation: show 0.5s ease;
          .content-tree-list-item-shade {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; //控制行数
            overflow: hidden;
          }
          &:hover {
            background: rgba(255, 255, 255, 0.5);
            border-right: 2px solid rgb(112, 168, 84);
          }
        }
      }
    }
    .content-editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content-editor-nav {
        padding: 9px 20px;
        display: flex;
        flex-direction: row;
        //border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0px 0px 10px 0px rgba(17, 127, 225, 0.2);
        //max-width: calc( ~'100vw - 540px');
        overflow: auto;
        .content-editor-nav-item {
          max-width: 100px;
          padding: 0 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-left: 4px solid rgb(112, 168, 84);
          &:hover {
            background: rgba(112, 168, 84, 0.116);
            color: rgb(112, 168, 84);
          }
        }
      }
      .content-editor-title {
        padding: 22.5px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        input {
          color: #303133;
          width: 100%;
          background: none;
          outline: none;
          border: none;
          font-size: 30px;
          font-weight: 600;
        }
      }
      .content-editor-main {
        flex: 1;
        overflow: auto;
        max-width: calc( ~'100vw - 540px');
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
    .content-tool {
      width: 100px;
      min-width: 100px;
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      animation: show 0.5s ease;
      .content-tool-item {
        transition: all 0.3s;
        padding: 15px 0;
        text-align: center;
        border: 1px solid white;
      }
      .content-tool-item:hover {
        background: rgba(112, 168, 84, 0.098);
      }
      .content-tool-save {
        transition: all 0.3s;
        padding: 15px 0;
        background: rgb(112, 168, 84);
        color: white;
        text-align: center;
        &:hover {
          background: rgba(112, 168, 84, 0.749);
        }
      }
      .content-tool-delete {
        animation: show 0.5s ease;
        padding: 15px 0;
        background: #F56C6C;
        color: white;
        text-align: center;
        &:hover {
          background: rgba(245, 108, 108, 0.598);
        }
      }
    }
  }
</style>
