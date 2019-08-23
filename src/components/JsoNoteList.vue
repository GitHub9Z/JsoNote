<script>
  import JsoNoteListItem from './JsoNoteListItem.vue'
  export default {
    components: {
      JsoNoteListItem
    },
    props: {
      convertData: {
        type: Array
      }
    },
    computed: {},
    created() {},
    updated() {},
    data() {
      return {}
    },
    methods: {
      getHtml(tree, createElement) {
        if (!tree || (tree.length < 1)) return ''
        let elementTree = {}
  
        let leval = tree[0].id.split('-').length
        let levalClass = Object.create(null)
        levalClass[`leval-${tree[0].id.split('-').length}`] = true
  
        elementTree = tree.map((item) => {
          return createElement('div', {
            class: {
              'content-item': true,
              ...levalClass
            }
          }, [createElement('div', {
            class: {
              'content-item-title': true
            },
            style: {
              'font-size': `${36 - leval*1}px`,
              'font-weight': `${700 - leval*20}`,
              'border-left': item.hidden ? '6px solid #E6A23C' : ''
            },
            domProps: {
              info: item,
            },
            props: {},
            ref: item.id,
            on: {
              click: this.handleClick
            }
          }, item.title), createElement('jso-note-list-item', {
            class: {},
            style: {
              display: item.hidden ? 'none' : 'block'
            },
            props: {
              contentList: item.content,
              status: 'show'
            },
            on: {}
          }), createElement('div', {
            class: {
              'content-item-child': true
            },
            style: {
              display: item.hidden ? 'none' : 'block'
            }
          }, this.getHtml(item.child, createElement))])
        })
        return elementTree
      },
      handleClick(e) {
        if (!e.target.info.hidden) e.target.info.hidden = true
        else e.target.info.hidden = false
        console.log('哈哈哈哈')
        this.$forceUpdate()
      },
      async smoothSlide(last) {
        console.log('wrnm', last)
        const start = document.documentElement.scrollTop
        const step = (last - start > 0) ? Math.ceil((last - start) / 1000) : Math.floor((last - start) / 1000)
        let lastTop = document.documentElement.scrollTop
        const wait = new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 50)
        })
        if (start === last) return
        while ((document.documentElement.scrollTop < last) === (start < last)) {
          document.documentElement.scrollTop += step
          await wait
          if (document.documentElement.scrollTop === lastTop) return
          lastTop = document.documentElement.scrollTop
          //console.log(document.documentElement.scrollTop)
        }
      },
      handleScroll() {
        let scrollTop = document.documentElement.scrollTop;
        for (let key in this.$refs) {
          // 遍历大标题
          if (Object.keys(this.$refs).indexOf(key) === 0) {
            if ((this.$refs[key].offsetTop - 30) < scrollTop) {
              this.$bus.$emit('start')
            } else this.$bus.$emit('end')
          }
          if ((this.$refs[key].offsetTop - 81) < scrollTop) {
            this.$emit('choose', key)
          }
        }
      }
    },
    render(createElement) {
      // console.log('hahah')
      let res = this.getHtml(this.convertData, createElement)
      return createElement('div', {
        class: {
          'content': true
        },
      }, res)
    },
    mounted() {
      this.$bus.$on('test', e => {
        this.smoothSlide(this.$refs[e].offsetTop - 20)
      })
      window.addEventListener('scroll', this.handleScroll, true);
    }
  }
</script>

<style lang="less" scoped>
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
    .content-item {
      display: flex;
      flex-direction: column;
      background: white;
      .content-item-title {
        text-align: left;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 25px;
        border-left: 4px solid rgb(112, 168, 84);
        padding-left: 10px;
        &:hover {
          background: #F2f2f2;
          border-left: 6px solid rgb(112, 168, 84);
        }
        /*&::before {
                        content: 'ø';
                        padding-right: 5px;
                        color: rgb(112, 168, 84);
                      }*/
      }
      .content-item-child {
        margin-left: 15px;
        animation: show 1.5s ease;
      }
    }
  }
</style>
