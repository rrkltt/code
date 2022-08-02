<template>
    <el-container>
        <!-- 头部区域 -->
        <el-header>
            <el-button @click="logout">退出后台</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 左侧边栏 -->
            <el-aside :width="width">
                <!-- 左侧边栏折叠另外一种便捷写法：<el-aside :width="iscollapse ? '200px': '64px'"> -->
                <!-- 折叠菜单按钮 -->
                <div class="aside_button" @click="aside_button_press">|||</div>
                <el-menu background-color="#373d41" text-color="#fff" active-text-color="#409eff" unique-opened
                    :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="'' + items.id" v-for="(items, index) in menulist" :key="items.id">
                        <template slot="title">
                            <!-- 一级菜单图标 -->
                            <i :class="icon[index]"></i>
                            <!-- 文本 -->
                            <span>{{ items.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <!-- 注意此处可以给点击事件绑定的函数传递参数，得到item.path 在vm中就可以使用了！：addpath（item.path） -->
                        <el-menu-item :index="'/' + item.path" v-for="item in items.children" :key="item.id"
                            @click="addPath">
                            <!-- 二级菜单图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 二级菜单文本 -->
                            <span slot="title">{{ item.authName }}</span>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!-- 页面显示区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist: [],
            icon: [],
            iscollapse: false,
            width: '200px',
            activePath: '',

        }
    },

    watch: {
        n: {
            //当不使用 immediate属性时可以使用watch的简写形式：n(){};或者直接使用vm上的方法：vm.$watch(“n”,handler(new,old){...})
            immediate: true,
            handler() { this.GetMenulist() }
        },
        iscollapse() {
            this.iscollapse ? this.width = '64px' : this.width = '200px'
        }
    },
    methods: {
        logout() {
            window.sessionStorage.clear('token');
            this.$router.push('/login')

        },
        async GetMenulist() {
            const{data : res} = await this.$http.get('menus');
            console.log(res.data)
            if (!res.meta.status == 200) this.$message.error(res.data.meta.msg);
            this.menulist = res.data
            this.menulist.forEach((v, k) => {
                switch (v.path) {
                    case "users":
                        // console.log(k)
                        this.icon[k] = "el-icon-user-solid"
                        break;
                    case "rights":
                        // console.log(k)
                        this.icon[k] = "el-icon-s-tools"
                        break;
                    case "goods":
                        this.icon[k] = "el-icon-s-goods"
                        break;
                    case "orders":
                        this.icon[k] = "el-icon-s-order"
                        break;
                    case "reports":
                        this.icon[k] = "el-icon-s-data"
                        break;
                }
            })

        },
        aside_button_press() {
            this.iscollapse = !this.iscollapse
        },
        addPath() {
            this.activePath = this.$router.history.current.fullPath
        },
    },
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #373d41;
}

.el-aside {
    background-color: #373d41;

    .el-menu {

        border-right: 0px;
        height: 500px;
    }
}

.el-main {
    background-color: #eaedf1;

}

.el-container {
    height: 100%;
}

// .el-button {}

.aside_button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 26px;
    color: #eaedf1;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;

}
</style>