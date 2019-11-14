<template>
  <a-modal
    :title="$t('terminal.changeDefaultTask')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="400"
    @cancel="() => visible=false"
    :footer="null"
  >
    <a-form :form="form">
      <a-form-item :label="$t('common.enable')" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-select
          v-decorator="[
            'enable',
            { rules: [{ required: true, message: $t('common.choosePlaceholder') }] },
          ]"
          :placeholder="$t('common.choosePlaceholder')"
        >
          <a-select-option value="0">
            {{ $t('common.enable') }}
          </a-select-option>
          <a-select-option value="1">
            {{ $t('common.close') }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('serverSet.endTime')" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-date-picker
          style="width: 100%"
          v-decorator="[
            'endTime',
            { rules: [{ required: true, message: $t('common.choosePlaceholder') }] },
          ]"
          :placeholder="$t('common.choosePlaceholder')"
        />
      </a-form-item>
    </a-form>
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button type="primary" @click="handelSet" icon="arrow-left" :loading="iconsLoading">{{ $t('common.set') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handelSet () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {}
      })
    }
  }
}
</script>

<style scoped>

</style>
