<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="名称">
              <a-input allow-clear placeholder="请输入名称" v-model="queryParam.name" />
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
      <span slot="state" slot-scope="text">
        <a-tag :color="text === true ? 'purple' :'blue'">
          {{ statusFilter(text) }}
        </a-tag>
      </span>
      <span slot="collectionId" slot-scope="text">
        {{ collectionFilter(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="jumpEditTemplate(record)">编辑模板</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <gen-template-config-modal ref="modal" @ok="handleOk" />
    <gen-template-modal ref="template" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenTemplateConfig, getGenTemplateConfigPageList } from '@/api/generator/genTemplateConfig'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import GenTemplateConfigModal from '@/views/generator/template/modal/GenTemplateConfigModal'
import { getCollectionName } from '@/api/generator/genTemplateCollection'
import GenTemplateModal from '@/views/generator/template/modal/GenTemplateModal'

export default {
  name: 'GenTemplateConfigList',
  components: {
    GenTemplateModal,
    GenTemplateConfigModal,
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
          title: '模板組',
          dataIndex: 'collectionId',
          scopedSlots: { customRender: 'collectionId' },
          align: 'center'
        },
        {
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
          align: 'center'
        },
        {
          title: '后缀名',
          dataIndex: 'suffixName',
          scopedSlots: { customRender: 'suffixName' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
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
        this.queryParam.collectionId = this.$route.query.collectionId
        console.log(this.queryParam.collectionId)
        return getGenTemplateConfigPageList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      statusDictTypeDropDown: [],
      collectionDropDown: []
    }
  },
  filters: {},
  created () {
    this.dictTypeDropDown()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 加載字典
    dictTypeDropDown () {
      sysDictTypeDropDown({ code: 'status' }).then(res => {
        this.statusDictTypeDropDown = res.data
      })
      getCollectionName().then(res => {
        this.collectionDropDown = res.data
      })
    },
    statusFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.statusDictTypeDropDown.filter(item => item.key == status)
      if (values.length > 0) {
        return values[0].name
      }
    },
    collectionFilter (collection) {
      // eslint-disable-next-line eqeqeq
      const values = this.collectionDropDown.filter(item => item.id == collection)
      if (values.length > 0) {
        return values[0].name
      }
    },
    handleAdd () {
      this.$refs.modal.add(this.collectionDropDown)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record, this.collectionDropDown)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 跳转到模板内容编辑页面
    jumpEditTemplate (record) {
      this.$refs.template.editTemplate(record)
    },
    // 删除
    delByIds (ids) {
      delGenTemplateConfig({ ids: ids.join(',') }).then(res => {
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
