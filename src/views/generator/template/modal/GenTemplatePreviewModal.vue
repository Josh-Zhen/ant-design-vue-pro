<template>
  <a-modal
    title="预览模板"
    width="45%"
    style="top: 20px;"
    v-model="visible"
    :footer="null"
    @ok="handleOk"
  >
    <a-tabs v-if="codes" tabPosition="left">
      <a-tab-pane :tab="value.name" v-for="(value,key) in codes" :key="key">
        <pre>{{ value.template }}</pre>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>
<script>
import { preview } from '@/api/generator/genTemplateConfig'

export default {
  name: 'GenTemplatePreviewModal',
  data () {
    return {
      visible: false,
      codes: null
    }
  },
  methods: {
    show (tableId) {
      preview(tableId).then(res => {
        if (res.code === 200) {
          this.codes = res.data
        } else {
          this.$message.error(res.message)
        }
      })
      this.visible = true
    },
    handleOk () {
      this.visible = false
    }
  }
}
</script>
