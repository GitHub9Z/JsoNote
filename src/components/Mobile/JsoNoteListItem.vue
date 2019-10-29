<template>
  <div class="content" ref="editor" @click="hanldeItemClick">
    <div class="content-top" v-if="status !== 'show'" :class="currentInput === -1 ? 'active' : ''" @click="handleItemFocus({}, -1)">
      <div class="content-top-main">
        温馨提示 : 选中一个模块后，点击右侧工具栏删除该模块/在模块下方插入新模块.
      </div>
    </div>
    <template v-if="contentList && contentList.length > 0">
          <div class="content-item" :ref="index + '-v'" v-for="(item, index) in contentList" :key="item.updateTime" v-if="item.text" :class="currentInput === index ? 'active' : ''" :contenteditable="status === 'show' ? 'false' : 'plaintext-only'"
            @click="handleItemFocus(item, index)">
            <div class="content-item-normal" :ref="index" v-if="item.type === 'normal'" v-html="convertToHtml(item.text)"></div>
            <div class="content-item-mark" :ref="index" v-if="item.type === 'mark'" v-html="convertToHtml(item.text)"></div>
            <div class="content-item-reference" :ref="index" v-if="item.type === 'reference'" v-html="convertToHtml(item.text)"></div>
            <div class="content-item-table" :ref="index" v-if="item.type === 'table'">
              <div class="content-item-table-head">
                <div class="content-item-table-head-column" v-for="column in getTableColumns(JSON.parse(item.text))" v-html="convertToHtml(column)"></div>
              </div>
              <div class="content-item-table-row" v-for="(innerItem, innerIndex) in JSON.parse(item.text)" :style="{background: (innerIndex%2 === 1) ? '#fafafa' : ''}" :key="innerIndex">
                <div class="content-item-table-row-column" v-for="column in getTableColumns(JSON.parse(item.text))" v-html="convertToHtml(innerItem[column] || '')"></div>
              </div>
            </div>
            <div class="content-item-list" :ref="index" v-if="item.type === 'list'">
              <json-list :convertData="JSON.parse(item.text)" :converter="convertToHtml" :tag="item.bonus"></json-list>
            </div>
            <div class="content-item-code" v-if="item.type === 'code'">
              <div v-highlight>
                <pre class="hljs javascript"><code class="javascript" :ref="index">{{item.text}}</code></pre>
              </div>
            </div>
            <div class="content-item-console" v-if="currentInput === index" :contenteditable="false">
              <div class="content-item-console-top" @click.stop="handleTopClick" v-if="index !== 0">
                <img src="@/assets/up_white_icon.png">
              </div>
              <div class="content-item-console-bottom" @click.stop="handleBottomClick" v-if="index !== (contentList.length - 1)">
                <img src="@/assets/down_white_icon.png">
              </div>
            </div>
          </div>
</template>
    <div class="content-shadowXshow" :style="{ opacity: status === 'show' && readingImg ? '1' : '0', 'pointer-events': status === 'show' && readingImg ? 'auto' : 'none' }">
      <div class="content-img" :style="{ 'background-image': 'url(' + readingImg + ')' }" @click="handleHideClick">
      </div>
    </div>
  </div>
</template>

