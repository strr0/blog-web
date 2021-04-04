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
                <el-button type="danger" icon="el-icon-delete" @click="deleteRole">删除</el-button>
            </div>
        </div>
        <!--  角色列表  -->
        <div style="margin-top: 10px">
            <el-collapse v-model="activeName" v-loading="loading" accordion @change="handleCurrentChange">
                <el-collapse-item
                    v-for="(role, index) in roleList"
                    :title="role.description"
                    :name="role.id"
                    :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                        </div>
                        <div>
                            <el-tree
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :key="index"
                                :default-checked-keys="checkedIds"
                                :data="data"
                                :props="{ label: 'name', children: 'children' }" />
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button type="primary" @click="updateRoleAuthority(role.id, index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
        <!--  添加/修改  -->
        <div>
            <el-dialog :title="title" :visible.sync="editModalVisible" width="60%">
                <el-form :model="role" ref="role" :rules="rules" label-position="left">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="name" label="角色名称">
                                <el-input v-model="role.name" placeholder="请输入角色名称"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="description" label="角色描述">
                                <el-input v-model="role.description" placeholder="请输入角色描述"
                                    prefix-icon="el-icon-edit" style="width: 80%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editModalVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveRole">确定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RoleView',
    data() {
        return {
            //角色列表
            loading: false,
            roleList: [],
            authorityList: [],
            activeName: -1,
            //添加修改角色
            title: '',
            editModalVisible: false,
            role: {
                name: '',
                description: '',
                enabled: false
            },
            data: [],
            checkedIds: [],
            rules: {
                name: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
                description: [{required: true, message: '请输入角色描述', trigger: 'blur'}]
            }
        }
    },
    mounted() {
        this.initRoleList()
        this.initAuthorityList()
    },
    methods: {
        handleCurrentChange(rid) {
            this.data = []
            this.getRequest('/system/authority/listAidsByRid?rid=' + rid)
            .then(resp => {
                if (resp && resp.code == 200) {
                    this.data = this.authorityList
                    this.checkedIds = resp.data
                }
            })
        },
        initRoleList() {
            this.loading = true
            let url = '/system/role/listRoles'
            this.getRequest(url)
            .then(resp => {
                this.loading = false
                if(resp && resp.code == 200) {
                    this.roleList = resp.data
                }
            })
        },
        initAuthorityList() {
            this.getRequest('/system/authority/listAuthorities')
            .then(resp => {
                if(resp && resp.code == 200) {
                    this.authorityList = resp.data
                }
            })
        },
        emptyRole() {
            this.role = {
                name: '',
                description: '',
                enabled: false
            }
            this.checkedIds = []
        },
        saveRole() {
            //更新角色
            if(this.role.id) {
                this.$refs.role.validate(valid => {
                    if(valid) {
                        this.putRequest('/system/role/updateRole', this.role)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initRoleList()
                            }
                        })
                    }
                })
            //保存角色
            } else {
                this.$refs.role.validate(valid => {
                    if(valid) {
                        this.postRequest('/system/role/saveRole', this.role)
                        .then(resp => {
                            if(resp && resp.code == 200) {
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                this.editModalVisible = false
                                this.initRoleList()
                            }
                        })
                    }
                })
            }
        },
        //查看
        toShowView() {
            if (this.activeName == -1) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.$message({
                message: '吐泡泡。。。',
                type: 'info'
            })
        },
        //添加
        toAddView() {
            this.title = '添加角色信息'
            this.emptyRole()
            this.editModalVisible = true
        },
        //修改
        toEditView() {
            if (this.activeName == -1) {
                this.$message({
                    message: '请选择一项',
                    type: 'warning'
                })
                return
            }
            this.title = '修改角色信息'
            this.role.id = this.activeName
            this.editModalVisible = true
        },
        //删除
        deleteRole() {
            if (this.activeName == -1) {
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
                this.deleteRequest('/system/role/deleteRole?id=' + this.activeName)
                .then((resp) => {
                    if (resp) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.initRoleList()
                    }
                })
            }).catch(() => {
                this.$message({
                    message: '已取消',
                    type: 'info'
                })
            })
        },
        //修改权限
        updateRoleAuthority(rid, index) {
            let tree = this.$refs.tree[index]
            let halfChecked = tree.getHalfCheckedKeys()
            let checked = tree.getCheckedKeys()
            let form = {}
            form.rid = rid
            form.checkedIds = halfChecked.concat(checked)
            this.putRequest('/system/role/updateRoleAuthority', form)
            .then(resp => {
                if(resp && resp.code == 200) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    })
                    this.activeName = -1
                }
            })
        },
        //取消
        cancelUpdate() {
            this.activeName = -1
        }
    }
}
</script>