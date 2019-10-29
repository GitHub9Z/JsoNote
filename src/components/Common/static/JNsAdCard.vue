<template>
    <div class="contentXad">
        <div class="content-title">{{item.title}}</div>
        <div class="content-img" :style="{ 'background-image': `url(${item.img})` }">
        </div>
        <div class="content-mark">{{item.mark}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            item: Object
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    .contentXad {
        margin-bottom: 20px;
        background: white;
        text-align: left;
        overflow: hidden;
        margin-top: 0px;
        cursor: pointer;
        &:hover {
            margin-top: -3px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
        .content-title {
            font-size: 20px;
            font-weight: 500;
            padding: 10px;
        }
        .content-img {
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            height: 150px;
        }
        .content-mark {
            font-size: 15px;
            color: gray;
            margin: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
        }
    }
</style>
