<template>
  <a-modal
    title="数据表配置"
    style="top: 20px;"
    width="40%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
        <a-input v-decorator="['configId']"/>
      </a-form-item>
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="所属数据库">{{ databaseIdFilter(mdl.databaseId) }}</a-descriptions-item>
        <a-descriptions-item label="表名">{{ mdl.tableName }}</a-descriptions-item>
      </a-descriptions>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
        <a-input v-decorator="['tableComment']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类名">
        <a-input
          allow-clear
          placeholder="请输入对象名"
          v-decorator="['objectName',{rules: [{ required: true, pattern: /^[a-z][0-9a-zA-Z_]+$/, message: '请输入正确格式的对象名！'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="业务名">
        <a-input
          allow-clear
          placeholder="请输入业务名"
          v-decorator="['businessName',{rules: [{ required: true, pattern: /^[a-z]+$/, message: '请输入业务名！'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="功能名">
        <a-input
          allow-clear
          placeholder="请输入功能名"
          v-decorator="['functionName',{rules: [{ required: true, message: '请输入功能名！'}]}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { updateGenTable } from '@/api/generator/genTable'

export default {
  name: 'GenTableModel',
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
      form: this.$form.createForm(this),
      idDropDown: []
    }
  },
  methods: {
    edit (record, idDropDown) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.idDropDown = idDropDown
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'databaseId', 'tableName', 'tableComment', 'objectName', 'businessName', 'functionName', 'configId'))
      })
    },
    // 數據庫名稱匹配
    databaseIdFilter (id) {
      // eslint-disable-next-line eqeqeq
      const values = this.idDropDown.filter(item => item.key == id)
      if (values.length > 0) {
        return values[0].name
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          updateGenTable(values).then(res => {
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
