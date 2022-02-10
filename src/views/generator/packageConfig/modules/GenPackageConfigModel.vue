<!--suppress ALL -->
<template>
  <a-modal
    title="包配置"
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
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="包路径">
        <a-input
          allow-clear
          placeholder="请输入包路径"
          v-decorator="['packageName', {rules: [{required: true, message: '请输入包路径'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模块名">
        <a-input
          allow-clear
          placeholder="请输入模块名"
          v-decorator="['moduleName', {rules: [{required: true, message: '请输入模块名'}]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenPackageConfig } from '@/api/generator/genPackageCongfig'
import pick from 'lodash.pick'

export default {
  name: 'GenPackageConfigModel',
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
      // 数据类型字典
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
      // eslint-disable-next-line eqeqeq
      record.type = record.type == 1
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'author', 'privateKey', 'publicKey', 'type'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          values.type = values.type === true ? 1 : 0
          saveGenPackageConfig(values).then(res => {
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
