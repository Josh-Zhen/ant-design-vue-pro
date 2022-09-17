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
      <span slot="state" slot-scope="text, record">
        <a-popconfirm placement="top" :title="text===true? '禁用？':'启用？'" @confirm="() => editState(record)">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </a-popconfirm>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="jumpTemplateConfigLists(record.id)">模板配置</a>
        <a-divider v-if="record.id !==1" type="vertical"/>
        <a v-if="record.id !==1" @click="handleEdit(record)">编辑</a>
        <a-divider v-if="record.id !==1" type="vertical"/>
        <a-popconfirm placement="topRight" title="确认删除？" v-if="record.id !==1" @confirm="() => delByIds([record.id])">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <gen-template-collection-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  delGenTemplateCollection,
  getGenTemplateCollectionPageList,
  saveGenTemplateCollection
} from '@/api/generator/genTemplateCollection'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import GenTemplateCollectionModal from './modal/GenTemplateCollectionModal'
import { cleanObjectsEmpty } from '@/components/_util/util'

export default {
  name: 'GenTemplateCollectionList',
  components: {
    GenTemplateCollectionModal,
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
          title: '名称',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
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
        cleanObjectsEmpty(this.queryParam)
        return getGenTemplateCollectionPageList(Object.assign(parameter, this.queryParam)).then(res => {
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
    this.sysDictTypeDropDown()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'common_status' }).then(res => {
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
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 修改狀態
    editState (record) {
      saveGenTemplateCollection({ id: record.id, state: !record.state }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
    // 跳转到模板配置页面
    jumpTemplateConfigLists (templateCollectionId) {
      this.$router.push({ name: 'GenTemplateConfigList', query: { collectionId: templateCollectionId } })
    },
    // 删除
    delByIds (ids) {
      if (ids.includes(1)) {
        ids.splice(ids.indexOf(1), 1)
      }
      delGenTemplateCollection({ ids: ids.join(',') }).then(res => {
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
