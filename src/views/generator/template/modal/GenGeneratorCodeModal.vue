<template>
  <a-modal
    title="构建生成代码"
    style="top: 20px;"
    width="50%"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="5">
            <a-form-item label="表名"/>
          </a-col>
          <a-col :md="18" :sm="15">
            <a-alert :message="this.mdl.fileName" type="success"/>
          </a-col>
        </a-row>
      </a-form>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="5">
            <a-form-item label="表配置">
              <a-select allow-clear placeholder="请选择表配置" v-model="mdl.tableConfigId" @change="handleChange">
                <a-select-option v-for="(item,index) in tablesConfig" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="15">
            <a-alert :message="remark" type="success"/>
          </a-col>
        </a-row>
      </a-form>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="5">
            <a-form-item label="模板组">
              <a-select allow-clear placeholder="请选择模板组" v-model="mdl.collectionId" @change="handleCollectionChange">
                <a-select-option v-for="(item,index) in collectionDropDown" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="18" :sm="15">
            <a-alert :message="collection" type="success"/>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
import { getTableConfig } from '@/api/generator/genTableConfig'
import { getCollection } from '@/api/generator/genTemplateCollection'
import { batchGenerator } from '@/api/generator/genTemplateConfig'

export default {
  name: 'GenGeneratorCodeModal',
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
      tablesConfig: [],
      remark: '',
      collectionDropDown: [],
      collection: ''
    }
  },
  methods: {
    /**
     * 生成代碼
     * @param tableIds 表id集合
     * @param fileName 導出的名稱
     */
    generator (tableIds, fileName) {
      this.handleTablesConfig()
      this.handleCollection()
      this.mdl.tableIds = tableIds
      this.mdl.fileName = fileName
      this.visible = true
    },
    // 加載作者配置
    handleTablesConfig () {
      getTableConfig().then(res => {
        if (res.code === 200) {
          this.tablesConfig = res.data
          this.mdl.tableConfigId = res.data[0].id
          this.remark = res.data[0].remark
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 加載模板組
    handleCollection () {
      getCollection().then(res => {
        if (res.code === 200) {
          this.collectionDropDown = res.data
          this.mdl.collectionId = res.data[0].id
          this.collection = res.data[0].templateName
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 匹配备注值
    handleChange (value) {
      const values = this.tablesConfig.filter(item => item.id === value)
      if (values.length > 0) {
        this.remark = values[0].remark
      }
    },
    // 匹配模板名稱
    handleCollectionChange (value) {
      const values = this.collectionDropDown.filter(item => item.id === value)
      if (values.length > 0) {
        this.collection = values[0].templateName
      }
    },
    // 提交
    handleSubmit (e) {
      e.preventDefault()
      this.confirmLoading = true
      batchGenerator(this.mdl)
      this.confirmLoading = false
      this.visible = false
    }
  }
}
</script>
