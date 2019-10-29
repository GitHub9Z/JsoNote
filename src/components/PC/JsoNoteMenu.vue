<script>
  export default {
    components: {},
    props: {
      convertData: {
        type: Array
      },
      activeItem: {
        type: String
      }
    },
    computed: {},
    created() {},
    updated() {},
    data() {
      return {}
    },
    watch: {
      activeItem() {
        this.$refs['content'].scrollTop = this.$refs[this.activeItem].offsetTop - 28
      }
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
              'font-weight': `${700 - leval*50}`,
              'color': item.id === this.activeItem ? '#42b983' : '',
              'font-size': item.id === this.activeItem ? '18px' : ''
            },
            ref: item.id,
            domProps: {
              info: item
            },
            on: {
              click: this.handleClick
            }
          }, item.title), createElement('div', {
            class: {
              'content-item-child': true
            }
          }, this.getHtml(item.child, createElement))])
        })
        return elementTree
      },
      handleClick(e) {
        if (e.target.info.id) {
          this.$bus.$emit('test', e.target.info.id)
          this.$emit('choose', e.target.info.id)
        }
      }
    },
    render(createElement) {
      // console.log('hahah')
      console.log('为去你们', this.convertData)
      let res = this.getHtml(this.convertData, createElement)
      return createElement('div', {
        class: {
          'contentXmenu': true
        },
        ref: 'content'
      }, res)
    }
  }
</script>

<style lang="less" scoped>
  .contentXmenu {
    height: 100%;
    padding: 40px;
    font-size: 14px;
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
    .content-item {
      display: flex;
      flex-direction: column;
      .content-item-title {
        text-align: left;
        margin-bottom: 25px;
        overflow: hidden;
        text-overflow: ellipsis !important;
        white-space: nowrap;
        &::before {
          content: '-';
          padding-right: 5px;
          color: rgb(112, 168, 84);
        }
        &:hover {
          color: rgb(112, 168, 84);
        }
      }
      .content-item-child {
        margin-left: 1rem;
      }
    }
  }
</style>
