<template>
    <div style="margin-top: 10px">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="已发送" name="post">
                <article-table state="1" />
            </el-tab-pane>
            <el-tab-pane label="草稿箱" name="draft">
                <article-table state="0" />
            </el-tab-pane>
            <el-tab-pane label="回收站" name="dustbin">
                <article-table state="2" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ArticleTable from './article/ArticleTable.vue'
export default {
    name: 'ArticleView',
    components: {
        'article-table': ArticleTable
    },
    data() {
        return {
            activeName: 'post'
        }
    }
}
</script>