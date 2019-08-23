<template>
  <div class="content" ref="editor" v-if="contentList && contentList.length > 0">
    <div class="content-item" v-for="(item, index) in contentList" :key="index" v-if="item.text" :style="{ border: currentInput === index ? '1px ridge rgb(112, 168, 84)' : '' }" :contenteditable="status === 'show' ? 'false' : 'plaintext-only'" @focus="handleItemFocus(item, index)" @blur="handleItemBlur(item, index)">
      <div class="content-item-normal" :ref="index" v-if="item.type === 'normal'" v-html="convertToHtml(item.text)"></div>
      <div class="content-item-mark" :ref="index" v-if="item.type === 'mark'" v-html="convertToHtml(item.text)"></div>
      <div class="content-item-reference" :ref="index" v-if="item.type === 'reference'" v-html="convertToHtml(item.text)"></div>
      <div class="content-item-table" :ref="index" v-if="item.type === 'table'">
        <div class="content-item-table-head">
          <div class="content-item-table-head-column" v-for="column in getTableColumns(item.text)">{{column}}</div>
        </div>
        <div class="content-item-table-row" v-for="(innerItem, innerIndex) in item.text" :style="{background: (innerIndex%2 === 1) ? '#F2F6FC' : ''}" :key="innerIndex">
          <div class="content-item-table-row-column" v-for="column in getTableColumns(item.text)">{{innerItem[column]}}</div>
        </div>
      </div>
      <div class="content-item-code" v-if="item.type === 'code'">
        <div v-highlight>
          <pre><code class="js" :ref="index">{{item.text}}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: ['contentList', 'currentInput', 'status'],
    created() {},
    data() {
      return {}
    },
    computed: {},
    methods: {
      convertToHtml(text) {
        return this.convertToCodeHtml(this.convertToLinkHtml(this.convertToLineHtml(this.convertToDeleteHtml(this.convertToItalicHtml(this.convertToBoldHtml(text))))))
      },
      convertToDeleteHtml(text) {
        let array = text.split('~~')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) html += `<s>${value}`
            else html += `</s>${value}`
          }
        })
        console.log(html)
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
        let array = text.split('---')
        return array.join('<line class="line" style="display: block; border-bottom: 1px solid #EBEEF5; margin: 10px 0;"></line>')
      },
      convertToLineText(html) {
        return html.split('<line class="line" style="display: block; border-bottom: 1px solid #EBEEF5; margin: 10px 0;"></line>').join('---')
      },
      convertToLinkHtml(text) {
        const reg = /\[.+?\]\(http:\/\/.+?\)/g
        return text.replace(reg, (a, b, c) => {
          let text = a.match(/\[(.+)\]/)[1]
          let url = a.match(/\((http:\/\/.+)\)/)[1]
          console.log('文字：', text)
          console.log('url', url)
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
      convertToBoldHtml(text) {
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
        console.log(html)
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
        let array = text.split('`')
        let html = ''
        array.forEach((value, index) => {
          if (index === 0) html = value
          else {
            if (index % 2 === 1) html += `<code style="background: #42b983; color: white; padding: 2px 10px">${value}`
            else html += `</code>${value}`
          }
        })
        console.log(html)
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
        console.log(html)
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
        return columns
      },
      convertToText(html) {
        return this.convertToCodeText(this.convertToLinkText(this.convertToLineText(this.convertToDeleteText(this.convertToItalicText(this.convertToBoldText(html))))))
      },
      cleanText(text) {
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
        if (item.type === 'code') {
          item.text = this.cleanText(this.convertToText(this.$refs[index][0].innerText))
          console.log('反编译后', item.text)
        } else {
          item.text = this.cleanText(this.convertToText(this.$refs[index][0].innerHTML))
          console.log('反编译后', item.text)
        }
        this.$forceUpdate()
      },
      handleItemFocus(item, index) {
        // this.currentInput = index
        if (this.status === 'show') return
        this.$emit('activeInput', index)
        if (item.type === 'code') {} else {
          this.$refs[index][0].innerHTML = item.text + ' '
        }
      }
    },
    mounted() {}
  }
</script>

<style lang="less" scoped>
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
  
  .content {
    animation: show 1.5s ease;
    display: flex;
    flex-direction: column !important;
    height: calc(~'100% - 40px') !important;
    padding: 20px !important;
    margin: 0 !important;
    .content-item {
      margin-bottom: 25px;
      text-align: left;
      padding: 10px;
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
        pre {
          padding: 0;
          margin: 0;
        }
        code {}
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
  }
</style>
