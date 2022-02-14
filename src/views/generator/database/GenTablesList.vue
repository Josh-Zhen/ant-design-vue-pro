<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="表名称">
              <a-input allow-clear placeholder="请输入表名称" v-model="queryParam.tableName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="表描述">
              <a-input allow-clear placeholder="请输入表描述" v-model="queryParam.tableComment" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="10">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-space align="center" style="margin-bottom: 16px">
      <a-button v-if="databaseId" type="primary" icon="plus" @click="handleAdd">添加表</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delByIds(selectedRowKeys)">
          <a-button type="primary" icon="close">删除</a-button>
        </a-popconfirm>
      </a-dropdown>
    </a-space>

    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <gen-tables-model ref="model" @ok="handleOk" />
    <gen-tables-add-list-model ref="addModel" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenTables, getTablesPageList } from '@/api/generator/genTables'
import GenTablesModel from '@/views/generator/database/modules/GenTablesModel'
import GenTablesAddListModel from '@/views/generator/database/modules/GenTablesAddListModel'

export default {
  name: 'GenTablesList',
  components: {
    GenTablesAddListModel,
    STable,
    GenTablesModel
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},
      range: null,
      databaseId: this.$route.query.databaseId,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '数据库名',
          dataIndex: 'databaseName',
          scopedSlots: { customRender: 'databaseName' },
          align: 'center'
        },
        {
          title: '表名称',
          dataIndex: 'tableName',
          scopedSlots: { customRender: 'tableName' },
          align: 'center'
        },
        {
          title: '表描述',
          dataIndex: 'tableComment',
          scopedSlots: { customRender: 'tableComment' },
          align: 'center'
        },
        {
          title: '包路径',
          dataIndex: 'packageName',
          scopedSlots: { customRender: 'packageName' },
          align: 'center'
        },
        {
          title: '类名',
          dataIndex: 'moduleName',
          scopedSlots: { customRender: 'moduleName' },
          align: 'center'
        },
        {
          title: '业务名',
          dataIndex: 'businessName',
          scopedSlots: { customRender: 'businessName' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'dbName' },
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'dbName' },
          align: 'center'
        },
        {
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        this.queryParam.databaseId = this.databaseId
        return getTablesPageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {},
  created () {

  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 根據庫id獲取表數據
    handleAdd () {
      this.$refs.addModel.addTablesList(this.databaseId)
    },
    // 修改表數據
    handleEdit (record) {
      this.$refs.model.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGenTables({ ids: ids.join(',') }).then(res => {
        if (res.code === 200) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
        this.selectedRowKeys = []
      })
    }
  }
}
</script>