<script>
  import JsonList from './JsonList.vue'
  export default {
    components: {
      JsonList
    },
    props: ['contentList', 'currentInput', 'status'],
    created() {},
    data() {
      return {
        readingImg: '',
      }
    },
    watch: {
      contentList: {
        handler() {
                if (this.contentList.length > 0 && !this.contentList[0].updateTime) this.contentList.forEach(item => {
        this.updateItem(item)
      })
        },
        deep: true
      }
    },
    computed: {},
    methods: {
      convertToHtml(text) {
        return this.convertToH1Html(this.convertToCodeHtml(this.convertToLinkHtml(this.convertToImgHtml(this.convertToLineHtml(this.convertToDeleteHtml(this.convertToItalicHtml(this.convertToBoldHtml(text))))))))
      },
      convertToDeleteHtml(text) {
        console.log('convertToDeleteHtml')
        let array = text.split('~~')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) html += `<s>${value}`
            else html += `</s>${value}`
          }
        })
        // console.log(html)
        return html
      },
      convertToDeleteText(html) {
        const reg = /<s>.+?<\/s>/g
        return html.replace(reg, (a, b, c) => {
          let text = a.match(/<s>(.+)<\/s>/)[1]
          return `~~${text}~~`
        })
        return html
      },
      convertToLineHtml(text) {
        console.log('convertToLineHtml')
        let array = text.split('---')
        return array.join('<line class="line" style="display: block; border-bottom: 1px solid #EBEEF5; margin: 10px 0;"></line>')
      },
      convertToLineText(html) {
        console.log('convertToLineText')
        return html.split('<line class="line" style="display: block; border-bottom: 1px solid #EBEEF5; margin: 10px 0;"></line>').join('---')
      },
      convertToLinkHtml(text) {
        const reg = /\[.+?\]\(http:\/\/.+?\)/g
        return text.replace(reg, (a, b, c) => {
          let text = a.match(/\[(.+)\]/)[1]
          let url = a.match(/\((http:\/\/.+)\)/)[1]
          // console.log('文字：', text)
          // console.log('url', url)
          return `<a href="${url}" style="color: #42b983; text-decoration:none;" target="_blank">${text}</a>`
        })
      },
      convertToLinkText(html) {
        const reg = /<a href=".+?" style="color: #42b983; text-decoration:none;" target="_blank">.+?<\/a>/g
        return html.replace(reg, (a, b, c) => {
          let url = a.match(/href="(.+)" style=/)[1]
          let text = a.match(/"_blank">(.+)<\/a>/)[1]
          return `[${text}](${url})`
        })
        return html
      },
      convertToImgHtml(text) {
        const reg = /\!.*?\[.+?\]\(.+?\)/g
        return text.replace(reg, (a, b, c) => {
          let rate = (a.match(/\!(.+)\[/) && a.match(/\!(.+)\[/).length > 1) ? a.match(/\!(.+)\[/)[1] : '100'
          let text = a.match(/\!.*?\[(.+)\]/)[1]
          let url = a.match(/\((.+)\)/)[1]
          // console.log('文字：', text)
          // console.log('url', url)
          return `<div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0 10px 0;"><img src="${url}" data-bonus="${url}" style="width: 100%"></img><div style="color: #969696; font-size: 14px; border-bottom: 1px solid #d9d9d9; padding: 5px 50px">${text}</div></div>`
        })
      },
      convertToImgText(html) {
        const reg = /<img src=".+?<\/img>/g
        return html.replace(reg, (a, b, c) => {
          let url = a.match(/src="(.+)" style=/)[1]
          let text = a.match(/>(.+)<\/a>/)[1]
          return `![${text}](${url})`
        })
        return html
      },
      convertToH1Html(text) {
        const reg = /#+?\s.+?\s/g
        return text.replace(reg, (a, b, c) => {
          let text = a.match(/#+\s(.+)\s/)[1]
          let sharp = (a.match(/(#+)\s/)[1]).length
          return `<h${sharp}>${text}</h${sharp}>`
        })
      },
      convertToH1Text(html) {
        const reg = /<h1>.+?<\/h1>/g
        return html.replace(reg, (a, b, c) => {
          let text = a.match(/<h1>(.+)<\/h1>/)[1]
          return `## ${text}\n`
        })
        return html
      },
      convertToBoldHtml(text) {
        console.log('convertToBoldHtml', text)
        let array = text.split('**')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) {
              if ((index + 1) === array.length) html += `${value}`
              else html += `<b>${value}`
            } else html += `</b>${value}`
          }
        })
        // console.log(html)
        return html
      },
      convertToBoldText(html) {
        const reg = /<b>.+?<\/b>/g
        return html.replace(reg, (a, b, c) => {
          let text = a.match(/<b>(.+)<\/b>/)[1]
          return `**${text}**`
        })
        return html
      },
      convertToCodeHtml(text) {
                console.log('convertToCodeHtml')

        let array = text.split('`')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) html += `<code style="background: #42b983; color: white; padding: 2px 10px; margin: 0 4px; font-family: 'source-code-pro';">${value}`
            else html += `</code>${value}`
          }
        })
        // console.log(html)
        return html
      },
      convertToCodeText(html) {
        const reg = /<code style="background: #42b983; color: white; padding: 2px 10px">.+?<\/code>/g
        return html.replace(reg, (a, b, c) => {
          let text = a.match(/<code style="background: #42b983; color: white; padding: 2px 10px">(.+)<\/code>/)[1]
          return `\`${text}\``
        })
        return html
      },
      convertToItalicHtml(text) {
                        console.log('convertToItalicHtml')

        let array = text.split('*')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) {
              if ((index + 1) === array.length) html += `${value}`
              else html += `<i>${value}`
            } else html += `</i>${value}`
          }
        })
        // console.log(html)
        return html
      },
      convertToItalicText(html) {
        const reg = /<i>.+?<\/i>/g
        return html.replace(reg, (a, b, c) => {
          let text = a.match(/<i>(.+)<\/i>/)[1]
          return `*${text}*`
        })
        return html
      },
      getTableColumns(list) {
        let columns = []
        list.forEach(item => {
          Object.keys(item).forEach(key => {
            if (!columns.includes(key)) columns.push(key)
          })
        })
        console.log('woqunima', columns)
        return columns
      },
      convertToText(html) {
        return this.convertToH1Text(this.convertToImgText(this.convertToCodeText(this.convertToLinkText(this.convertToLineText(this.convertToDeleteText(this.convertToItalicText(this.convertToBoldText(html))))))))
      },
      cleanText(text) {
        console.log('cleanText')
        const splitTag = [
          '<b>', '</b>',
          '<i>', '</i>',
          '<s>', '</s>',
          '<a>', '</a>',
        ]
        splitTag.forEach(item => {
          text = text.split(item).join('')
        })
        return text
      },
      handleItemBlur(item, index) {
        console.log('失去焦点', item.text)
        if (item.type === 'code') {
          // 代码块失去焦点 => 格式化JSON字符串
          item.text = this.cleanText(this.convertToText(this.$refs[index][0].innerText))
        } else if (item.type === 'table' || item.type === 'list') {
          // 表格 || 列表失去焦点 => 格式化JSON字符串
          item.text = JSON.stringify(JSON.parse(this.$refs[index][0].innerText), null, 4)
        } else {
          // 常规模块失去焦点 => 正常赋值
          item.text = this.$refs[index][0].innerHTML
        }
        // 强制刷新页面
        this.updateItem(item)
        this.$forceUpdate()
      },
      handleItemFocus(item, index, status = 'normal') {
        console.log('焦点', item.text)
        // 展示页 || 正常点击原模块 => 跳出逻辑
        if (this.status === 'show' || (status === 'normal' && this.currentInput === index)) return
        // 正常切换模块 => 触发原模块失焦
        if (this.$refs[this.currentInput] && this.currentInput !== index) {
          this.handleItemBlur(this.contentList[this.currentInput], this.currentInput)
        }
        // 正常切换模块 => 触发模块进入编辑状态
        if (index !== -1) {
          this.$emit('focus', this.$refs[index + '-v'][0])
          this.$nextTick(() => {
          this.$nextTick(() => {
            if (item.type === 'code') {} else {
              this.$refs[index][0].innerHTML = item.text + ' '
            }
          })
        })
        }
        // 正常切换模块 => 切换父组件的活跃模块标识
        this.$emit('activeInput', index)
      },
      handleHideClick() {
        this.readingImg = ''
      },
      hanldeItemClick(e) {
        this.readingImg = e.target.dataset.bonus || ''
      },
      handleTopClick() {
        this.handleItemBlur(this.contentList[this.currentInput], this.currentInput)
        setTimeout(() => {
         this.handleItemFocus(this.contentList[this.currentInput], this.currentInput, 'top')
        }, 50)
        this.$emit('top')
      },
      handleBottomClick() {
        this.handleItemBlur(this.contentList[this.currentInput], this.currentInput)
        setTimeout(() => {
          this.handleItemFocus(this.contentList[this.currentInput], this.currentInput, 'bottom')
        }, 50)
        this.$emit('bottom')
      },
      updateItem(item) {
        item.updateTime = (new Date()).valueOf()
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleHideClick, true)
    }
  }
