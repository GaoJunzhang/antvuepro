<template>
  <a-spin :spinning="loading">
    <a-form :form="form" class="form" :loading="loading">
      <a-row class="form-row" :gutter="32">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.name')">
            <a-input
              :placeholder="$t('project.projectPlaceholder')"
              v-decorator="['name', {rules: [{required: true, max:64, message: this.$t('project.nameError')}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.mgroup')">
            <mgroup-tree-select
              ref="mgroup"
              :placeholder="$t('mgroup.chooseError')"
              v-decorator="['mgroupId', {rules: [{required: true, message: this.$t('project.mgroupError'), validator: checkMgroup}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.adCount')">
            <a-input-number
              style="width:100%"
              :placeholder="$t('project.adCountPlaceholder')"
              :min="1"
              :max="16"
              v-decorator="['adCount', {initialValue: 1, rules: [{required: true, type: 'number', message: this.$t('project.projectPlaceholder')}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.client')">
            <a-select
              showSearch
              :placeholder="$t('project.clientPlaceholder')"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleClientSearch"
              @change="handleClientChange"
              v-decorator="['clientId', {rules: [{type: 'number', required: true, message: this.$t('project.clientError')}]}]"
            >
              <a-select-option v-for="d in clientData" :key="d.key">{{ d.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row class="form-row" :gutter="32">
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.validDate')">
            <a-range-picker
              v-decorator="['validDate', {initialValue: [moment(), moment()],rules: [{required: true, message: this.$t('project.validDatePlaceholder')}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.contract')">
            <a-input
              :placeholder="$t('project.contractPlaceholder')"
              v-decorator="['contractNo', {rules: [{required: true, max:64, message: this.$t('project.contractError')}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.taboo')">
            <a-input
              :placeholder="$t('project.tabooPlaceholder')"
              v-decorator="['taboo', {rules: [{required: false}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :lg="6" :md="12" :sm="24">
          <a-form-item :label="$t('project.remark')">
            <a-input
              :placeholder="$t('project.remarkPlaceholder')"
              v-decorator="['remark', {rules: [{required: false}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-spin>
</template>

<script>
import moment from 'moment'
import { getClientData } from '@/api/client'
import MgroupTreeSelect from '@/views/mgroup/MgroupTreeSelect'

export default {
  name: 'ProjectForm',
  components: {
    MgroupTreeSelect
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      clientData: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    moment,
    initData (data) {
      this.clientData = [{ key: data.clientId, name: data.clientName }]
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: data.name,
          adCount: data.adCount,
          clientId: data.clientId,
          validDate: [moment(data.start, 'YYYY-MM-DD '), moment(data.end, 'YYYY-MM-DD')],
          contractNo: data.contractNo,
          taboo: data.taboo,
          remark: data.remark
        })
        this.$refs.mgroup.setDefaultMgroupId(data.mgroupId)
      })
    },
    handleClientChange (val) {
    },
    handleClientSearch (val) {
      if (val) {
        getClientData({ name: val, pageNo: 0, pageSize: 30 }).then(res => {
          if (res.code === 200) {
            this.clientData = []
            res.result.data.forEach(item => {
              this.clientData.push({
                key: item.id,
                name: item.name
              })
            })
          }
        })
      }
    },
    checkMgroup (rule, value, callback) {
      if (value) {
        callback()
      }
      callback(this.$t('mgroup.chooseError'))
    }
  }
}
</script>

<style scoped>
</style>
