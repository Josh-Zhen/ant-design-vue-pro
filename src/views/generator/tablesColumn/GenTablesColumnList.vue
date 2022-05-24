<template>
  <a-modal
    title="表字段"
    :width="2000"
    :dialog-style="{ top: '20px' }"
    v-model="visible"
    :footer="null"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="5">
              <a-form-item label="字段名">
                <a-input allow-clear placeholder="请输入字段名" v-model="queryParam.columnName" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="5">
              <a-form-item label="字段描述">
                <a-input allow-clear placeholder="请输入字段描述" v-model="queryParam.columnComment" />
              </a-form-item>
            </a-col>

            <a-col :md="4" :sm="10">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
                <a-button style="margin-left: 8px" type="primary" icon="undo" @click="handleAdd">更新字段</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-space align="center" style="margin-bottom: 16px">
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
        :scroll="{ x: 2000 }"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="delByIds([record.id])">删除</a>
        </span>
      </s-table>
      <gen-tables-column-modal ref="modal" @ok="handleOk" />
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { delGenTableColumns, getTableColumnPageList } from '@/api/generator/genTablesColumn'
import GenTablesColumnModal from '@/views/generator/tablesColumn/modal/GenTablesColumnModal'

export default {
  name: 'GenTablesColumnList',
  components: {
    STable,
    GenTablesColumnModal
  },
  data () {
    return {
      visible: false,
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
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '字段名',
          width: 110,
          fixed: 'left',
          dataIndex: 'columnName',
          scopedSlots: { customRender: 'columnName' },
          align: 'center'
        },
        {
          title: '描述',
          width: 110,
          dataIndex: 'columnComment',
          scopedSlots: { customRender: 'columnComment' },
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' },
          align: 'center'
        },
        {
          title: '列类型',
          dataIndex: 'columnType',
          scopedSlots: { customRender: 'columnType' },
          align: 'center'
        },
        {
          title: '主鍵',
          dataIndex: 'isPrimaryKey',
          scopedSlots: { customRender: 'isPrimaryKey' },
          align: 'center'
        },
        {
          title: '自增',
          dataIndex: 'isIncrement',
          scopedSlots: { customRender: 'isIncrement' },
          align: 'center'
        },
        {
          title: '可否為空',
          dataIndex: 'isRequired',
          scopedSlots: { customRender: 'isRequired' },
          align: 'center'
        },
        {
          title: 'JAVA类型',
          width: 100,
          dataIndex: 'javaType',
          scopedSlots: { customRender: 'javaType' },
          align: 'center'
        },
        {
          title: 'JAVA字段名',
          width: 110,
          dataIndex: 'javaField',
          scopedSlots: { customRender: 'javaField' },
          align: 'center'
        },
        {
          title: '可否插入',
          dataIndex: 'isInsert',
          scopedSlots: { customRender: 'isInsert' },
          align: 'center'
        },
        {
          title: '可否编辑',
          dataIndex: 'isEdit',
          scopedSlots: { customRender: 'isEdit' },
          align: 'center'
        },
        {
          title: '可否列表',
          dataIndex: 'isList',
          scopedSlots: { customRender: 'isList' },
          align: 'center'
        },
        {
          title: '可否查询',
          dataIndex: 'isQuery',
          scopedSlots: { customRender: 'isQuery' },
          align: 'center'
        },
        {
          title: '查询方式',
          dataIndex: 'queryType',
          scopedSlots: { customRender: 'queryType' },
          align: 'center'
        },
        {
          title: 'web显示类型',
          width: 140,
          dataIndex: 'htmlType',
          scopedSlots: { customRender: 'htmlType' },
          align: 'center'
        },
        {
          title: '字典类型',
          dataIndex: 'dictType',
          scopedSlots: { customRender: 'dictType' },
          align: 'center'
        },
        {
          title: '创建时间',
          width: 110,
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          sorter: true,
          align: 'center'
        },
        {
          title: '操作',
          fixed: 'right',
          width: 150,
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getTableColumnPageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusDictDropDown: []
    }
  },
  filters: {},
  created () {
    // this.sysDictTypeDropDown()
  },
  methods: {
    getTableColumnList (tableId) {
      this.data = []
      this.visible = true
      this.queryParam.tableId = tableId
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      // this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGenTableColumns({ ids: ids.join(',') }).then(res => {
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
