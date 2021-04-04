<template>
    <div>
        <div class="header">
            <el-select v-model="article.categoryId" placeholder="请选择文章栏目" style="width: 150px" >
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-input v-model="article.title" placeholder="请输入标题..." style="width: 400px; margin-left: 10px" />
            <el-tag v-for="item in article.tags" :key="item" closable :disable-transitions="false"
                @close="handleTagClose(item)"  style="margin-left: 10px">
                {{ item }}
            </el-tag>
            <el-input class="input-new-tag" v-if="tagInputVisible" v-model="tagInputValue" ref="saveTagInput" size="small"
                @keyup.enter.native="handleTagInputConfirm" @blur="handleTagInputConfirm" />
            <el-button class="button-new-tag" v-else type="primary" size="small" @click="showTagInput">+ Tag</el-button>
        </div>
        <!--  文章内容  -->
        <div class="main">
            <div>
                <mavon-editor style="height: 100%; width: 100%" ref="md" v-model="article.mdContent" />
            </div>
            <div style="display: flex; align-items: center; margin-top: 15px; justify-content: flex-end">
                <div v-if="article.id != ''">
                    <el-button>放弃修改</el-button>
                    <el-button type="primary">保存修改</el-button>
                </div>
                <div v-else>
                    <el-button>保存到草稿箱</el-button>
                    <el-button type="primary">发表文章</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//md编辑器
import { mavonEditor } from 'mavon-editor'
//md工具栏
import 'mavon-editor/dist/css/index.css'
export default {
    name: 'ArticleEdit',
    components: {
        mavonEditor
    },
    data() {
        return {
            loading: false,
            categoryList: [],
            tagInputVisible: false,
            tagInputValue: '',
            article: {
                id: '',
                title: '',
                mdContent: '',
                categoryId: '',
                tags: []
            }
        }
    },
    mounted() {
        this.initCategoryList()
        this.initArticle()
    },
    methods: {
        initCategoryList() {
            this.getRequest('/blog/category/listCategories')
            .then(resp => {
                if (resp && resp.code == 200) {
                    this.categoryList = resp.data
                }
            })
        },
        initArticle() {
            let id = this.$route.query.id
            if (id != null) {
                this.getRequest('/blog/article/' + id)
                .then(resp => {
                    if (resp && resp.code == 200) {
                        this.article = resp.data
                    }
                })
            }
        },
        //删除标签
        handleTagClose(tag) {
            this.article.tags.splice(this.article.tags.indexOf(tag), 1)
        },
        //添加标签
        handleTagInputConfirm() {
            let tagInputValue = this.tagInputValue
            if (tagInputValue) {
                this.article.tags.push(tagInputValue)
            }
            this.tagInputVisible = false
            this.tagInputValue = ''
        },
        //添加标签输入框
        showTagInput() {
            this.tagInputVisible = true
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        }
    }
}
</script>

<style>
.header {
    margin-top: 10px;
    margin-bottom: 10px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
}
.main {
    width: 100%;
    height: 450px;
    text-align: left;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>