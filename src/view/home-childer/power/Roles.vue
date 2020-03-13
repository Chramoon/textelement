<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="dialogVisibleRoles = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['dbbottom', indexOne === 0 ? 'dbtop' : '', 'vcenter']"
              v-for="(itemOne, indexOne) in scope.row.children"
              :key="itemOne.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, itemOne.id)"
                >
                  {{ itemOne.authName }}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <!-- 渲染二级、三级权限 -->

              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row
                  :class="[indexTwo === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(itemTwo, indexTwo) in scope.row.children"
                  :key="itemTwo.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, itemTwo.id)"
                      type="success"
                    >
                      {{ itemTwo.authName }}
                    </el-tag>
                    <!-- icon图标 -->
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="itemThree in itemTwo.children"
                      :key="itemThree.id"
                      @close="removeRightById(scope.row, itemThree.id)"
                      >{{ itemThree.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 增加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisibleRoles"
      width="50%"
      @close="dialogClosedRoles"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="rolesFormRef" label-width="70px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRoles = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形空间 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        @node-click="handleNodeClick"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //角色列表数据
      roleList: [],
      // 控制分配权限对话框(显示、隐藏)
      setRightDialogVisible: false,
      //默认选中节点
      defKeys: [],
      roleId: [],
      //树形空间的树形绑定对象
      treeProps: {
        label: "authName",
        children: "children"
      },
      //所有权限数组
      rightsList: [],
      //添加表单的机制
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      //初始化增加用户的弹出效果
      dialogVisibleRoles: false
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      this.$message.success("获取列表成功");
      this.roleList = res.data;
    },
    // 删除对应权限
    async removeRightById(role, rightId) {
      //提示是否删除成功
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      // 不建议重新渲染,客户效果不大好
      // 更新现有的界面
      role.children = res.data;
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限失败");
      }
      this.rightsList = res.data;
      // 获取三级节点id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    //通过递归获取角色下所有三级权限id
    getLeafKeys(node, arr) {
      //当前节点不包含children,则是三级节点
      if (!node.children) return arr.push(node.id);
      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    //点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    //删除角色
    removeUserById(id) {
      this.$confirm("此操作将永久删除用户，是否继续", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败");
          }
          this.$message.success("删除用户成功");
          // 重新获取数据
          this.getRolesList();
        })
        .catch(() => {
          this.$message.error("已经取消删除");
        });
    },
    //添加用户
    addUser() {
      this.$refs.rolesFormRef.validate(async vaild => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        console.log(res);

        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        //设置弹窗消失
        this.dialogVisibleRoles = false;
        //获取新列表
        this.getRolesList();
      });
    },
    //监听删除增加用户的对话框,寻找到ref对应的组件
    dialogClosedRoles() {
      this.$refs.rolesFormRef.resetFields();
    }
  }
};
</script>

<style scoped>
.el-tag {
  margin: 8px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>