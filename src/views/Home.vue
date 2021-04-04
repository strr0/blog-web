<template>
    <!-- el-container子元素中包含el-header或el-footer时, 全部子元素会垂直上下排列, 否则会水平左右排列。 -->
    <!-- 最外层容器, 包含一个顶栏和内部容器（上下） -->
    <el-container class="home_container">
        <el-header>
            <div class="home_title">1111</div>
            <div class="home_userinfoContainer">
                <el-dropdown @command='commandHandler'>
                    <span class="el-dropdown-link home_userinfo">
                        {{user.name}}
                        <i class="el-icon-arrow-down el-icon--right home_userinfo" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>系统消息</el-dropdown-item>
                        <el-dropdown-item>我的文章</el-dropdown-item>
                        <el-dropdown-item>个人主页</el-dropdown-item>
                        <el-dropdown-item command='logout' divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        <!-- 内层容器, 包含一个侧边栏和主要区域（左右） -->
        <el-container>
            <el-aside>
                <el-menu default-active="0" style="background-color: #ECECEC" router>
                    <template v-for="(menu, index) in this.routes">
                        <el-submenu v-if="!menu.hidden" :index="index+''" :key="index">
                            <template slot="title">
                                <i :class="menu.iconCls" />
                                <span>{{ menu.name }}</span>
                            </template>
                            <template v-for="item in menu.children">
                                <el-menu-item v-if="!item.hidden" :index="item.path" :key="item.path">
                                    {{ item.name }}
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/home'">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
                </el-breadcrumb>
                <div v-else>Wow</div>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: 'Home',
    computed: {
        user() {
            return this.$store.state.user
        },
        routes() {
            return this.$store.state.routes
        }
    },
    methods: {
        commandHandler(cmd) {
            switch(cmd) {
                case 'logout':
                    this.$confirm('是否注销登录', '提醒', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        this.getRequest('/logout')
                        this.$store.commit('logout')
                        this.$router.replace('/')
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                    break
                default:
                    break
            }
        }
    }
}
</script>

<style>
.home_container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
}
.el-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.el-aside {
    background-color: #ECECEC;
}
.el-main {
    background-color: #fff;
    color: #000;
    text-align: center;
}
.home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
}
.home_userinfo {
    color: #fff;
    cursor: pointer;
}
.home_userinfoContainer {
    display: inline;
    margin-right: 20px;
}
</style>