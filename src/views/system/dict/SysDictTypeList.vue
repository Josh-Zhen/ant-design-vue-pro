<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="名称">
              <a-input allow-clear placeholder="请输入名称" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="编码">
              <a-input allow-clear placeholder="请输入编码" v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-space align="center" style="margin-bottom: 16px">
      <a-button type="primary" icon="plus" @click="$refs.modal.add(endId)">新增</a-button>
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
    >
      <span slot="status" slot-scope="text,record">
        <a-popconfirm placement="top" :title="text===0? '确定停用？':'确定启用？'" @confirm="() => editStatus(text,record)">
          <a>{{ statusFilter(text) }}</a>
        </a-popconfirm>
      </span>
      <span slot="action" slot-scope="text,record">
        <a @click="handleIndex(record)">字典</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delByIds([[record.id]])">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <sysDictType-modal ref="modal" @ok="handleOk" />
    <sysDictData-list ref="dataList" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  getSysDictTypePageList,
  delSysDictType,
  sysDictTypeDropDown,
  saveSysDictType
} from '@/api/system/dict/sysDictType'
import SysDictTypeModal from './modal/SysDictTypeModal.vue'
import SysDictDataList from './SysDictDataList.vue'

export default {
  name: 'TableList',
  components: {
    STable,
    SysDictTypeModal,
    SysDictDataList
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
      statusDictTypeDropDown: [],
      endId: 0,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '编码',
          dataIndex: 'code',
          scopedSlots: { customRender: 'code' },
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          scopedSlots: { customRender: 'sort' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createDate',
          scopedSlots: { customRender: 'createDate' },
          sorter: true,
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateDate',
          scopedSlots: { customRender: 'updateDate' },
          sorter: true,
          align: 'center'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSysDictTypePageList(Object.assign(parameter, this.queryParam)).then((res) => {
          this.endId = res.data.totalRows !== 0 ? res.data.rows[0].id + 1 : 0
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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
    statusFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.statusDictTypeDropDown.filter(item => item.key == status)
      if (values.length > 0) {
        return values[0].name
      }
    },
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'common_status' }).then((res) => {
        this.statusDictTypeDropDown = res.data
      })
    },
    editStatus (code, record) {
      if (code === 0) {
        this.status = 1
      } else if (code === 1) {
        this.status = 0
      }
      saveSysDictType({ id: record.id, status: this.status }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
    handleIndex (record) {
      this.$refs.dataList.index(record, this.statusDictTypeDropDown)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delSysDictType({ id: ids.join(',') }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
