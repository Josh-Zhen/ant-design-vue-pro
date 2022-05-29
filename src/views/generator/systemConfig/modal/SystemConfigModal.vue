<template>
  <a-modal
    title="密钥配置"
    style="top: 20px;"
    width="40%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item v-show="show">
        <a-alert show-icon message="数据密钥加密数据，系统密钥加密数据密钥" />
      </a-form-item>
      <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统密钥">
        <a-button type="primary" @click="handleKey">刷新</a-button>
      </a-form-item>

      <a-form-item v-show="show" :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统保存数据密钥">
        <a-switch checkedChildren="是" unCheckedChildren="否" v-model="mdl.state" />
        <a-tooltip style="margin-left: 8px" title="为了数据安全，部署云端不建议永久保存数据密钥，应该每次访问仓库时设定">
          <a-icon type="info-circle" />
        </a-tooltip>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="数据密钥">
        <a-textarea allow-clear :auto-size="{ minRows: 6, maxRows: 6 }" placeholder="请输入数据密钥" v-model="mdl.salt" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getSystemConfig, refreshKey, setSalt } from '@/api/generator/genSystemConfig'

export default {
  name: 'SystemConfigModal',
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
      mdl: {},
      confirmLoading: false,
      form: this.$form.createForm(this),
      inputVisible: false,
      show: false
    }
  },
  methods: {
    handleSalt (show) {
      this.mdl.salt = ''
      if (show) {
        getSystemConfig().then(res => {
          if (res.code === 200) {
            this.mdl = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.$message.error('系统错误，请稍后再试')
        })
      }
      this.show = show
      this.visible = true
    },
    // 刷新密钥
    handleKey () {
      if (this.show) {
        refreshKey().then(res => {
          if (res.code === 200) {
            this.$message.info('系统密钥已刷新')
            this.$notification['success']({
              message: '新密钥，请妥善保存',
              description: res.data.salt,
              duration: 0
            })
            this.visible = false
          } else {
            this.$message.error('密钥刷新失败')
          }
        })
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.show) {
            if (!this.mdl.state) {
              this.mdl.salt = ''
            }
          }
          values = this.mdl
          setSalt(values).then(res => {
            if (res.code === 200) {
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
