<template>
    <div class="contentXweb">
        <div class="content-nav">
            <div class="content-nav-logo">
                <img src="@/assets/logo.png">{{site}}
            </div>
            <div class="content-nav-title">
                <div class="content-nav-title-value" v-if="isReading">
                    <div>{{title}}</div>
                </div>
            </div>
            <div class="content-nav-item" v-for="(page, key) in json" :key="key" @click="handleNavClick(key)" @mouseenter="handleMouseEnter" @mouseleave="handleMouseOut($event, key)" :style="{ color: (key === activePage) ? config.color : '' }">
                {{key}}
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
                isReading: false
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
                dom.style['border-bottom'] = `2px solid ${this.config.color}`
            },
            handleMouseOut(e, key) {
                let dom = e.target
                if (key !== this.activePage) dom.style.color = ''
                dom.style['border-bottom'] = ''
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
            box-shadow: 0 0 1px rgba(0, 0, 0, 0.25);
            .content-nav-logo {
                font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
                -webkit-font-smoothing: antialiased;
                font-weight: 500;
                font-size: 26px;
                line-height: 35px;
                padding: 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 320px;
                min-width: 320px;
                img {
                    height: 35px;
                    width: 35px;
                    margin: 0 10px;
                }
            }
            .content-nav-title {
                flex: 1;
                font-size: 25px;
                font-weight: 600;
                color: #304455;
                div {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .content-nav-title-value {
                    animation: show 0.5s ease;
                }
            }
            .content-nav-item {
                margin-right: 40px;
                line-height: 35px;
                color: #304455;
                white-space: nowrap;
                transition: all 0s !important;
            }
        }
        .content-page {
            margin-top: 60px;
        }
    }
</style>
