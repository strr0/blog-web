<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px">
            <div>
                <el-input prefix-icon="el-icon-search" style="width: 350px; margin-right: 10px" />
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div>
                <!-- <el-button type="primary" icon="el-icon-view" @click="toShowView">查看</el-button> -->
                <el-button type="success" icon="el-icon-plus" @click="toAddView">添加</el-button>
                <el-button type="warning" icon="el-icon-edit" @click="toEditView">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteCategory">删除</el-button>
            </div>
        </div>
        <!--  类别列表  -->
        <div style="margin-top: 10px">
            <el-table :data="categoryList" stripe border v-loading="loading" style="width: 100%"
                highlight-current-row @current-change="selectCurrentRow">
                <el-table-column type="selection" />
                <el-table-column prop="id" label="编号" />
                <el-table-column prop="name" label="类别名称" />
                <el-table-column prop="time" label="启用时间" />
            </el-table>
        </div>
        <!--  添加/修改  -->
        <div>
            <el-dialog :title="title" :visible.sync="editModalVisible" width="50%">
                <el-form :model="category" ref="category" :rules="rules" label-position="right" label-width="80px">
                    <el-form-item prop="username" label="类别名称">
                        <el-input type="text" v-model="category.name" placeholder="请输入类别名称"
                            prefix-icon="el-icon-edit" style="width: 80%" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveCategory">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CategoryView',
    data() {
        return {
            //文章类别列表
            loading: false,
            categoryList: [],
            title: '',
            editModalVisible: false,
            category: {
                name: ''
            },
            rules: {
                name: [{required: true, message: '请输入类别名称', trigger: 'blur'},
                    {min: 4, max: 16, message: '长度必须是4-16个字符'}
                ]
            }
        }
    },
    mounted() {
        this.initCategoryList()
    },
    methods: {
        selectCurrentRow(val) {
            this.currentRow = val
        },
        initCategoryList() {
            this.loading = true
            this.getRequest('/blog/category/listCategories')
            .then(resp => {
                this.loading = false
                if (resp && resp.code == 200) {
                    this.categoryList = resp.data
                }
            })
        },
        emptyCategory() {
            this.category = {
                name: ''
            }
        },
        saveCategory() {
            if (this.category.id) {
                this.$refs.category.validate(valid => {
                    if (valid) {
                        this.putRequest('/blog/category/updateCategory', this.category)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initCategoryList()
                            }
                        })
                    }
                })
            } else {
                this.$refs.category.validate(valid => {
                    if (valid) {
                        this.postRequest('/blog/category/saveCategory', this.category)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initCategoryList()
                            }
                        })
                    }
                })
            }
        },
        //添加
        toAddView() {
            this.title = '添加类别信息'
            this.emptyCategory()
            this.editModalVisible = true
        },
        //修改
        toEditView() {
            if (this.currentRow == null) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.title = '修改类别信息'
            this.category = this.currentRow
            this.editModalVisible = true
        },
        //删除
        deleteCategory() {
            if (this.currentRow == null) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRequest('/blog/category/deleteCategory?id=' + this.currentRow.id)
                .then((resp) => {
                    if (resp) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.initCategoryList()
                    }
                })
            }).catch(() => {
                this.$message({
                    message: '已取消',
                    type: 'info'
                })
            })
        }
    }
}
</script>