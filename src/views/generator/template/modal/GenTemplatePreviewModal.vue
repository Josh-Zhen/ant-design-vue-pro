<template>
  <a-modal
    v-model="visible"
    :width="1000"
    :footer="null"
    @ok="handleOk"
  >
    <a-tabs @change="callback" v-if="codes" tabPosition="left">
      <a-tab-pane :tab="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))" v-for="(value, key) in codes" :key="key"><pre>{{ value }}</pre></a-tab-pane>
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
        this.codes = res.data
      })
      this.visible = true
    },
    handleOk () {
      this.visible = false
    },
    callback (key) {
      console.log(key)
    }
  }
}
</script>
