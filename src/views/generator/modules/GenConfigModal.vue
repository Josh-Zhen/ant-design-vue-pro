<!--suppress ALL -->
<template>
  <a-modal
    title="作者配置"
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
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="作者">
        <a-input
          allow-clear
          placeholder="请输入作者名"
          v-decorator="['author', {rules: [{required: true, message: '请输入作者名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="私钥">
        <a-textarea
          allow-clear
          :rows="8"
          placeholder="请输入私钥"
          v-decorator="['privateKey', {rules: [{required: true, message: '请输入私钥'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公钥">
        <a-textarea
          allow-clear
          :rows="6"
          placeholder="请输入公钥"
          v-decorator="['publicKey', {rules: [{required: true, message: '请输入公钥'}]}]" />
        <a-button type="primary" icon="sync" @click="handleKeys">
          刷新密鑰
        </a-button>
        <p style="color:#FF0000">公、私钥用于加密数据库登录的用户与密码</p>
      </a-form-item>
      <a-form-item layout="inline" :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol" label="默認">
        <a-switch checked-children="是" un-checked-children="否" v-decorator="['type', { valuePropName: 'checked' }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenConfig, getKeys } from '@/api/generator/genCongfig'
import pick from 'lodash.pick'

export default {
  name: 'GenConfigModal',
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
          saveGenConfig(values).then(res => {
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
    },
    handleKeys () {
      getKeys().then((res) => {
        this.form.setFieldsValue({
          publicKey: res.data.publicKey,
          privateKey: res.data.privateKey
        })
      })
    }
  }
}
</script>
