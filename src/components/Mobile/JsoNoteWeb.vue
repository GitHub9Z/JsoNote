<template>
    <div class="contentXweb">
        <div class="content-nav">
            <div class="content-nav-logo" v-if="!isReading">
                {{site}}
            </div>
            <div class="content-nav-title">
                <div class="content-nav-title-value" v-if="isReading">
                    <div>{{title}}</div>
                </div>
            </div>
            <div class="content-nav-btn">
                <img src="@/assets/menu_black_icon.png" @click="handleMenuClick">
            </div>
            <div class="content-nav-list" v-if="pageStatus.isMenuOpen">
                <div class="content-nav-list-item" v-for="(page, key) in json" :key="key" @click="handleNavClick(key)" @mouseenter="handleMouseEnter" @mouseleave="handleMouseOut($event, key)" :style="{ color: (key === activePage) ? config.color : '' }">
                    {{key}}
                </div>
            </div>
        </div>
        <div class="content-page">
            <div v-for="(page, key) in json" :key="page" v-if="key === activePage">
                <jso-note-page :dataList="page" :config="config"></jso-note-page>
            </div>
        </div>
    </div>
</template>

<script>
    import JsoNotePage from './JsoNotePage.vue'
    
    export default {
        props: ['site', 'json', 'config'],
        components: {
            JsoNotePage
        },
        data() {
            return {
                activePage: '',
                title: '',
                isReading: false,
                pageStatus: {
                    isMenuOpen: false
                }
            }
        },
        watch: {
            json() {
                if (!this.activePage) this.activePage = Object.keys(this.json)[0]
            }
        },
        methods: {
            handleNavClick(key) {
                this.activePage = key
                this.title = ''
                window.scrollTo({
                    top: 0
                })
                this.pageStatus.isMenuOpen = false
            },
            handleReading(title) {
                this.isReading = true
                this.title = title
            },
            handleDisReading() {
                this.isReading = false
            },
            convertToArray(arr) {
                return Array.isArray(arr) ? arr.map(item => this.convertToArray(item)) : item
            },
            handleMouseEnter(e) {
                let dom = e.target
                dom.style.color = this.config.color
                dom.style['border-left'] = `4px solid ${this.config.color}`
            },
            handleMouseOut(e, key) {
                let dom = e.target
                if (key !== this.activePage) dom.style.color = ''
                dom.style['border-left'] = ''
            },
            handleMenuClick() {
                this.pageStatus.isMenuOpen = !this.pageStatus.isMenuOpen
            }
        },
        mounted() {
            this.activePage = Object.keys(this.json)[0]
            console.log('当前页面', this.activePage)
            this.$bus.$on('start', this.handleReading)
            this.$bus.$on('end', this.handleDisReading)
        }
    }
</script>

<style lang="less" scoped>
    * {
        user-select: none;
    }
    
    @keyframes show {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    
    .contentXweb {
        img {
            cursor: zoom-in;
        }
        .content-nav {
            font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
            position: fixed;
            top: 0;
            left: 0;
            height: 60px;
            width: 100vw;
            max-width: 100vw;
            display: flex;
            flex-direction: row;
            align-items: center;
            background: white;
            z-index: 99;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
            .content-nav-logo {
                font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                white-space: nowrap;
                font-weight: 500;
                font-size: 26px;
                line-height: 35px;
                padding: 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
                img {
                    height: 35px;
                    width: 35px;
                    margin: 0 10px;
                }
            }
            .content-nav-title {
                font-size: 18px;
                font-weight: 600;
                color: #304455;
                padding: 20px;
                div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .content-nav-title-value {
                    width: 75vw;
                    animation: show 0.5s ease;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }
            .content-nav-btn {
                flex: 1;
                img {
                    float: right;
                    height: 30px;
                    width: 30px;
                    padding: 10px;
                }
            }
            .content-nav-list {
                width: 100%;
                position: absolute;
                top: 63px;
                animation: show 0.5s ease;
                .content-nav-list-item {
                    padding: 0 20px;
                    width: 100%;
                    background: white;
                    line-height: 35px;
                    color: #304455;
                    white-space: nowrap;
                    transition: all 0s !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                }
            }
        }
        .content-page {
            margin-top: 60px;
        }
    }
</style>
