<template>
    <div class="contentXweb">
        <div class="content-nav">
            <div class="content-nav-logo">
                <img src="../assets/logo.png">JsoNote
            </div>
            <div class="content-nav-title">
                <div class="content-nav-title-value" v-if="isReading">
                    <div>{{json[activePage][0].title}}</div>
                </div>
            </div>
            <div class="content-nav-item" v-for="(page, key) in json" :key="key" @click="handleNavClick(key)" :style="{ color: (key === activePage) ? 'rgb(112, 168, 84)' : '' }">
                {{key}}
            </div>
        </div>
        <div class="content-page">
            <div v-for="(page, key) in json" :key="page" v-if="key === activePage">
                <jso-note-page :dataList="page"></jso-note-page>
            </div>
        </div>
    </div>
</template>

<script>
    import JsoNotePage from './JsoNotePage.vue'
    
    export default {
        props: ['json'],
        components: {
            JsoNotePage
        },
        data() {
            return {
                activePage: '',
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
            },
            handleReading() {
                this.isReading = true
            },
            handleDisReading() {
                this.isReading = false
            },
            convertToArray(arr) {
                return Array.isArray(arr) ? arr.map(item => this.convertToArray(item)) : item
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

<style lang="less">
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
            .content-nav-item:hover {
                border-bottom: 2px solid rgb(112, 168, 84);
                color: rgb(112, 168, 84);
            }
        }
        .content-page {
            margin-top: 60px;
        }
    }
</style>
