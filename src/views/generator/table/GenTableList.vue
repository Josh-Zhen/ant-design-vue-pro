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
      <span slot="databaseId" slot-scope="text">
        {{ databaseIdFilter(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handlePreview(record.id)">预览</a>
        <a-divider type="vertical" />
        <a @click="jumpTablesColumnLists(record)">字段详情</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <gen-table-model ref="model" @ok="handleOk" />
    <gen-table-add-list-model ref="addModel" @ok="handleOk" />
    <gen-table-column-list ref="columnModal" />
    <gen-template-preview-modal ref="preview" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenTable, getTablePageList } from '@/api/generator/genTable'
import { DictTypeDropDown } from '@/api/generator/genDatabase'
import GenTableModel from '@/views/generator/table/modal/GenTableModal'
import GenTableAddListModel from '@/views/generator/table/modal/GenTableAddListModal'
import GenTableColumnList from '@/views/generator/tableColumn/GenTableColumnList'
import GenTemplatePreviewModal from '@/views/generator/template/modal/GenTemplatePreviewModal'

export default {
  name: 'GenTableList',
  components: {
    GenTemplatePreviewModal,
    GenTableColumnList,
    GenTableAddListModel,
    STable,
    GenTableModel
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
          title: '所属数据库',
          dataIndex: 'databaseId',
          scopedSlots: { customRender: 'databaseId' },
          align: 'center'
        },
        {
          title: '表名',
          dataIndex: 'tableName',
          scopedSlots: { customRender: 'tableName' },
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'tableComment',
          scopedSlots: { customRender: 'tableComment' },
          align: 'center'
        },
        {
          title: '类名',
          dataIndex: 'objectName',
          scopedSlots: { customRender: 'objectName' },
          align: 'center'
        },
        {
          title: '业务名',
          dataIndex: 'businessName',
          scopedSlots: { customRender: 'businessName' },
          align: 'center'
        },
        {
          title: '功能名',
          dataIndex: 'functionName',
          scopedSlots: { customRender: 'functionName' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'updateDate' },
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
        return getTablePageList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      idDropDown: []
    }
  },
  filters: {},
  created () {
    this.DictTypeDropDown()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    DictTypeDropDown () {
      DictTypeDropDown().then(res => {
        this.idDropDown = res.data
      })
    },
    // 數據庫名稱匹配
    databaseIdFilter (id) {
      // eslint-disable-next-line eqeqeq
      const values = this.idDropDown.filter(item => item.key == id)
      if (values.length > 0) {
        return values[0].name
      }
    },
    // 根據庫id獲取表數據
    handleAdd () {
      this.$refs.addModel.addTablesList(this.databaseId)
    },
    // 修改表數據
    handleEdit (record) {
      this.$refs.model.edit(record, this.idDropDown)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    handlePreview (id) {
      this.$refs.preview.show(id)
    },
    // 跳转字段详情页面
    jumpTablesColumnLists (record) {
      this.$refs.columnModal.getTableColumnList(record.databaseId, record.id, record.tableName)
    },
    delByIds (ids) {
      delGenTable({ ids: ids.join(',') }).then(res => {
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
