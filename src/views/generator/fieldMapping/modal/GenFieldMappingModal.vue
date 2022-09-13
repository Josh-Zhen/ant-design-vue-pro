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
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="键">
        <a-input allow-clear placeholder="请输入键" v-decorator="['comment',{rules: [{ required: true, message: '请输入键！'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="值">
        <a-input allow-clear placeholder="请输入值" v-decorator="['mapping',{rules: [{ required: true, message: '请输入值！'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="类型">
        <a-select allow-clear placeholder="请选择类型" v-decorator="['type',{rules: [{ required: true, message: '请选择类型！'}]}]">
          <a-select-option v-for="(item,index) in typeDictTypeDropDown" :key="index" :value="item.key">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { saveGenFieldMapping } from '@/api/generator/genFieldMapping'
import pick from 'lodash.pick'

export default {
  name: 'GenFieldMappingModal',
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
      typeDictTypeDropDown: [],
      title: ''
    }
  },
  methods: {
    // 添加
    add (typeDictTypeDropDown) {
      this.form.resetFields()
      this.edit({ id: 0, type: 0 }, typeDictTypeDropDown)
    },
    // 编辑修改
    edit (record, typeDictTypeDropDown) {
      record.type = record.type.toString()
      this.typeDictTypeDropDown = typeDictTypeDropDown
      this.mdl = Object.assign(record)
      this.title = record.id === 0 ? '添加键值映射' : '修改键值映射'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'comment', 'mapping', 'type'))
      })
    },
    // 提交数据
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          saveGenFieldMapping(values).then(res => {
            if (res.code === 200) {
              this.message.success('保存成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.message.error(res.message)
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
