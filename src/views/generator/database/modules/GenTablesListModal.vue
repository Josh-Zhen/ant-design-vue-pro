<template>
  <a-modal
    title="数据库-表添加"
    style="top: 20px;"
    :width="1000"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-card :bordered="false">
      <a-table
        size="default"
        ref="table"
        rowKey="tableName"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :data-source="this.data"
        :rangPicker="range"
      >
      </a-table>
    </a-card>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getTablesList, saveGenTables } from '@/api/generator/genTables'

export default {
  name: 'GenTablesListModal',
  components: {
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
      data: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    getTablesList (databaseId) {
      this.visible = true
      this.queryParam.databaseId = databaseId
      getTablesList(this.queryParam).then((res) => {
        this.data = res.data
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleCancel () {
      this.queryParam = {}
      this.data = []
      this.visible = false
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenTables(values).then(res => {
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
    }
  }
}
</script>
