<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px">
            <div>
                <el-input prefix-icon="el-icon-search" style="width: 350px; margin-right: 10px"
                    v-model="keywords" />
                <el-button type="primary" icon="el-icon-search" @click="initArticleList">搜索</el-button>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-view">查看</el-button>
                <el-button type="success" icon="el-icon-plus">添加</el-button>
                <el-button type="warning" icon="el-icon-edit" @click="toEditView">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </div>
        </div>
        <!--  文章列表  -->
        <div style="margin-top: 10px">
            <el-table :data="articleList" stripe border v-loading="loading" style="width: 100%"
                highlight-current-row @current-change="selectCurrentRow">
                <el-table-column type="selection" />
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="editTime" label="最近编辑时间" />
                <el-table-column prop="nickname" label="作者" />
                <el-table-column prop="categoryName" label="所属类别" />
            </el-table>
            <el-pagination background
                @current-change="pageChange"
                layout="prev, pager, next, total"
                :total="total" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleTable',
    data() {
        return {
            loading: false,
            page: 0,
            size: 10,
            total: 0,
            keywords: '',
            articleList: []
        }
    },
    props: ['state'],
    mounted() {
        this.initArticleList()
    },
    methods: {
        selectCurrentRow(val) {
            this.currentRow = val
        },
        pageChange(page) {
            this.page = page - 1
            this.initArticleList();
        },
        initArticleList() {
            this.loading = true
            let url = '/blog/article/listArticlesByPage?state=' + this.state + '&page=' + this.page + '&size=' + this.size
            if (this.keywords != '') {
                url = url + '&title=' + this.keywords
            }
            this.getRequest(url)
            .then(resp => {
                this.loading = false
                if(resp && resp.code == 200) {
                    this.articleList = resp.data.content
                    this.total = resp.data.total
                }
            })
        },
        toEditView() {
            if (this.currentRow == null) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.$router.push({path: '/articleEdit', query: {id: this.currentRow.id}})
        }
    }
}
</script>