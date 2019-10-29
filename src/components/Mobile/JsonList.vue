<script>
  export default {
    components: {},
    props: {
      convertData: {
        type: Object
      },
      converter: {
        type: Function
      },
      tag: {
        type: String,
        default: 'ul'
      }
    },
    computed: {
      getRealData() {
        return this.convertObjectToArray(this.convertData)
      }
    },
    created() {},
    updated() {},
    data() {
      return {}
    },
    methods: {
      convertObjectToArray(obj) {
        return Object.keys(obj).map(key => ({
          title: key,
          child: this.convertObjectToArray(obj[key])
        }))
      },
      getHtml(tree, createElement) {
        if (!tree || (tree.length < 1)) return ''
        let elementTree = {}
  
  
        elementTree = tree.map((item) => {
          return createElement('li', {
            class: {
              'content-item': true,
            }
          }, [createElement('div', {
            domProps: {
              innerHTML: this.converter(item.title)
            }
          }), createElement(this.tag, {
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
      console.log('hahah', this.getRealData)
      let res = this.getHtml(this.getRealData, createElement)
      return createElement(this.tag, {
        class: {
          'contentXlist': true
        },
      }, res)
    }
  }
</script>

<style lang="less" scoped>
  .contentXlist {
    font-size: 14px;
    padding: 0 !important;
    .content-item {
      padding: 5px 0;
      margin-left: 2rem;
    }
  }
</style>
