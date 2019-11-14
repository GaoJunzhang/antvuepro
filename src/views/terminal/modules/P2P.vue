<template>
  <a-modal
    :title="$t('terminal.p2p')"
    :visible="visible"
    :width="400"
    @cancel="() => visible=false"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="p2" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['p2p', {rules: [{required: true, message: $t('common.choosePlaceholder')}]}]">
            <a-select-option value="0">{{ $t('common.choosePlaceholder') }}</a-select-option>
            <a-select-option value="1">{{ $t('common.enable') }}</a-select-option>
            <a-select-option value="2">{{ $t('common.close') }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button style="margin-right: 10px" @click="handleReload" icon="reload" :loading="iconrLoading">{{ $t('common.reload') }}</a-button>
      <a-button type="primary" @click="handelOk" icon="arrow-left" :loading="iconsLoading">{{ $t('common.set') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      iconrLoading: false,
      iconsLoading: false,
      max: 100,
      min: 0,
      value: 0,
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handelOk () {
      this.iconsLoading = true
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.$emit('ok', values)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleChange (value) {
      this.value = value
    },
    handleReload () {
      this.iconrLoading = true
    }
  },
  computed: {
    preColor () {
      const { value } = this
      if (value > 90) {
        return 'red'
      }
      return 'green'
    }
  }
}
</script>
