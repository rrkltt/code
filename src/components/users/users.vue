<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="path">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">

        <el-col :span="20">
          <el-input v-model="queryInfo.query" placeholder="请输入用户名">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table style="width: 100%" :data="userData" border stripe>
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态" width="70">
          <!-- 状态装换成开关按钮 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" active-value="100"
              inactive-value="0" @change="editUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column prop="address" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="editUser(scope.row);dialogFormVisible_edit = true" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" @click="deleUser(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
            <el-button @click="editUser(scope.row);dialogFormVisible_edit = true" type="primary" icon="el-icon-setting" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 弹出添加用户对话框 -->
    <el-dialog @close="dialogFormVisibleClosed" title="添加用户" :visible.sync="dialogFormVisible">
      <el-form status-icon :model="addForm" :rules="addForm_rules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出修改用户对话框 -->
    <template >
     <div>
       <el-dialog title="修改用户" :visible.sync="dialogFormVisible_edit" >
      <el-form status-icon :model="editform" :rules="addForm_rules" ref="editFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button type="primary" @click="editUserinfo">确 定</el-button>
      </div>
    </el-dialog>
     </div>
     
    </template>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      path: '/home',

      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      userData: [],
      total: 0,
      dialogFormVisible: false,
      //添加用户数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addForm_rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },

        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 18, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' },
        ]
      },
      dialogFormVisible_edit:false,
      editform: {},

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })

      //  注意这里不能反过来赋值
      this.userData = res.data.users
      // res.data.users = this.userData
      this.total = res.data.total
      
    },
    //分页显示处理函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      console.log(newSize);
      this.getUserList();
    },
    handleCurrentChange(newSize) {
      this.queryInfo.pagenum = newSize;
      this.getUserList();
    },
    // 修改用户状态！
    async editUserState(state) {
      // console.log(state);
      const { data: res } = await this.$http.put(`users/${state.id}/state/${state.mg_state}`, { params: this.queryInfo })
      // console.log(res);
      
    },
    // 监听添加添加用户框的关闭，关闭时清空填写
    dialogFormVisibleClosed() {
      this.$refs.addFormref.resetFields()
    },
  //  添加用户函数
    addUser() {
      this.$refs.addFormref.validate(async state => {
        if (!state) return;
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status != 201) {
          this.$message.error(res.meta.msg)
          this.dialogFormVisible = false
          // console.log(res);
          return;
        }
        this.dialogFormVisible = false
        this.$message.success('success')
        this.getUserList()

      })
    },
  // 通过作用域插槽获取id，后查询id对应的用户数据
    async editUser(scope){
     const {data : res} = await  this.$http.get(`users/${scope.id}`);
    //  console.log(res.data);
     this.editform = res.data
     
    },
    editUserinfo(){
      this.$refs.editFormref.validate(async state => {
        if (!state) return;
        const res= await this.$http.put('users/'+ this.editform.id,{
          email: this.editform.email,
          mobile: this.editform.mobile
         })
         if (res.status!=200){ this.$message.error('修改失败')}
        this.$message.success('修改成功');
        this.dialogFormVisible_edit = false
        this.getUserList()
      })
    },
    deleUser(id){
      var id1 = id
      {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          
        }).then(async () => {
          let res = await this.$http.delete('users/'+id1)
          // console.log(res);
          if (res.data.meta.status = 200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });this.getUserList()
          };
          
        }).catch(() => {
          if (res.data.meta.status != 200) 
          this.$message({
            type: 'info',
            message: '已取消删除或删除失败'
          });          
        });
      }
    },

  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}

.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}

.el-table {
  margin-top: 10px;
}

.el-pagination {
  margin-top: 15px;
}
</style>