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
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="通道编号" has-feedback>
        <a-input placeholder="通道编号" v-decorator="['channelCode', {rules: [{required: true, message: '请输入通道编号'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="通道名称" has-feedback>
        <a-input placeholder="通道名称" v-decorator="['channelName', {rules: [{required: true, message: '请输入通道名称'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="URL" has-feedback>
        <a-input placeholder="URL" v-decorator="['url']" />
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
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
    this.sysDictTypeDropDown()
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
        this.form.setFieldsValue(pick(this.mdl, 'id', 'channelCode', 'channelName', 'url', 'status', 'createTime'))
      })
    },
    sysDictTypeDropDown () {

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
