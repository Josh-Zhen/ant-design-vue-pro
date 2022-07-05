<template>
  <a-modal
    title="模板内容"
    style="top: 20px;"
    width="80%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']" />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="模板内容">
        <quill-editor
          ref="myTextEditor"
          v-model="template"
          :config="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveGenTemplateConfig } from '@/api/generator/genTemplateConfig'
import pick from 'lodash.pick'
import hljs from 'highlight.js'
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
            ['bold', 'italic', 'underline', 'strike'], // 字体
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }], // 样式标题
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // 下标、上标
            [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
            [{ 'direction': 'rtl' }]

            // [{ 'size': ['small', false, 'large', 'huge'] }], // 字体
            // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            // [{ 'color': [] }, { 'background': [] }],
            // [{ 'font': [] }],
            // [{ 'align': [] }],

            // ['clean'] // 格式清除
          ],

          // 语法高亮
          syntax: {
            highlight: text => hljs.highlightAuto(text).value
          }
        }
      }
    }
  },
  methods: {
    editTemplate (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id'))
      })
      this.template = record.template
    },
    onEditorBlur (editor) {
      // console.log('editor blur!', editor)
    },
    onEditorFocus (editor) {
      // console.log('editor focus!', editor)
    },
    onEditorReady (editor) {
      // console.log('editor ready!', editor)
    },
    onEditorChange ({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.content = html
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
