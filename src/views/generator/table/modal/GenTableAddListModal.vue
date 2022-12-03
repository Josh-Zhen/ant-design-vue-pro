<template>
  <a-modal
    title="添加数据表"
    style="top: 20px;"
    width="50%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-table
      size="default"
      ref="table"
      rowKey="tableName"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data-source="data"
      :rangPicker="range"
    >
    </a-table>
    <system-config-modal ref="salt" @ok="handleOk" />
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getTableList, saveGenTable } from '@/api/generator/genTable'
import SystemConfigModal from '@/views/generator/systemConfig/modal/SystemConfigModal'

export default {
  name: 'GenTableAddListModel',
  components: {
    SystemConfigModal,
    STable
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      mdl: {},
      range: null,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      queryParam: {},
      data: [],
      // 表头
      columns: [
        {
          title: '表名',
          dataIndex: 'tableName',
          scopedSlots: { customRender: 'tableName' },
          align: 'center'
        },
        {
          title: '表描述',
          dataIndex: 'tableComment',
          scopedSlots: { customRender: 'tableComment' },
          align: 'center'
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    addTablesList (databaseId) {
      this.data = []
      this.visible = true
      this.queryParam.databaseId = databaseId
      getTableList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.data = res.data
        } else if (res.code === 11005) {
          this.$refs.salt.handleSalt(false)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.queryParam.list = this.selectedRows
    },
    handleCancel () {
      this.queryParam = {}
      this.visible = false
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          values = this.queryParam
          saveGenTable(values).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.error(res.message)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    handleOk () {
      getTableList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.data = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
