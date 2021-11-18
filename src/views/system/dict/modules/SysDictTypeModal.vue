<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item v-show="false">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
        <a-input
          allow-clear
          placeholder="请输入名称"
          v-decorator="['name', {rules: [{required: true, message: '请输入名称'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="编码">
        <a-input
          allow-clear
          placeholder="请输入编码"
          v-decorator="['code', {rules: [{required: true, pattern:/^[a-zA-Z]\w{1,40}$/, message: '请输入编码'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
        <a-input
          allow-clear
          placeholder="请输入排序"
          v-decorator="['sort', {rules: [{required: true, pattern:/^\d{1,8}$/, message: '请输入排序'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
        <a-switch checkedChildren="是" unCheckedChildren="否" v-decorator="['status', { valuePropName: 'checked' }]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea allow-clear placeholder="请输入备注" v-decorator="['remark']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveSysDictType } from '@/api/system/dict/sysDictType'
import pick from 'lodash.pick'

export default {
  name: 'SysDictTypeModal',
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
      confirmLoading: false,
      mdl: {},
      statusDef: true,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
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
        this.statusDef = record.status !== 0
        this.form.setFieldsValue({ status: this.statusDef })
        this.form.setFieldsValue(pick(this.mdl, 'id', 'name', 'code', 'sort', 'status', 'remark'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.status ? values.status = 1 : values.status = 0
          this.confirmLoading = true
          saveSysDictType(values).then(res => {
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
