<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getGoodsList"
            v-model="queryInfo.query"
            ><el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="add_goods" type="primary" @click="goAddpage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- table表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="100px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="100px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="queryInfo.pagenum"
        :page-size="[5, 10, 15, 20]"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "goodsList",
  data() {
    return {
      input_val: "",
      //查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      //商品列表
      goodsList: [],
      //总页数
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //查询表格
    //根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败");
      }
      //获取到商品列表
      this.goodsList = res.data.goods;
      //获取到总页数
      this.total = res.data.total;
    },

    //删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除数据失败");
      }
      this.$message.success("删除数据成功");
      //获取新列表
      this.getGoodsList();
    },
    //跳到指定页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      //更新列表
      this.getGoodsList();
    },
    //更新每页条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //添加商品
    goAddpage() {
      this.$router.push("/goods/add");
    }
  }
};
</script>

<style scoped>
.add_goods {
  margin-left: 10px;
}
</style>