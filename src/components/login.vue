<template>
    <div class="login_container">

        <div class="login_box">
            <!-- logo区域 -->
            <div class="img_logo">
                <img src="../assets/logo.png" alt="logo">
            </div>
            <!-- 登录表单区域 -->
            <el-form status-icon :rules="loginform_rules" label-width="0px" class="login_form" ref="loginformref" :model="LoginForm">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user-solid" v-model="LoginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input show-password prefix-icon="el-icon-lock" v-model="LoginForm.password"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="success" @click="login">登录</el-button>
                    <el-button type="success" @click="resetloginfrom">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            LoginForm: {
                username: 'admin',
                password: '123456'
            },
            loginform_rules: {
                username: [
                    // 当光标失去焦点时验证以下正则
                    { required: true, message: '请输入账户名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入账户密码', trigger: 'blur'},
                    { min: 6, max: 12, message: '长度错误', trigger: 'blur'}
                ]
            },

        }
    },
    methods: {
        resetloginfrom() {
            this.$refs['loginformref'].resetFields()


        },
        login() {
            //validata 方法用于对form表单的验证结果验证，会返回true或者false 然后执行回调函数
            this.$refs['loginformref'].validate(async (valid) => {
                if (!valid) return;
                // console.log(valid)
                let data = await this.$http.post('login', this.LoginForm);
                // console.log(data.data.meta);
                if (data.data.meta.status !== 200) return this.$message.error('login failed');
                this.$message({
                    message: 'login success',
                    type: 'success'
                });
                window.sessionStorage.setItem('token',data.data.data.token);
                // console.log(data.data);
                
                this.$router.push('/home')
                // console.log($routers)

            })

        }
    }

}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.img_logo {
    height: 130px;
    width: 130px;
    border: 1px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
        width: inherit;
        height: inherit;
        border-radius: 50%;
        background-color: gray;
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btn {
    display: flex;
    justify-content: flex-end;
}
</style>