<template>
  <a-modal
    title="表字段"
    width="85%"
    :dialog-style="{ top: '20px' }"
    v-model="visible"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="5">
              <a-form-item label="表名">
                <a-alert :message="this.tableName" type="success" />
              </a-form-item>
            </a-col>
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
                <a-button
                  style="margin-left: 8px"
                  v-if="this.queryParam.tableId"
                  type="primary"
                  icon="undo"
                  @click="handleRefresh">更新字段</a-button>
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
        <span slot="isPrimaryKey" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isIncrement" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isRequired" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isInsert" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isEdit" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isList" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>
        <span slot="isQuery" slot-scope="text">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="delByIds([record.id])">删除</a>
        </span>
      </s-table>
      <gen-table-column-modal ref="modal" @ok="handleOk" />
      <system-config-modal ref="salt" @ok="handleOk" />
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { delGenTableColumns, getTableColumnPageList, refreshGenTableColumn } from '@/api/generator/genTableColumn'
import GenTableColumnModal from '@/views/generator/tableColumn/modal/GenTableColumnModal'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import SystemConfigModal from '@/views/generator/systemConfig/modal/SystemConfigModal'

export default {
  name: 'GenTableColumnList',
  components: {
    SystemConfigModal,
    STable,
    GenTableColumnModal
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
          width: 150,
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
          title: 'JAVA字段名',
          width: 110,
          dataIndex: 'javaField',
          scopedSlots: { customRender: 'javaField' },
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
          title: '更新时间',
          width: 110,
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'updateDate' },
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
        return getTableColumnPageList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusDictTypeDropDown: [],
      databaseId: '',
      tableName: '',
      tableId: ''
    }
  },
  filters: {},
  created () {
    this.sysDictTypeDropDown()
  },
  methods: {
    getTableColumnList (databaseId, tableId, tableName) {
      this.data = []
      this.visible = true
      this.queryParam.tableId = tableId
      this.databaseId = databaseId
      this.tableName = tableName
      this.tableId = tableId
      try {
        this.$refs.table.refresh()
      } catch (e) {
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'status' }).then(res => {
        this.statusDictTypeDropDown = res.data
      })
    },
    statusFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.statusDictTypeDropDown.filter(item => item.key == status)
      if (values.length > 0) {
        return values[0].name
      }
    },
    // 刷新表字段
    handleRefresh () {
      refreshGenTableColumn({
        databaseId: this.databaseId,
        tableName: this.tableName,
        tableId: this.tableId
      }).then(res => {
        if (res.code === 200) {
          this.$refs.table.refresh()
          this.$message.success('更新成功')
        } else if (res.code === 11005) {
          this.$refs.salt.handleSalt(false)
        } else {
          this.$message.error(res.message)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      })
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
    },
    handleCancel () {
      this.queryParam = {}
      this.visible = false
    }
  }
}
</script>
