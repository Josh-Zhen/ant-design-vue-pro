<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="配置名">
              <a-input allow-clear placeholder="请输入配置名" v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="作者">
              <a-input allow-clear placeholder="请输入作者" v-model="queryParam.author" />
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
      <a-button type="primary" @click="handleSalt">设置系统密钥</a-button>
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
      <span slot="removePrefix" slot-scope="text">
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
    <gen-tables-config-modal ref="modal" @ok="handleOk" />
    <set-salt-modal ref="salt" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenTablesConfig, getGenTablesConfigPageList } from '@/api/generator/genTablesConfig'
import GenTablesConfigModal from '@/views/generator/tablesConfig/modal/GenTablesConfigModal'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import SetSaltModal from '@/views/generator/systemConfig/modal/SetSaltModal'

export default {
  name: 'GenTablesConfigList',
  components: {
    SetSaltModal,
    STable,
    GenTablesConfigModal
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
          title: '配置名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '作者',
          dataIndex: 'author',
          scopedSlots: { customRender: 'author' },
          align: 'center'
        },
        {
          title: '包名',
          dataIndex: 'packageName',
          scopedSlots: { customRender: 'packageName' },
          align: 'center'
        },
        {
          title: '模块名',
          dataIndex: 'moduleName',
          scopedSlots: { customRender: 'moduleName' },
          align: 'center'
        },
        {
          title: '表前綴',
          dataIndex: 'tablePrefix',
          scopedSlots: { customRender: 'tablePrefix' },
          align: 'center'
        },
        {
          title: '移除表前綴',
          dataIndex: 'removePrefix',
          scopedSlots: { customRender: 'removePrefix' },
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
          title: '操作',
          width: '240px',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGenTablesConfigPageList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusDictDropDown: [],
      salt: ''
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
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'status' }).then(res => {
        this.statusDictTypeDropDown = res.data
      })
    },
    statusFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.statusDictTypeDropDown.filter(item => item.key == status ? 1 : 0)
      if (values.length > 0) {
        return values[0].name
      }
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      delGenTablesConfig({ ids: ids.join(',') }).then(res => {
        if (res.code === 200) {
          this.$message.success(`删除成功`)
          this.handleOk()
        } else {
          this.$message.error(res.message)
        }
        this.selectedRowKeys = []
      })
    },
    // 設置密鑰
    handleSalt (salt) {
      this.$refs.salt.handleSalt(salt)
    }
  }
}
</script>
