<template>
  <a-modal
    :title="title"
    style="top: 20px;"
    width="40%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模板組">
        <a-select
          allow-clear
          placeholder="请选择模板組"
          v-decorator="['collectionId',{rules: [{ required: true, message: '请选择模板組！'}]}]">
          <a-select-option v-for="(item,index) in collectionDrop" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
        <a-input
          allow-clear
          placeholder="请输入名称"
          v-decorator="['name', {rules: [{required: true, message: '请输入名称'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="后缀名">
        <a-input
          allow-clear
          placeholder="请输入后缀名"
          v-decorator="['suffixName', {rules: [{required: true, message: '请输入后缀名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态">
        <a-switch v-decorator="['state', {rules: [{required: true, message: '请选择状态'}], valuePropName: 'checked' }]" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenTemplateConfig } from '@/api/generator/genTemplateConfig'
import { getCollectionName } from '@/api/generator/genTemplateCollection'
import pick from 'lodash.pick'

export default {
  name: 'GenTemplateConfigModal',
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
      collectionDrop: [],
      title: ''
    }
  },
  created () {
    this.dictTypeDropDown()
  },
  methods: {
    // 加載字典
    dictTypeDropDown () {
      getCollectionName().then(res => {
        this.collectionDrop = res.data
      })
    },
    add (collectionId) {
      this.form.resetFields()
      this.edit({ id: 0, collectionId: collectionId, state: true })
    },
    edit (record) {
      // 移除默認模板組
      if (this.collectionDrop[0].id === 1) {
        this.collectionDrop.splice(0, 1)
      }
      this.mdl = Object.assign(record)
      this.title = (record.id === 0 ? '添加模板' : '修改模板')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'collectionId', 'name', 'suffixName', 'state'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenTemplateConfig(values).then(res => {
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
            this.inputVisible = false
          })
        }
      })
    }
  }
}
</script>
