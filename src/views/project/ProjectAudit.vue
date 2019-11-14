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
    <template slot="footer">
      <a-button
        v-if="showCancel"
        key="cancel"
        type="danger"
        @click="handleSubmit(2)"
      >{{ $t('project.projectCancel') }}</a-button>
      <a-button
        v-if="!showCancel"
        key="failed"
        @click="handleSubmit(0)"
      >{{ $t('project.auditFail') }}</a-button>
      <a-button
        v-if="!showCancel"
        key="pass"
        type="primary"
        @click="handleSubmit(1)"
      >{{ $t('project.auditPass') }}</a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('project.remark')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            :placeholder="$t('project.remarkPlaceholeder')"
            :autosize="{ minRows: 2, maxRows: 6 }"
            v-decorator="['remark', {rules: [{required: false}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { auditProject } from '@/api/project'

export default {
  data () {
    return {
      maskClosable: false,
      title: this.$t('project.audit'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      visible: false,
      remarkRequired: false,
      ids: [],
      showCancel: false
    }
  },
  created () {
  },
  methods: {
    audit (ids, rows) {
      this.ids = ids
      this.showCancel = false
      rows.forEach(p => {
        if (p.audit === 3) {
          this.showCancel = true
        }
      })
      this.visible = true
    },
    handleSubmit (audit) {
      this.remarkRequired = audit === 0
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.ids = this.ids
          params.audit = audit
          auditProject(params).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$emit('ok', res.result)
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
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
    }
  }
}
</script>
