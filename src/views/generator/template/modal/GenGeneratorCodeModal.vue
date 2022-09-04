<template>
  <a-modal
    title="构建生成代码"
    style="top: 20px;"
    width="40%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="5">
            <a-form-item label="表配置">
              <a-select allow-clear placeholder="请选择表配置" v-model="mdl.tableConfigId" @change="handleChange">
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
    <a-form :form="form">
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模板组">
        <a-select allow-clear placeholder="请选择模板组" v-decorator="['type', {rules: [{required: true, message: '请选择模板组'}]}]">
          <a-select-option v-for="(item,index) in collectionDropDown" :key="index" :value="item.value" >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getTableConfig } from '@/api/generator/genTableConfig'

export default {
  name: 'GenGeneratorCodeModal',
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      mdl: {},
      tablesConfig: [],
      remark: '',
      collectionDropDown: []
    }
  },
  methods: {
    // 生成代碼
    generator (tableId, tableName) {
      this.handleTablesConfig()
      this.visible = true
    },
    // 加載作者配置
    handleTablesConfig () {
      getTableConfig().then(res => {
        if (res.code === 200) {
          this.tablesConfig = res.data
          this.mdl.tableConfigId = res.data[0].id
          this.remark = res.data[0].remark
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
    },
    handleSubmit (e) {
      e.preventDefault()
      this.visible = false
    }
  }
}
</script>
