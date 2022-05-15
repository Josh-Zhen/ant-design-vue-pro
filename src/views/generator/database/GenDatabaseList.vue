<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="数据库名称">
              <a-input allow-clear placeholder="请输入数据库名称" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="数据库地址">
              <a-input allow-clear placeholder="请输入数据库地址" v-model="queryParam.address" />
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
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
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
      <span slot="type" slot-scope="text">
        {{ dbTypeFilter(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="jumpTablesLists(record.id)">表配置</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <gen-database-model ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenDatabase, getGenDatabasePageList } from '@/api/generator/genDatabase'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import GenDatabaseModel from '@/views/generator/database/modules/GenDatabaseModel'

export default {
  name: 'GenDatabaseList',
  components: {
    STable,
    GenDatabaseModel
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
      range: null,
      mdl: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '数据库名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '数据库类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center'
        },
        {
          title: '连接类型',
          dataIndex: 'driverClassName',
          scopedSlots: { customRender: 'driverClassName' },
          align: 'center'
        },
        {
          title: '数据库地址',
          dataIndex: 'address',
          scopedSlots: { customRender: 'address' },
          align: 'center'
        },
        {
          title: '端口',
          dataIndex: 'port',
          scopedSlots: { customRender: 'port' },
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGenDatabasePageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      dbTypeDictDropDown: [],
      statusDictDropDown: []
    }
  },
  filters: {},
  created () {
    this.sysDictTypeDropDown()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 匹配字典
    dbTypeFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.dbTypeDictDropDown.filter(item => item.key == status)
      if (values.length > 0) {
        return values[0].name
      }
    },
    // 加载字典
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'database_type' }).then((res) => {
        this.dbTypeDictDropDown = res.data
      })
    },
    // 處理新增
    handleAdd () {
      this.$refs.modal.add(this.dbTypeDictDropDown)
    },
    // 處理修改
    handleEdit (record) {
      this.$refs.modal.edit(record, this.dbTypeDictDropDown)
    },
    // 跳轉數據表頁面
    jumpTablesLists (databaseId) {
      this.$router.push({ name: 'GenTablesList', query: { databaseId: databaseId } })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGenDatabase({ ids: ids.join(',') }).then(res => {
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
