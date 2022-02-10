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
          placeholder="请输入数据库名"
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
        <a-tooltip>
          <template #title>mysql的连接类型为“com.mysql.cj.jdbc.Driver”</template>
          <a-input
            placeholder="请输入数据库连接类型"
            v-decorator="['driverClassName', {rules: [{required: true, pattern:/^([a-zA-Z_]\w*)+([.][a-zA-Z_]\w*)+$/, message: '请输入格式正确的连接类型'}]}]" />
        </a-tooltip>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据库地址">
        <a-input
          allow-clear
          placeholder="请输入数据库地址"
          v-decorator="['dbAddress', {rules: [{required: true, pattern:/^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/, message: '请输入格式正确的地址'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="端口">
        <a-input
          allow-clear
          placeholder="请输入数据库端口"
          v-decorator="['dbPort', {rules: [{required: true,pattern: /^\d{1,8}$/, message: '请输入正确的端口号'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号">
        <a-tooltip>
          <template #title>账户密码会被加密展示</template>
          <a-input-password
            allow-clear
            placeholder="请输入数据库"
            v-decorator="['userName', {rules: [{required: true, message: '请输入账号'}]}]" />
        </a-tooltip>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="密码">
        <a-tooltip>
          <template #title>账户密码会被加密展示</template>
          <a-input-password
            allow-clear
            placeholder="请输入数据库密码"
            v-decorator="['password', {rules: [{required: true, message: '请输入密码'}]}]" />
        </a-tooltip>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenDatabase } from '@/api/generator/genDatabase'
import pick from 'lodash.pick'

export default {
  name: 'GenDatabaseModel',
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
    add (dbTypeDictDropDown) {
      this.form.resetFields()
      this.dbTypeDictDropDown = dbTypeDictDropDown
      this.mdl = Object.assign({ id: 0 })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'dbName', 'dbType', 'driverClassName', 'dbAddress', 'dbPort', 'userName', 'password'))
      })
    },
    edit (record, dbTypeDictDropDown) {
      record.dbType = record.dbType.toString()
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'dbName', 'dbType', 'driverClassName', 'dbAddress', 'dbPort', 'userName', 'password'))
      })
      this.dbTypeDictDropDown = dbTypeDictDropDown
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenDatabase(values).then(res => {
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
