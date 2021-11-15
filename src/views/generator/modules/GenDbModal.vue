<template>
  <a-modal
    title="数据库配置"
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
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库名">
        <a-input
          allow-clear
          placeholder="数据库名"
          v-decorator="['dbName', {rules: [{required: true, message: '请输入数据库名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库类型">
        <a-select
          allow-clear
          placeholder="请选择数据库类型"
          v-decorator="['dbType',{rules: [{ required: true, message: '请选择数据库类型！'}]}]">
          <a-select-option v-for="(item,index) in dbTypeDictDropDown" :key="index" :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="连接类型">
        <a-input
          placeholder="连接类型"
          v-decorator="['driverClassName', {rules: [{required: true, pattern:/^[a-z]+$/, message: '请输入连接类型'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库地址">
        <a-input
          allow-clear
          placeholder="数据库地址"
          v-decorator="['dbAddress', {rules: [{required: true, pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/, message: '请输入数据库地址'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="端口">
        <a-input
          allow-clear
          placeholder="端口"
          v-decorator="['dbPort', {rules: [{required: true,pattern: /^\d{1,8}$/, message: '请输入端口'}]}]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenDbType } from '@/api/generator/genDbList'
import pick from 'lodash.pick'

export default {
  name: 'GenDbModal',
  props: {},
  components: {},
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
      dbTypeDictDropDown: [],
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
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
        this.form.setFieldsValue(pick(this.mdl, 'id', 'dbName', 'dbType', 'driverClassName', 'dbAddress', 'dbPort'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenDbType(values).then(res => {
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
