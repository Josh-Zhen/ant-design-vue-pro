<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="库名称">
              <a-input placeholder="请输入库名称" v-model="queryParam.dbName" />
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

    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
    >

      <template slot="operator">
        <a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getGenDbPageList, delGenDb } from '@/api/generator/genDbList'

export default {
  name: 'GenDbList',
  components: {
    STable
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
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'id',
          dataIndex: 'id',
          scopedSlots: { customRender: 'id' }
        },
        {
          title: '数据库名',
          dataIndex: 'dbName',
          scopedSlots: { customRender: 'dbName' }
        },
        {
          title: '连接类型',
          dataIndex: 'driverClassName',
          scopedSlots: { customRender: 'dbName' }
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'dbName' },
          sorter: true
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'dbName' },
          sorter: true
        },
        {
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGenDbPageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      commonStatus: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {},
  beforeCreate () {

  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleEdit (id) {
      this.$router.push({ name: 'genEdit', query: { id: id } })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGenDb({ ids: ids.join(',') }).then(res => {
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
