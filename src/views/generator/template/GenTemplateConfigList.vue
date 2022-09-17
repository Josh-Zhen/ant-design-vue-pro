<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="5">
            <a-form-item label="名称">
              <a-input allow-clear placeholder="请输入名称" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="5">
            <a-form-item label="后缀名">
              <a-input allow-clear placeholder="请输入后缀名" v-model="queryParam.suffixName"/>
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
      <a-button v-if="queryParam.collectionId !==1" type="primary" icon="plus" @click="handleAdd">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0 && queryParam.collectionId !==1">
        <a-popconfirm
          placement="topRight"
          title="确认删除？"
          @confirm="() => delByIds(this.queryParam.collectionId,selectedRowKeys)">
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
      <span slot="display" slot-scope="text,record">
        <a-popconfirm placement="top" :title="text===true? '不使用？':'使用？'" @confirm="() => editDisplay(record)">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </a-popconfirm>
      </span>
      <span slot="state" slot-scope="text,record">
        <a-popconfirm placement="top" :title="text===true? '禁用？':'启用？'" @confirm="() => editState(record)">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </a-popconfirm>
      </span>
      <span slot="collectionId" slot-scope="text">
        {{ collectionFilter(text) }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="jumpEditTemplate(record)">编辑模板</a>
        <a-divider v-if="record.collectionId !==1" type="vertical"/>
        <a v-if="record.collectionId !==1" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="record.collectionId !==1" type="vertical"/>
        <a-popconfirm placement="topRight" title="确认删除？" v-if="record.collectionId !==1" @confirm="() => delByIds(record.collectionId,[record.id])">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <gen-template-config-modal ref="modal" @ok="handleOk"/>
    <gen-template-modal ref="template" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenTemplateConfig, getGenTemplateConfigPageList, saveGenTemplateConfig } from '@/api/generator/genTemplateConfig'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import { getCollectionName } from '@/api/generator/genTemplateCollection'
import GenTemplateModal from './modal/GenTemplateModal'
import GenTemplateConfigModal from './modal/GenTemplateConfigModal'
import { cleanObjectsEmpty } from '@/components/_util/util'

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
          title: '展示',
          dataIndex: 'display',
          scopedSlots: { customRender: 'display' },
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
        cleanObjectsEmpty(this.queryParam)
        return getGenTemplateConfigPageList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      commonStatusDictTypeDropDown: [],
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
      sysDictTypeDropDown({ code: 'common_status' }).then(res => {
        this.commonStatusDictTypeDropDown = res.data
      })
      sysDictTypeDropDown({ code: 'status' }).then(res => {
        this.statusDictTypeDropDown = res.data
      })
      getCollectionName().then(res => {
        this.collectionDropDown = res.data
      })
    },
    commonStatusFilter (status) {
      // eslint-disable-next-line eqeqeq
      const values = this.commonStatusDictTypeDropDown.filter(item => item.key == status)
      if (values.length > 0) {
        return values[0].name
      }
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
      if (this.queryParam.collectionId === 1) {
        this.$message.error('默认模板组无法添加模板')
      } else {
        this.$refs.modal.add(this.queryParam.collectionId)
      }
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    // 修改展示状态
    editDisplay (record) {
      saveGenTemplateConfig({ id: record.id, display: !record.display }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
    // 修改展示状态
    editState (record) {
      saveGenTemplateConfig({ id: record.id, state: !record.state }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 跳转到模板内容编辑页面
    jumpEditTemplate (record) {
      this.$refs.template.editTemplate(record)
    },
    // 删除
    delByIds (collectionId, ids) {
      if (collectionId === 1) {
        this.$message.error('操作失败：无法删除默认组的模板')
      }
      delGenTemplateConfig({ collectionId: collectionId, ids: ids.join(',') }).then(res => {
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
