<!--suppress ALL -->
<template>
  <a-modal
    title="表配置"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item>
        <a-alert
          banner
          message="生成的文件路径会以包路径 + 模块名组成 例如：包路径为&quot;com.moonlit&quot; 模块名为&quot;generator&quot;则生成的文件路径为&quot;com.moonlit.generator&quot;" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配置名">
        <a-input
          allow-clear
          placeholder="请输入配置名"
          v-decorator="['name', {rules: [{required: true, message: '请输入配置名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="作者">
        <a-input
          allow-clear
          placeholder="请输入作者名"
          v-decorator="['author', {rules: [{required: true, message: '请输入作者名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="包名">
        <a-input
          allow-clear
          placeholder="请输入包名"
          v-decorator="['packageName',{rules: [{required: true, pattern:/^([a-zA-Z_]\w*)+([.][a-zA-Z_]\w*)+$/, message: '请输入格式正确的包名'}]}]"
        />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模块名">
        <a-input
          allow-clear
          placeholder="请输入模块名"
          v-decorator="['moduleName',{rules: [{pattern:/^[a-zA-Z]+$/, message: '请输入格式正确的模块名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="表前綴">
        <a-input
          allow-clear
          placeholder="请输入表前綴"
          v-decorator="['tablePrefix']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="移除表前綴">
        <a-switch default-checked v-decorator="['removePrefix', { valuePropName: 'checked' }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenTablesConfig } from '@/api/generator/genTablesConfig'
import pick from 'lodash.pick'

export default {
  name: 'GenTablesConfigModel',
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
      form: this.$form.createForm(this),
      alerts: true
    }
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'packageName', 'moduleName', 'tablePrefix', 'removePrefix'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenTablesConfig(values).then(res => {
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
    handleClose () {
      this.alerts = false
    }
  }
}
</script>
