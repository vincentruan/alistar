<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-date-picker
            v-model="listQuery.beginTime"
            type="date"
            size="mini"
            placeholder="起始日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="listQuery.endTime"
            type="date"
            size="mini"
            placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="4">
          <el-input
            v-model="listQuery.logname"
            size="mini"
            placeholder="日志名称"
          />
        </el-col>

        <el-col :span="8">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-search"
            @click.native="search"
          >
            {{ $t('button.search') }}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click.native="reset"
          >
            {{ $t('button.reset') }}
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="clear"
          >
            {{ $t('button.clear') }}
          </el-button>
        </el-col>
      </el-row>
      <br>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="flash-table-expand"
          >
            <el-form-item label="用户id">
              <span>{{ props.row.userid }}</span>
            </el-form-item>
            <el-form-item label="日志名称">
              <span>{{ props.row.logname }}</span>
            </el-form-item>
            <el-form-item label="用户">
              <span>{{ props.row.userName }}</span>
            </el-form-item>
            <el-form-item label="IP">
              <span>{{ props.row.ip }}</span>
            </el-form-item>
            <el-form-item label="结果">
              <span>{{ props.row.succeed }}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ props.row.createtime }}</span>
            </el-form-item>
            <el-form-item label="内容">
              <span>{{ props.row.regularMessage }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="用户"
        prop="userName"
      />
      <el-table-column
        label="IP"
        prop="ip"
      />
      <el-table-column
        label="日志名称"
        prop="logname"
      />
      <el-table-column
        label="时间"
        prop="createtime"
      />
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100,500]"
      :page-size="listQuery.limit"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    />
  </div>
</template>

<script src="./loginLog.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
