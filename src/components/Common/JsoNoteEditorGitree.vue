<script>
    export default {
        name: 'tree',
        props: {
            tree: {
                type: Object,
                default: {}
            }
        },
        computed: {
        },
        created () {
        },
        updated() {
        },
        data() {
            return {
                tempHEAD: ''
            }
        },
        methods: {
            getItemById(id) {
                let tmp = id.split('-').filter(item => item)
                let Item = {
                    child: this.tree
                }
                for (let index in tmp) {
                    Item = Item.child[Number(tmp[index])]
                }
                return Item
            },
            getFatherById(id) {
                let tmp = id.split('-').filter(item => item)
                tmp.pop()
                let Item = {
                    child: [this.tree],
                    type: 1
                }
                for (let index in tmp) {
                    Item = Item.child[Number(tmp[index])]
                }
                return Item
            },
            getHtml(tree, createElement) {
                if (!tree) return ''
                let elementTree = {}
                elementTree = tree.map((item, index) => {
                    return createElement('div', {
                        class: {
                            'content-tree-item': true
                        }
                    }, [createElement('div', {
                        class: {
                            'content-tree-item-main': true
                        },
                        domProps: {
                            info: item,
                            title: item.commit || '此版本无备注'
                        },
                        on: {
                            click: this.handleClick
                        }
                    }, [
                        createElement('div', {
                            class: {
                                'content-tree-item-main-img': true,
                                'content-tree-item-main-img-active': item.leval === this.tempHEAD
                            },
                            domProps: {
                                info: item
                            },
                            style: {
                                background: item.child.length > 1 ? (item.leval === this.tempHEAD ? '#409EFF' : '#E6A23C') : (item.leval === this.tempHEAD ? '#409EFF' : '#70A854'),
                            }
                        })
                    ]), createElement('div', {
                        class: {
                            'content-tree-item-child': true
                        }
                    }, this.getHtml(item.child, createElement))])
                })
                let virtualTree = []
                elementTree.forEach(item => {
                    virtualTree = [...virtualTree, item]
                })
                return virtualTree
            },
            handleClick(e) {
                this.tempHEAD = e.target.info.leval
                this.$emit('preReset', e.target.info.leval)
            }
        },
        render(createElement) {
            console.log('sdad', this.tree)
            let res = this.getHtml([this.tree], createElement)
            /*
            return <div domPropsInnerHTML = {
                res
            }> </div>
            */
            /*
             return createEl
             ement('div', {
                 domProps: {
                     innerHTML: res
                 }
             })
             */
            return createElement('div', {}, res)
        },
        mounted() {
            this.tempHEAD = this.tree.HEAD
        }
    }
</script>

<style>
    * {
        padding: 0px;
    }


    .content-tree-child {
        padding: 0;
    }
    
    .content-tree-item {
        display: flex;
        flex-direction: row;
    }
    .content-tree-item-main {
        height: 14px;
        width: 14px;
        padding: 1px;
    }

    .content-tree-item-main:hover {
        height: 14px;
        width: 14px;
        padding: 1px;
        background: white;
    }
    
    
    .content-tree-item-main-img {
        height: 14px;
        width: 14px;
        margin: 0;
    }

    .content-tree-item-main-img-active {
        height: 14px;
        width: 14px;
        margin: 0;
    }
</style>
