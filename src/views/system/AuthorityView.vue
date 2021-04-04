<template>
    <div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px">
            <div>
                <el-input prefix-icon="el-icon-search" style="width: 350px; margin-right: 10px" />
                <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div>
                <el-button type="primary" icon="el-icon-view" @click="toShowView">查看</el-button>
                <el-button type="success" icon="el-icon-plus" @click="toAddView">添加</el-button>
                <el-button type="warning" icon="el-icon-edit" @click="toEditView">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAuthority">删除</el-button>
            </div>
        </div>
        <!--  权限列表  -->
        <div style="margin-top: 10px">
            <el-table :data="authorityList" stripe border v-loading="loading" style="width: 100%"
                row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                highlight-current-row @current-change="selectCurrentRow">
                <el-table-column type="selection" width="50" />
                <el-table-column prop="url" label="请求路径" />
                <el-table-column prop="path" label="路由地址" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="component" label="组件" />
                <el-table-column prop="iconCls" label="图标" />
                <el-table-column prop="parentId" label="父菜单" />
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enabled" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--  查看  -->
        <div>
            <el-dialog :title="title" :visible.sync="showModalVisible" width="60%">
                <el-form :model="authority" label-position="right" label-width="20%">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="url" label="请求路径">
                                <el-input v-model="authority.url" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="path" label="路由地址">
                                <el-input v-model="authority.path" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="权限名称">
                                <el-input v-model="authority.name" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="component" label="组件">
                                <el-input v-model="authority.component" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="iconCls" label="图标">
                                <el-input v-model="authority.iconCls" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parentId" label="父菜单">
                                <el-input v-model="authority.parentId" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-dialog>
        </div>
        <!--  添加/修改  -->
        <div>
            <el-dialog :title="title" :visible.sync="editModalVisible" width="60%">
                <el-form :model="authority" ref="authority" :rules="rules" label-position="right" label-width="20%">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="url" label="请求路径">
                                <el-input v-model="authority.url" placeholder="请输入请求路径"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="path" label="路由地址">
                                <el-input v-model="authority.path" placeholder="请输入路由地址"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="权限名称">
                                <el-input v-model="authority.name" placeholder="请输入权限名称"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="component" label="组件">
                                <el-input v-model="authority.component" placeholder="请输入组件"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="iconCls" label="图标">
                                <el-input v-model="authority.iconCls" placeholder="请输入图标"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="parentId" label="父菜单">
                                <el-input v-model="authority.parentId" placeholder="请输入父菜单"
                                    prefix-icon="el-icon-edit" style="width: 80%" disabled />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveAuthority">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AuthorityView',
    data() {
        return {
            loading: false,
            authorityList: [],
            title: '',
            showModalVisible: false,
            editModalVisible: false,
            authority: {
                url: '',
                path: '',
                name: '',
                component: '',
                iconCls: '',
                parentId: '',
                enabled: false
            },
            rules: {
                url: [{required: true, message: '请输入请求路径', trigger: 'blur'}],
                path: null,
                name: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
                component: null,
                iconCls: null,
                parentId: null
            }
        }
    },
    mounted() {
        this.initAuthorityList()
    },
    methods: {
        selectCurrentRow(val) {
            this.currentRow = val
        },
        initAuthorityList() {
            this.loading = true
            var url = '/system/authority/listAuthorities'
            this.getRequest(url)
            .then(resp => {
                this.loading = false
                if(resp && resp.code == 200) {
                    this.authorityList = resp.data
                    this.currentRow = null
                }
            })
        },
        emptyAuthority() {
            this.authority = {
                url: '',
                path: '',
                name: '',
                component: '',
                iconCls: '',
                parentId: 1,
                isMenu: true,
                enabled: false
            }
        },
        saveAuthority() {
            //更新权限
            if(this.authority.id) {
                this.$refs.authority.validate(valid => {
                    if(valid) {
                        let form = this.authority
                        delete form.children
                        this.putRequest('/system/authority/updateAuthority', this.authority)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initAuthorityList()
                            }
                        })
                    }
                })
            //保存权限
            } else {
                this.$refs.authority.validate(valid => {
                    if(valid) {
                        this.postRequest('/system/authority/saveAuthority', this.authority)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initAuthorityList()
                            }
                        })
                    }
                })
            }
        },
        //查看
        toShowView() {
            if (this.currentRow == null) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.title = '查看权限信息'
            this.authority = this.currentRow
            this.showModalVisible = true
        },
        //添加
        toAddView() {
            this.title = '添加权限信息'
            this.emptyAuthority()
            if (this.currentRow != null) {
                this.authority.parentId = this.currentRow.id
            }
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
            this.title = '修改权限信息'
            this.authority = this.currentRow
            this.editModalVisible = true
        },
        //删除
        deleteAuthority() {
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
                this.deleteRequest('/system/authority/deleteAuthority?id=' + this.currentRow.id)
                .then((resp) => {
                    if (resp) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.initAuthorityList()
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