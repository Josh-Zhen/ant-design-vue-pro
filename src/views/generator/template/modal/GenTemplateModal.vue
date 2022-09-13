<template>
  <a-modal
    title="模板内容"
    style="top: 20px;"
    width="65%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模板名">
        <a-input
          :value="mdl.name"
          :disabled="true"
        />
      </a-form-item>
      <quill-editor ref="myTextEditor" v-model="template" :options="editorOption">
      </quill-editor>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenTemplateConfig } from '@/api/generator/genTemplateConfig'
import pick from 'lodash.pick'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'GenTemplateModal',
  components: {
    quillEditor
  },
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
      template: '',
      editorOption: {
        modules: {
          toolbar: [
            ['code-block']
          ],
          // 语法高亮
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      },
      // 默認文本
      defaultTemplate: '<pre class="ql-syntax" spellcheck="false">\n&nbsp;</pre>'
    }
  },
  methods: {
    editTemplate (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id'))
      })
      this.handleInitialization(record.template)
    },
    // 處理文本初始化
    handleInitialization (template) {
      if (template === null || template === undefined || template === '') {
        this.template = this.defaultTemplate
      } else {
        this.template = template
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          values.template = this.template
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
