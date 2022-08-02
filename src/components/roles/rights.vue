<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="path">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/roles">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-table border stripe :data="usersRights">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag  v-if="scope.row.level =='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level =='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level =='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
     
    </el-card>

  </div>
</template>

<script>
export default {
 data() {
   return {
     path: '/home',
     usersRights: []
   }
 },
 created() {
   this.getusersrights()
 },
 methods:{
   async getusersrights(){
    const{data:res} = await this.$http.get('rights/list')
    this.usersRights = res.data
    // console.log(this.usersRights);
   }
 }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 15px;
}
</style>