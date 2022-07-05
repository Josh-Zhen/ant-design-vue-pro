<template>
  <a-modal
    title="字段配置"
    width="45%"
    :dialog-style="{ top: '20px' }"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>

      <a-descriptions bordered :column="2">
        <a-descriptions-item label="字段名">
          {{ mdl.columnName }}
        </a-descriptions-item>
        <a-descriptions-item label="描述">
          {{ mdl.columnComment }}
        </a-descriptions-item>
        <a-descriptions-item label="排序">
          {{ mdl.sort }}
        </a-descriptions-item>
        <a-descriptions-item label="列类型">
          {{ mdl.columnType }}
        </a-descriptions-item>
      </a-descriptions>
      <div style="width:100%; display:flex; flex-wrap:wrap; padding-left:95px">
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主鍵">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isPrimaryKey', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自增">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isIncrement', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
      </div>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可否為空">
        <a-switch
          checkedChildren="是"
          unCheckedChildren="否"
          v-decorator="['isRequired', { valuePropName: 'checked' }]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="JAVA字段名">
        <a-input
          allow-clear
          placeholder="请输入JAVA字段名"
          v-decorator="['javaField', {rules: [{required: true, message: '请输入JAVA字段名'}]}]" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="JAVA类型">
        <a-select
          allow-clear
          placeholder="请选择JAVA类型"
          v-decorator="['javaType',{rules: [{ required: true, message: '请选择JAVA类型！'}]}]">
          <a-select-option v-for="(item,index) in javaDataType" :key="index" :value="item.key">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <div style="width:100%; display:flex; flex-wrap:wrap; padding-left:95px">
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可否插入">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isInsert', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可否编辑">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isEdit', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可否列表">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isList', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
        <div style="width:50%">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="可否查询">
            <a-switch
              checkedChildren="是"
              unCheckedChildren="否"
              v-decorator="['isQuery', { valuePropName: 'checked' }]" />
          </a-form-item>
        </div>
      </div>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="查询方式">
        <a-select
          allow-clear
          placeholder="请选择查询方式"
          v-decorator="['queryType',{rules: [{ required: true, message: '请选择查询方式！'}]}]">
          <a-select-option v-for="(item,index) in queryType" :key="index" :value="item.key">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="web显示类型">
        <a-select
          allow-clear
          placeholder="请选择web显示类型"
          v-decorator="['htmlType',{rules: [{ required: true, message: '请选择web显示类型！'}]}]">
          <a-select-option v-for="(item,index) in webLabel" :key="index" :value="item.key">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="字典类型">
        <a-input allow-clear placeholder="请输入字典类型" v-decorator="['dictType']" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { updateGenTableColumn } from '@/api/generator/genTableColumn'
import pick from 'lodash.pick'
import { sysDictTypeDropDown } from '@/api/system/dict/sysDictType'

export default {
  name: 'GenTableColumnModal',
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
      javaDataType: [],
      webLabel: [],
      queryType: []
    }
  },
  created () {
    this.sysDictTypeDropDown()
  },
  methods: {
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.inputVisible = false
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'columnName', 'columnComment', 'sort', 'columnType', 'isPrimaryKey', 'isIncrement', 'isRequired', 'javaType', 'javaField', 'isInsert', 'isEdit', 'isList', 'isQuery', 'queryType', 'htmlType', 'dictType'))
      })
    },
    sysDictTypeDropDown () {
      sysDictTypeDropDown({ code: 'java_data_type' }).then(res => {
        this.javaDataType = res.data
      })
      sysDictTypeDropDown({ code: 'web_label' }).then(res => {
        this.webLabel = res.data
      })
      sysDictTypeDropDown({ code: 'query_type' }).then(res => {
        this.queryType = res.data
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          updateGenTableColumn(values).then(res => {
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
