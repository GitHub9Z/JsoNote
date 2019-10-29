<template>
  <div class="content">
    <div class="content-nav">
      <div class="content-nav-item" v-for="(value, key) in json" @click="handleNavClick(key)" :style="currentPage === key ? { border: '1px solid rgba(0, 0, 0, 0.05)', 'border-right': `2px solid ${config.color}` } : {}">
        {{key}}
      </div>
      <div class="content-nav-add">
        <img src="@/assets/add_green_icon.png" @click="handleNavAddClick">
      </div>
      <div class="content-nav-git" @click="handleNavGitClick">
        <img src="@/assets/git_red_icon.png" title="版本管理">
      </div>
      <div class="content-nav-config" @click="handleNavConfigClick">
        <img src="@/assets/config_blue_icon.png" title="全局配置">
      </div>
      <div class="content-nav-pre" @click="handleNavPreClick">
        <img src="@/assets/pre_red_icon.png" title="预览">
      </div>
    </div>
    <div class="content-tree">
      <div class="content-tree-bar" v-if="currentPage">
        <div class="content-tree-bar-back" @click="handleBackClick()" :style="{ opacity: currentFathId ? '1' : '0' }">
          <img src="@/assets/back_green_icon.png">
        </div>
        <div class="content-tree-bar-add" @click="handleAddClick()">
          添加
        </div>
      </div>
      <div class="content-tree-list" v-if="getCurrentChild && getCurrentChild.length > 0">
        <div class="content-tree-list-item" v-for="value in getCurrentChild" @dblclick="handleTreeDbClick(value)" @click="handleTreeClick(value)" :style="currentChildId === value.id ? { color: 'rgb(112, 168, 84)', 'border-right': '2px solid rgb(112, 168, 84)' } : {}">
          <div class="content-tree-list-item-shade">
            {{value.title}}
          </div>
        </div>
      </div>
      <div class="content-tree-empty" v-else-if="currentPage">
        该目录下为空，点击<strong @click="handleAddClick">添加</strong>
      </div>
      <div class="content-tree-empty" v-else>
        请选择或添加左侧类目
      </div>
    </div>
    <div class="content-editor">
      <div class="content-editor-nav" v-if="getCurrentNav && getCurrentNav.length > 0">
        <div class="content-editor-nav-item" v-for="item in getCurrentNav" @click="handleEditorNavClick(item.id)">{{item.title}} </div>
      </div>
      <div class="content-editor-title" v-if="currentChildId">
        <input type="text" v-model="getItemById(currentChildId).title">
      </div>
      <div class="content-editor-main" ref="editor" :style="{ 'opacity': currentChildId ? '1' : '0.3' }">
        <jso-note-list-item status="edit" :contentList="getItemById(currentChildId).content" :currentInput="currentInput" @activeInput="handleActiveInput" @top="handleTopClick" @bottom="handleBottomClick" @focus="handleItemFocus"></jso-note-list-item>
      </div>
      <div class="content-editor-shadow" ref="shadow" :style="{ opacity: ((isConfiging || isGitting) ? '1' : '0'),'pointer-events': ((isConfiging || isGitting) ? 'auto' : 'none') }">
      </div>
      <div class="content-editor-config" ref="config" v-if="isConfiging">
        <div class="content-editor-config-title">
          <h1>全局配置</h1>
          <strong @click="handleNavConfigSave">确认</strong>
          <div>|</div>
          <strong @click="handleNavConfigClick">关闭</strong>
        </div>
        <div class="content-editor-config-theme">
          <div class="content-editor-config-theme-title">
            <h3>网站主题</h3>
            <h5>点击去商店查看<strong>更多</strong>优质主题</h5>
          </div>
          <div class="content-editor-config-theme-bicker">
            <colorPicker v-model="color" />
          </div>
        </div>
        <div class="content-editor-config-ad">
          <div class="content-editor-config-ad-title">
            <h3>广告配置</h3>
            <h5>点击此处可为网站<strong @click="handleAdAdd">添加</strong>广告</h5>
          </div>
          <div class="content-editor-config-ad-list">
            <div class="content-editor-config-ad-list-item" v-for="(item, index) in adList">
              <j-ns-ad-card :item="item"></j-ns-ad-card>
              <div class="content-editor-config-ad-list-item-console">
                <div class="content-editor-config-ad-list-item-console-edit" @click="handleAdEdit(index)">编辑</div>
                <div class="content-editor-config-ad-list-item-console-delete" @click="handleAdDelete(index)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-editor-git" ref="git" v-if="isGitting">
        <div class="content-editor-git-title">
          <h1>版本管理</h1>
          <strong @click="handleNavGitSave">恢复到该版本</strong>
          <div>|</div>
          <strong @click="handleNavGitClick">关闭</strong>
        </div>
        <div class="content-editor-git-tree">
          <div class="content-editor-git-tree-title">
            <h3>历史版本</h3>
            <h5><strong>点击</strong>对应版本可以回退到历史版本，鼠标<strong>悬停</strong>查看版本备注</h5>
          </div>
          <div class="content-editor-git-tree-main" :style="{'background-image': `url(${require('@/assets/block_gray_icon.png')})`, 'background-color': 'black' }">
            <jso-note-editor-gitree :tree="tree" @preReset="handleGitPreReset"></jso-note-editor-gitree>
            <div class="content-editor-git-tree-main-tips">
              <div class="content-editor-git-tree-main-tips-item" v-for="item in pageConfig.tipsData">
                <div class="content-editor-git-tree-main-tips-item-color" :style="{ background: item.color }"></div>
                <div class="content-editor-git-tree-main-tips-item-label">{{item.label}}</div>
              </div>
            </div>
          </div>
        </div>
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
  import JsoNoteListItem from '../PC/JsoNoteListItem.vue'
  import JsoNoteEditorGitree from './JsoNoteEditorGitree.vue'
  
  import JNsAdCard from './static/JNsAdCard.vue'
  import {
    setTimeout
  } from 'timers';
  
  export default {
    components: {
      JsoNoteEditorGitree,
      JsoNoteListItem,
      JNsAdCard
    },
    props: ['json', 'config', 'siteInfo'],
    created() {},
    data() {
      return {
        pageConfig: {
          tipsData: [{
            color: '#409EFF',
            label: '当前版本'
          }, {
            color: '#70A854',
            label: '历史单一版本'
          }, {
            color: '#E6A23C',
            label: '历史分叉版本'
          }]
        },
        preResetLeval: null,
        isConfiging: false,
        isGitting: false,
        color: '#70A854',
        adList: [],
        currentFathId: '',
        currentChildId: '',
        currentInput: -1,
        currentPage: '',
        tree: {},
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
    watch: {
      siteInfo: {
        handler() {
          if (this.siteInfo && this.siteInfo.git_head) {
            this.adList = this.config.ads || []
            this.color = this.config.color || '#70A854'
            this.tree = {
              HEAD: this.siteInfo.git_head,
              ...JSON.parse(this.siteInfo.git_tree)
            }
          }
        }
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
        let title = prompt("请输入新建菜单名称")
        if (title) {
          this.$set(this.json, title, [])
          //this.json[title] = []
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
          updateTime: (new Date()).valueOf(),
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
          updateTime: (new Date()).valueOf(),
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
          updateTime: (new Date()).valueOf(),
          text: '请输入任意文字'
        })
        this.initId()
      },
      handleTreeClick(value) {
        this.currentChildId = value.id
        this.currentInput = -1
      },
      handleTreeDbClick(value) {
        this.currentFathId = this.currentChildId
        this.currentChildId = ''
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
      async handleGitReset() {
        await this.$axios({
          method: 'get',
          url: '/api/resetJsoNoteGitHead',
          params: {
            id: this.siteInfo.id,
            git_head: this.preResetLeval
          }
        })
      },
      handleGitPreReset(leval) {
        this.preResetLeval = leval
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
        let randomId
        let commit
        if (key === 'new') {
          key = ''
          randomId = prompt("请输入新建网站的域名")
        } else {
          commit = prompt("请输入该版本的备注，方便版本管理")
        }
        await this.$axios({
          method: 'get',
          url: '/api/jsoNoteUpload',
          params: {
            id: key || randomId,
            json: JSON.stringify({
              ...this.json,
              config: this.config
            }),
            commit
          }
        })
        window.location.href = `http://www.imgker.com/jsoNote/${key || randomId}`
      },
      handleDeleteClick() {
        if (this.currentInput + 1) {
          let isConfirm = confirm(`确认删除该段落吗?`)
          if (!isConfirm) return
          this.getItemById(this.currentChildId).content.splice(this.currentInput, 1)
          this.currentInput = -1
        } else if (this.currentChildId) {
          let isConfirm = confirm(`确认删除小节【${this.getItemById(this.currentChildId).title}】吗?`)
          if (!isConfirm) return
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
          let isConfirm = confirm(`确认删除菜单【${this.currentPage}】吗?`)
          if (!isConfirm) return
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
        this.currentInput--
          console.log('当前活跃', this.currentInput)
        this.initId()
        this.$forceUpdate()
      },
      handleBottomClick() {
        let tmp = JSON.parse(JSON.stringify(this.getItemById(this.currentChildId).content[this.currentInput]))
        this.getItemById(this.currentChildId).content.splice(this.currentInput, 1)
        this.getItemById(this.currentChildId).content.splice(this.currentInput + 1, 0, tmp)
        this.currentInput++
          console.log('当前活跃', this.currentInput)
        this.initId()
        this.$forceUpdate()
      },
      handleItemFocus(dom) {
        console.log('fuck', dom.offsetTop)
        setTimeout(() => {
          this.$refs['editor'].scrollTop = dom.offsetTop - 150
        }, 50)
      },
      handleNavPreClick() {
        this.$emit('pre')
      },
      handleNavConfigClick() {
        this.isConfiging = !this.isConfiging
      },
      handleNavConfigSave() {
        this.config.ads = this.adList
        this.config.color = this.color
        this.isConfiging = false
      },
      handleNavGitClick() {
        this.isGitting = !this.isGitting
      },
      async handleNavGitSave() {
        let isConfirm = confirm('确认更新版本将会丢失当前页面修改，是否确认？')
        if (!isConfirm) return
        this.isGitting = false
        await this.handleGitReset()
        window.location.reload()
      },
      handleAdDelete(index) {
        this.adList.splice(index, 1)
      },
      handleAdEdit(index) {
        let item = this.adList[index]
        item.title = prompt("编辑广告标题", item.title)
        item.img = prompt("编辑广告图片地址", item.img)
        item.mark = prompt("编辑广告详情", item.mark)
      },
      handleAdAdd() {
        if (this.adList.length === 2) {
          alert('暂时至多只支持2个广告位')
          return
        }
        this.adList.push({
          title: '欢迎使用广告位',
          img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1567675885942&di=72987a640a52d80008306c99ebf13b14&imgtype=0&src=http%3A%2F%2Fww1.sinaimg.cn%2Forj480%2F795bf814gw1f8o5wmxwohj20xc0dwabl.jpg',
          mark: `JsoNote提供了广告位开放接口，欢迎用户体验。`
        })
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
  strong {
    padding: 2px;
    color: rgb(112, 168, 84);
    &:hover {
      color: rgba(112, 168, 84, 0.448);
    }
  }

  .disabled {
    color: #C0C4CC ! important;
    pointer-events: none;
  }
  
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
      display: flex;
      flex-direction: column;
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
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: center;
        img {
          margin: 20px;
          height: 25px;
          width: 25px;
          &:hover {
            opacity: 0.6;
          }
        }
      }
      .content-nav-git {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        img {
          margin: 0px;
          height: 28px;
          width: 28px;
        }
        &:hover {
          opacity: 0.6;
        }
      }
      .content-nav-config {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        img {
          margin-top: 20px;
          height: 28px;
          width: 28px;
        }
        &:hover {
          opacity: 0.6;
        }
      }
      .content-nav-pre {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        img {
          margin: 20px;
          height: 28px;
          width: 28px;
        }
        &:hover {
          opacity: 0.6;
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
      .content-tree-empty {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: #C0C4CC;
        font-weight: bold;
      }
    }
    .content-editor {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
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
      .content-editor-shadow {
        z-index: 998;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        background: #30313363;
      }
      .content-editor-config {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 800px;
        height: calc(~'100% - 150px');
        border-radius: 10px;
        background: white;
        padding: 30px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .content-editor-config-title {
          display: flex;
          flex-direction: row;
          h1 {
            flex: 1;
          }
          div {
            padding: 2px 10px;
            color: rgb(172, 172, 172);
          }
        }
        .content-editor-config-theme {
          padding: 20px;
          display: flex;
          align-items: flex-start;
          h3 {
            color: #304455;
          }
          .content-editor-config-theme-title {
            width: 100px;
            padding-left: 10px;
            border-left: 4px solid rgb(112, 168, 84);
            color: #C0C4CC;
          }
          .content-editor-config-theme-bicker {
            padding: 2px 4px 0 4px;
            margin-left: 20px;
            border: solid 1px #f5f5f5;
            border-radius: 2px;
            &:hover {
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
            }
          }
        }
        .content-editor-config-ad {
          padding: 20px;
          display: flex;
          align-items: flex-start;
          h3 {
            color: #304455;
          }
          .content-editor-config-ad-title {
            padding-left: 10px;
            border-left: 4px solid rgb(112, 168, 84);
            width: 100px;
            color: #C0C4CC;
          }
          .content-editor-config-ad-list {
            display: flex;
            align-items: flex-start;
            .content-editor-config-ad-list-item {
              width: 300px;
              margin-left: 20px;
              box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
              .content-editor-config-ad-list-item-console {
                padding: 0 10px 20px 10px;
                display: flex;
                justify-content: flex-end;
                .content-editor-config-ad-list-item-console-edit {
                  margin-right: 10px;
                  color: white;
                  padding: 5px 20px;
                  background: rgb(112, 168, 84);
                }
                .content-editor-config-ad-list-item-console-delete {
                  color: white;
                  padding: 5px 20px;
                  background: #F56C6C;
                }
              }
            }
          }
        }
      }
      .content-editor-git {
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        width: 800px;
        height: calc(~'100% - 150px');
        border-radius: 10px;
        background: white;
        padding: 30px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        .content-editor-git-title {
          display: flex;
          flex-direction: row;
          h1 {
            flex: 1;
          }
          div {
            padding: 2px 10px;
            color: rgb(172, 172, 172);
          }
        }
        .content-editor-git-tree {
          padding: 20px;
          display: flex;
          align-items: flex-start;
          h3 {
            color: #304455;
          }
          .content-editor-git-tree-title {
            width: 100px;
            padding-left: 10px;
            border-left: 4px solid rgb(112, 168, 84);
            color: #C0C4CC;
          }
          .content-editor-git-tree-main {
            height: 350px;
            width: 100%;
            padding: 16px;
            margin: 0 20px;
            position: relative;
            .content-editor-git-tree-main-tips {
              display: flex;
              position: absolute;
              bottom: -40px;
              color: #C0C4CC;
              font-weight: bold;
              .content-editor-git-tree-main-tips-item {
                display: flex;
                align-items: center;
                margin: 0 20px;
                .content-editor-git-tree-main-tips-item-color {
                  height: 15px;
                  width: 15px;
                  margin: 0 10px;
                }
                .content-editor-git-tree-main-tips-item-label {}
              }
            }
          }
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
