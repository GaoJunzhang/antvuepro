<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="540"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item :label="$t('tgroup.tgroup')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <tgroup-tree-select
          ref="tgroup"
          :placeholder="$t('mgroup.chooseError')"
          v-decorator="['tgroupId', {rules: [{initialValue:'', required: true, validator: checkTgroup}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('project.startDate')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-date-picker
          format="YYYY-MM-DD"
          :placeholder="$t('project.startDate')"
          v-decorator="['start', {rules: [{required: true, message: this.$t('project.vacancyPlaceholder')}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('project.endDate')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-date-picker
          format="YYYY-MM-DD"
          :placeholder="$t('project.endDate')"
          v-decorator="['end', {rules: [{required: true, message: this.$t('project.vacancyPlaceholder')}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('project.vacancy')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input-number
          :placeholder="$t('project.vacancyPlaceholder')"
          :min="1"
          :max="64"
          :precision="0"
          style="width:120px"
          v-decorator="['count', {initialValue:4, rules: [{required: true, type: 'number', message: this.$t('project.vacancyPlaceholder')}]}]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import TgroupTreeSelect from '@/views/tgroup/TgroupTreeSelect'
import { exportVacancy } from '@/api/project'

export default {
  components: {
    TgroupTreeSelect
  },
  data () {
    return {
      maskClosable: false,
      title: this.$t('project.exportEmptyExcel'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false
    }
  },
  created () {
  },
  methods: {
    moment,
    show (start, end, tgroupId) {
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          start: start ? moment(start, 'YYYY-MM-DD') : null,
          end: end ? moment(end, 'YYYY-MM-DD') : null
        })
        this.$refs.tgroup.setDefaultTgroupId(tgroupId)
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (params.start) {
            params.start = values.start.format('YYYY-MM-DD')
          } else {
            params.start = ''
          }

          if (params.end) {
            params.end = values.end.format('YYYY-MM-DD')
          } else {
            params.end = ''
          }
          exportVacancy(params).then(res => {
            if (res.code === 200) {
              window.open(res.result.url)
              this.visible = false
              this.$emit('ok', '')
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.message || this.$t('common.tryLater'),
                duration: 4
              })
            }

            this.confirmLoading = false
          }, () => {
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    checkTgroup (rule, value, callback) {
      if (value) {
        callback()
      }
      callback(this.$t('tgroup.chooseError'))
    }
  }
}
</script>
