<template>
  <a-modal
    title="添加数据表"
    style="top: 20px;"
    :width="1000"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="5">
            <a-form-item label="表配置">
              <a-select allow-clear placeholder="请选择表配置" v-model="queryParam.tableConfigId" @change="handleChange">
                <a-select-option v-for="(item,index) in tablesConfig" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="15">
            <a-alert :message="remark" type="success" />
          </a-col>
        </a-row>
      </a-form>
    </div>

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
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getTablesList, saveGenTables } from '@/api/generator/genTables'
import { getTablesConfig } from '@/api/generator/genTablesConfig'

export default {
  name: 'GenTablesAddListModel',
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
      selectedRows: [],
      tablesConfig: [],
      remark: ''
    }
  },
  methods: {
    addTablesList (databaseId) {
      this.handleTablesConfig()
      this.data = []
      this.visible = true
      this.queryParam.databaseId = databaseId
      getTablesList(this.queryParam).then(res => {
        if (res.code === 200) {
          this.data = res.data
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
    },
    // 加載作者配置
    handleTablesConfig () {
      getTablesConfig().then(res => {
        if (res.code === 200) {
          this.tablesConfig = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 匹配备注值
    handleChange (value) {
      const values = this.tablesConfig.filter(item => item.id === value)
      if (values.length > 0) {
        this.remark = values[0].remark
      }
    }
  }
}
</script>
