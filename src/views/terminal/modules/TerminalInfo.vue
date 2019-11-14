<template>
  <a-modal
    :title="title"
    :visible="visible"
    :okText="$t('common.set')"
    :confirmLoading="confirmLoading"
    :width="500"
    @cancel="() => visible = false"
    :okButtonProps="{ props: {icon: 'arrow-left'} }"
    @ok="handleOk"
  >
    <a-form :form="form">
      <a-form-item :label="$t('terminal.maxMedia')" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="flag == 1">
        <a-input-number
          style="width: 100%;"
          :min="0"
          v-decorator="[
            'maxMedia',
            {
              rules: [
                {
                  required: true,
                  message: $t('terminalExpand.maxMediaplaceholder'),
                },
              ],
            },
          ]"
          :placeholder="$t('terminal.maxMedia')"/>
      </a-form-item>
      <a-form-item :label="$t('terminalExpand.simno')" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="flag == 2">
        <a-input
          style="width: 100%;"
          :min="0"
          v-decorator="[
            'simno',
            {
              rules: [
                {
                  required: true,
                  message: $t('terminalExpand.simnoplaceholder'),
                },
              ],
            },
          ]"
          :placeholder="$t('terminalExpand.simno')"/>
      </a-form-item>
      <a-form-item :label="$t('terminal.suspension')" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="flag == 3">
        <a-input
          style="width: 100%;"
          :min="0"
          v-decorator="[
            'suspension',
            {
              rules: [
                {
                  required: true,
                  message: $t('terminalExpand.screenplaceholder'),
                },
              ],
            },
          ]"
          :placeholder="$t('terminal.suspension')"/>
      </a-form-item>
      <a-form-item :label="$t('terminal.business')" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="flag == 4">
        <a-input
          style="width: 100%;"
          :min="0"
          v-decorator="[
            'business',
            {
              rules: [
                {
                  required: true,
                  message: $t('terminal.business'),
                },
              ],
            },
          ]"
          :placeholder="$t('terminal.business')"/>
      </a-form-item>
      <a-form-item :label="$t('terminalExpand.level')" :label-col="{ span: 5 }" :wrapper-col="{ span: 17 }" v-if="flag == 5">
        <a-select
          v-decorator="[
            'level',
            {
              rules: [
                {
                  required: true,
                  message: $t('common.choosePlaceholder'),
                },
              ],
            }
          ]"
          :placeholder="$t('common.choosePlaceholder')">
          <a-select-option value="0">{{ $t('terminalExpand.levelA') }}</a-select-option>
          <a-select-option value="1">{{ $t('terminalExpand.levelB') }}</a-select-option>
          <a-select-option value="2">{{ $t('terminalExpand.levelC') }}</a-select-option>
          <a-select-option value="3">{{ $t('terminalExpand.levelD') }}</a-select-option>
          <a-select-option value="4">{{ $t('terminalExpand.levelE') }}</a-select-option>
          <a-select-option value="5">{{ $t('terminalExpand.levelF') }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      flag: 1,
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      iconLoading: false,
      confirmLoading: false,
      visible: false,
      title: this.$t('terminal.props')
    }
  },
  methods: {
    show (flag) {
      this.visible = true
      this.flag = flag
      if (flag === 1) {
        this.title = this.$t('terminal.maxMedia')
      }
      if (flag === 2) {
        this.title = this.$t('terminalExpand.simno')
      }
      if (flag === 3) {
        this.title = this.$t('terminal.suspension')
      }
      if (flag === 4) {
        this.title = this.$t('terminal.business')
      }
      if (flag === 5) {
        this.title = this.$t('terminalExpand.level')
      }
    },
    handleOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          this.$notification['success']({
            message: this.$t('common.success'),
            description: '设置',
            duration: 4
          })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
