<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item :label="$t('common.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          :placeholder="$t('task.taskPlaceholder')"
          v-decorator="['name', {rules: [{required: true, message: $t('task.taskPlaceholder')}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('mgroup.mgroup')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <mgroup-tree-select
          ref="mgroup"
          :placeholder="$t('mgroup.chooseError')"
          v-decorator="['mgroupId', {rules: [{initialValue:'', required: true, validator: checkMgroup}]}]"
        />
      </a-form-item>
      <a-form-item :label="$t('task.startDate')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :showTime="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
          :placeholder="$t('task.startDate')"
          v-decorator="['start']"
        />
      </a-form-item>
      <a-form-item :label="$t('task.endDate')" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :showTime="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }"
          :placeholder="$t('task.endDate')"
          v-decorator="['end']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import moment from 'moment'
import MgroupTreeSelect from '@/views/mgroup/MgroupTreeSelect'
import { saveTask } from '@/api/task'

export default {
  components: {
    MgroupTreeSelect
  },
  data () {
    return {
      maskClosable: false,
      title: this.$t('task.saveTask'),
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
      confirmLoading: false,
      content: null,
      screen: {},
      taskId: 0
    }
  },
  created () {
  },
  methods: {
    moment,
    show (name, mgroupId, content, screen, taskId, start, end) {
      this.visible = true
      this.content = content
      this.screen = screen
      this.taskId = taskId
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: name,
          start: start ? moment(start, 'YYYY-MM-DD HH:mm:ss') : null,
          end: end ? moment(end, 'YYYY-MM-DD HH:mm:ss') : null
        })
        this.$refs.mgroup.setDefaultMgroupId(mgroupId)
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.content = this.content
          params.screen = this.screen
          params.taskId = this.taskId
          if (params.start) {
            params.start = values.start.format('YYYY-MM-DD HH:mm:ss')
          } else {
            params.start = ''
          }

          if (params.end) {
            params.end = values.end.format('YYYY-MM-DD HH:mm:ss')
          } else {
            params.end = ''
          }

          saveTask(params).then(res => {
            if (res.code === 200) {
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
    checkMgroup (rule, value, callback) {
      if (value) {
        callback()
      }
      callback(this.$t('mgroup.chooseError'))
    }
  }
}
</script>
