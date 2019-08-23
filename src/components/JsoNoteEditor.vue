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
      <div class="content-editor-nav">
        <div class="content-editor-nav-item" v-for="item in getCurrentNav" @click="handleEditorNavClick(item.id)">{{item.title}} </div>
      </div>
      <div class="content-editor-title">
        <input type="text" v-model="getItemById(currentChildId).title">
      </div>
      <div class="content-editor-main">
        <jso-note-list-item status="edit" :contentList="getItemById(currentChildId).content" :currentInput="currentInput" @activeInput="handleActiveInput"></jso-note-list-item>
      </div>
    </div>
    <div class="content-tool">
      <div class="content-tool-save" @click="handleSaveClick()">保存</div>
      <div class="content-tool-item" v-for="value in toolConfig" @click="handleToolClick(value.type)">
        {{value.label}}
      </div>
    </div>
  </div>
</template>

<script>
  import JsoNoteListItem from './JsoNoteListItem.vue'
  
  export default {
    components: {
      JsoNoteListItem
    },
    props: [],
    created() {},
    data() {
      return {
        currentFathId: '',
        currentChildId: '',
        currentInput: '',
        currentPage: '主页',
        json: {
          '主页': [{
            title: '欢迎来到JsoNote.vue富文本编辑器',
            content: [{
              type: 'mark',
              text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
            }, {
              type: 'normal',
              text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
            }],
            child: [{
              title: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。',
              content: [{
                type: 'mark',
                text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
              }, {
                type: 'normal',
                text: `现在很多朋友都开始写博客了，对于技术博客而言，最好使用 MarkDown 格式来写作，因为这种格式的文档侧重于内容而不是排版，语法也很简单，到网上找找博客，很快就学会了。
                                                                              但是很多朋友都问 cd 有没有好的 md 编辑器推荐，因为网上的编辑器太多了，不知道选择哪个好点。那么今天 cd 就给大家推荐一个，可能很多朋友都在用了，这个编辑器就是：Atom。
                                                                              
                                                                              作者：程序小歌
                                                                              链接：https://www.jianshu.com/p/7529efd7b1c2
                                                                              来源：简书
                                                                              简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。`
              }, {
                type: 'code',
                text: `let leval = tree[0].id.split('-').length
                                                                              let levalClass = Object.create(null)`
              }],
              child: [{
                title: 'JsoNote 能被使用来撰写电子书，如：Gitbook。当前许多网站都广泛使用 JsoNote 来撰写帮助文档或是用于论坛上发表消息。例如：GitHub、简书、reddit、Diaspora、Stack Exchange、OpenStreetMap 、SourceForge等。',
                content: [],
                child: []
              }, {
                title: '本教程将使用 Typora 编辑器来讲解 Markdown 的语法，Typora 支持 MacOS 、Windows、Linux 平台，且包含多种主题，编辑后直接渲染出效果。',
                content: [],
                child: []
              }, {
                title: '1-1-3',
                content: [{
                  type: 'reference',
                  text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
                }]
              }]
            }, {
              title: 'JsoNote 语言在 2019 由Gker（git：GitHub9Z）创建。',
              content: [],
              child: []
            }, {
              title: '1-3',
              content: [],
              child: []
            }]
          }],
          '文档': [{
            title: '欢迎来到JsoNote.vue富文本编辑器',
            content: [{
              type: 'mark',
              text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
            }, {
              type: 'normal',
              text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
            }],
            child: [{
              title: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。',
              content: [{
                type: 'mark',
                text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
              }, {
                type: 'normal',
                text: `现在很多朋友都开始写博客了，对于技术博客而言，最好使用 MarkDown 格式来写作，因为这种格式的文档侧重于内容而不是排版，语法也很简单，到网上找找博客，很快就学会了。
                                                                              但是很多朋友都问 cd 有没有好的 md 编辑器推荐，因为网上的编辑器太多了，不知道选择哪个好点。那么今天 cd 就给大家推荐一个，可能很多朋友都在用了，这个编辑器就是：Atom。
                                                                              
                                                                              作者：程序小歌
                                                                              链接：https://www.jianshu.com/p/7529efd7b1c2
                                                                              来源：简书
                                                                              简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。`
              }, {
                type: 'code',
                text: `let leval = tree[0].id.split('-').length
                                                                              let levalClass = Object.create(null)`
              }],
              child: [{
                title: 'JsoNote 能被使用来撰写电子书，如：Gitbook。当前许多网站都广泛使用 JsoNote 来撰写帮助文档或是用于论坛上发表消息。例如：GitHub、简书、reddit、Diaspora、Stack Exchange、OpenStreetMap 、SourceForge等。',
                content: [],
                child: []
              }, {
                title: '本教程将使用 Typora 编辑器来讲解 Markdown 的语法，Typora 支持 MacOS 、Windows、Linux 平台，且包含多种主题，编辑后直接渲染出效果。',
                content: [],
                child: []
              }, {
                title: '1-1-3',
                content: [{
                  type: 'reference',
                  text: 'JsoNote 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。'
                }],
                child: []
              }]
            }, {
              title: 'JsoNote 语言在 2019 由Gker（git：GitHub9Z）创建。',
              content: [],
              child: []
            }, {
              title: '1-3',
              content: [],
              child: []
            }]
          }],
          '团队': [],
          '产品': []
        },
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
        }]
      }
    },
    computed: {
      getCurrentChild() {
        if (!this.currentFathId) return this.json[this.currentPage]
        let levals = this.currentFathId.split('-')
        let currentChild = this.json[this.currentPage]
        levals.forEach(leval => {
          currentChild = currentChild[leval].child
        })
        return currentChild
      },
      getCurrentNav() {
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
      },
      handleNavAddClick() {
        let title = prompt("请输入新建菜单名称");
        if (title) {
          this.json[title] = []
          this.initId()
          this.$forceUpdate()
        }
      },
      handleToolClick(type) {
        // 没有进入编辑状态
        if (!this.currentChildId) return
        // 没有选中的区域
        if (typeof(this.currentInput) !== 'number') {
          // 为空文档
          if (this.getItemById(this.currentChildId).content.length < 1) {
            this.getItemById(this.currentChildId).content.push({
              type,
              text: '请输入任意文字'
            })
          } else {} // 非空文档且未选中
        }
        // 正常情况 插入选中行下面
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
        }
        this.currentChildId = value.id
      },
      handleBackClick() {
        let tmp = this.currentFathId.split('-')
        if (tmp.length < 1) return
        tmp.pop()
        this.currentFathId = tmp.join('-')
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
      handleSaveClick() {
        localStorage.setItem("test", JSON.stringify(this.json))
      },
      handleActiveInput(index) {
        this.currentInput = index
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
        max-width: calc( ~'100vw - 540px');
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
        padding: 20px;
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
      .content-tool-item {
        padding: 15px 0;
        text-align: center;
        border: 1px solid white;
      }
      .content-tool-item:hover {
        background: rgba(112, 168, 84, 0.098);
      }
      .content-tool-save {
        padding: 15px 0;
        background: rgb(112, 168, 84);
        color: white;
        text-align: center;
      }
      .content-tool-save:hover {
        background: rgba(112, 168, 84, 0.749);
      }
    }
  }
</style>
