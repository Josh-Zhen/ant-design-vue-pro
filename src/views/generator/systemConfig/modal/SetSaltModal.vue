<template>
  <a-modal
    title="密钥配置配置"
    style="top: 20px;"
    width="40%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form-model :form="form">
      <a-form-item>
        <a-alert show-icon message="数据密钥加密数据，系统密钥加密数据密钥" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统密钥">
        <a-button type="primary" @click="handleKey">刷新</a-button>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据密钥">
        <a-textarea allow-clear :auto-size="{ minRows: 8, maxRows: 10 }" placeholder="请输入数据密钥" v-model="salt" />
      </a-form-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { refreshKey, setSalt } from '@/api/generator/genSystemConfig'

export default {
  name: 'SetSaltModal',
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
      form: this.$form.createForm(this),
      inputVisible: false,
      salt: ''
    }
  },
  methods: {
    handleSalt () {
      this.salt = ''
      this.visible = true
    },
    // 刷新密钥
    handleKey () {
      refreshKey().then(res => {
        if (res.data === true) {
          this.$message.info('系统密钥已刷新')
        } else {
          this.$message.error('密钥刷新失败')
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          setSalt(values).then(res => {
            if (res.code === 200) {
              this.$message.success('密钥设置成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.error(res.message)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
            this.inputVisible = false
          })
        }
      })
    }
  }
}
</script>