</script>

<style lang="less" scoped>
  * {
    white-space: pre-wrap;
  }
  
  .active {
    border: 1px solid rgba(112, 168, 84, 0.5);
    padding: 10px;
  }

  pre {
    white-space: pre-wrap;
    /* css3.0 */
    white-space: -moz-pre-wrap;
    /* Firefox */
    white-space: -pre-wrap;
    /* Opera 4-6 */
    white-space: -o-pre-wrap;
    /* Opera 7 */
    word-wrap: break-word;
    /* Internet Explorer 5.5+ */
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
      max-height: 1000px;
      opacity: 1;
    }
  }
  
  @keyframes hide {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  .content {
    animation: show 1s ease;
    display: flex;
    flex-direction: column !important;
    height: calc(~'100% - 40px') !important;
    padding: 1rem !important;
    margin: 0 !important;
    .content-top {
      margin-bottom: 1rem;
      .content-top-main {
        padding: 15px;
        background: #42b983;
        color: white;
      }
    }
    .content-item {
      animation: show 1s ease;
      position: relative;
      margin-bottom: 1rem;
      text-align: left;
      .content-item-console {
        position: absolute;
        top: -1px;
        right: -17px;
        width: 16px;
        div {
          height: 16px;
          width: 16px;
          background: #42b983;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          img {
            height: 10px;
            width: 10px;
          }
        }
      }
      .content-item-normal {
        font-family: 'apple-system', 'BlinkMacSystemFont', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
        line-height: 30px;
      }
      .content-item-mark {
        padding: 10px 15px;
        background: #F2F6FC;
        border-radius: 2px;
      }
      .content-item-reference {
        padding: 10px 15px;
        background: #f7f7f7;
        border-left: 4px solid #b4b4b4;
        color: #909399;
      }
      .content-item-code {
        padding: 10px;
        background: #282828;
        border-radius: 2px;
        overflow: hidden;
        * {
          font-family: 'source-code-pro' !important;
        }
        pre {
          padding: 0;
          margin: 0;
        }
        margin-bottom: 0 !important;
      }
      .content-item-table {
        .content-item-table-head {
          display: flex;
          flex-direction: row;
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          border-top: 1px solid #ddd;
          .content-item-table-head-column {
            flex: 1;
            border-right: 1px solid #ddd;
            padding: 6px 10px;
            background: #fafafa;
          }
        }
        .content-item-table-row {
          display: flex;
          flex-direction: row;
          border-left: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
          .content-item-table-row-column {
            flex: 1;
            border-right: 1px solid #ddd;
            padding: 6px 10px;
          }
        }
      }
    }
    .content-shadowXshow {
      position: fixed;
      height: 100vh;
      width: 100vw;
      top: 0;
      left: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, .8);
      box-sizing: border-box;
      transition: opacity 0.5s;
      .content-img {
        // animation: show 0.4s ease;
        height: 100%;
        width: 100%;
        transition: opacity 0.5s;
        background-position: center center !important;
        background-size: contain !important;
        background-repeat: no-repeat !important;
        cursor: zoom-out;
      }
    }
  }
</style>
