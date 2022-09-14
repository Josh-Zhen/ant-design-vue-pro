<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="键">
              <a-input allow-clear placeholder="请输入键" v-model="queryParam.comment"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="值">
              <a-input allow-clear placeholder="请输入值" v-model="queryParam.mapping"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="类型">
              <a-select allow-clear v-model="queryParam.type" placeholder="请选择类型">
                <a-select-option v-for="(item,index) in typeDictTypeDropDown" :key="index" :value="item.key">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
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
        {{ typeFilter(text) }}
      </span>
      <span slot="state" slot-scope="text">
        <a-popconfirm placement="top" :title="text===true? '禁用？':'启用？'" @confirm="() => editDisplay(record)">
          <a-tag :color="text === true ? 'purple' :'blue'">
            {{ statusFilter(text) }}
          </a-tag>
        </a-popconfirm>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-popconfirm placement="topRight" title="确认删除？" @confirm="() => delByIds([record.id])">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </s-table>
    <genFieldMapping-modal ref="mapping" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { delGenFieldMapping, getGenFieldMappingPageList, saveGenFieldMapping } from '@/api/generator/genFieldMapping'
import GenFieldMappingModal from './modal/GenFieldMappingModal'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'
import { cleanObjectsEmpty } from '@/components/_util/util'

export default {
  name: 'GenFieldMappingList',
  components: {
    STable,
    GenFieldMappingModal
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '键',
          dataIndex: 'comment',
          scopedSlots: { customRender: 'comment' },
          align: 'center'
        },
        {
          title: '值',
          dataIndex: 'mapping',
          scopedSlots: { customRender: 'mapping' },
          align: 'center'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
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
        return getGenFieldMappingPageList(Object.assign(parameter, this.queryParam)).then((res) => {
          return res.data
        })
      },
      typeDictTypeDropDown: [],
      statusDictTypeDropDown: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {},
  created () {
    this.sysDictTypeDropDown()
  },
  methods: {
    // 处理多选
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 提交完成后刷新
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 加载字典
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'field_mapping' }).then((res) => {
        this.typeDictTypeDropDown = res.data
      })
      sysDictTypeDropDown({ code: 'common_status' }).then(res => {
        this.statusDictTypeDropDown = res.data
      })
    },
    // 匹配字典
    typeFilter (type) {
      // eslint-disable-next-line eqeqeq
      const values = this.typeDictTypeDropDown.filter(item => item.key == type)
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
    // 添加
    handleAdd () {
      this.$refs.mapping.add(this.typeDictTypeDropDown)
    },
    // 修改
    handleEdit (record) {
      this.$refs.mapping.edit(record, this.typeDictTypeDropDown)
    },
    // 修改状态
    editDisplay (record) {
      saveGenFieldMapping({ id: record.id, display: !record.display }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败：' + res.message)
        }
      })
    },
    // 批量删除
    delByIds (ids) {
      delGenFieldMapping({ ids: ids.join(',') }).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功')
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
