<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="path">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/rights">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="le-buttonim" @click="dialogFormVisible_edit = true" type="primary">添加角色
    </el-button>
    <el-card>
      <el-table border stripe :data="usersRolesList">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- <el-table-column v-for="(id,index)in props.row.children" :key="id"></el-table-column> -->
            <el-row >
              <el-col v-for="(item) in props.row.children" :key="item.id" :span="5">
                <el-tag>{{props.row}}</el-tag>
                </el-col>
              <el-col>
               <el-row v-for="(item1) in item.children" :key="item1.id" :span="19">{{item1.authName}}</el-row> 
              </el-col>
            </el-row>
            
            <!-- <pre>{{ props.row }}</pre> -->
          </template>
        </el-table-column>

        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="getUserRoles(scope.row);" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" @click="deleUserRoles(scope.row.id)" icon="el-icon-delete" size="mini">删除
            </el-button>
            <el-button @click="dialogFormVisible_edit3 = true" type="primary" icon="el-icon-setting" size="mini">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹出添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible_edit">
      <el-form status-icon ref="addFormref" label-width="70px">
        <el-form-item label="角色名称">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_edit = false">取 消</el-button>
        <el-button @click="addUserRoles(); dialogFormVisible_edit = false" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible_edit2">
      <el-form status-icon ref="editUserRef" label-width="70px" :model="addRole">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template>
          <el-button @click="dialogFormVisible_edit2 = false">取 消</el-button>
          <el-button @click="editUserRoles(); dialogFormVisible_edit2 = false" type="primary">确 定</el-button>
        </template>

      </div>

    </el-dialog>


  </div>


</template>

<script>
export default {
  data() {
    return {
      path: '/home',
      usersRolesList: [],
      dialogFormVisible_edit: false,
      dialogFormVisible_edit2: false,
      addRole: {
        roleId: 0,
        roleName: '',
        roleDesc: '',
      }
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    // 获取用户角色列表
    async getrolesList() {
      const { data: res } = await this.$http.get('roles')
      this.usersRolesList = res.data
      // console.log(this.usersRolesList);
    },
    // 添加用户角色
    async addUserRoles() {
      const { data: res } = await this.$http.post('roles', this.addRole)
      this.getrolesList()
      this.$message.success(res.meta.msg);
    },
    //通过函数传参数获取当前点击的id，被为addRole赋值，以便编辑角色函数使用
    async getUserRoles(role) {
      this.dialogFormVisible_edit2 = true;
      // this.$refs.editUserRef.validate(v=>{
      // })
      const { data: res } = await this.$http.put('roles/' + role.id, {

        roleName: role.roleName,
        roleDesc: role.roleDesc
      })
      if (res.meta.status != 200) { this.$message.error('获取role数据失败'); }
      this.addRole.roleId = res.data.roleId,
        this.addRole.roleName = res.data.roleName
      this.addRole.roleDesc = res.data.roleDesc
      // console.log(res.data);


    },
    // 编辑角色函数
    async editUserRoles() {
      const { data: res } = await this.$http.put('roles/' + this.addRole.roleId, {
        roleName: this.addRole.roleName,
        roleDesc: this.addRole.roleDesc
      })
      // console.log(res);
      if (res.meta.status == 200) { this.$message.success('修改role数据成功'); this.getrolesList(); }
      else this.$message.error('修改role数据失败');
    },
    // 删除用户角色
    deleUserRoles(id) {

      {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(async () => {
          let res = await this.$http.delete('roles/' + id)
          // console.log(res);
          if (res.data.meta.status = 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getrolesList()
          };

        }).catch(() => {
          if (res.data.meta.status != 200) {
            this.$message({
              type: 'info',
              message: '已取消删除或删除失败'
            })
          };
        });
      }
    },

  },


}

</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 15px;
}

.le-buttonim {
  margin-bottom: 15px;
}
</style>