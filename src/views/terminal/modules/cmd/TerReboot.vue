<template>
  <a-modal
    :maskClosable="maskClosable"
    :width="340"
    :title="$t('terminal.reboot')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <p>{{ $t('terminal.rebootConfirm') }}</p>
  </a-modal>
</template>

<script>
import { reboot } from '@/api/cmd'

export default {
  data () {
    return {
      maskClosable: true,
      visible: false,
      confirmLoading: false,
      params: {}
    }
  },
  created () {
  },
  methods: {
    show (tgroupId, terminalIds) {
      this.visible = true
      this.params.tgroupId = tgroupId
      this.params.terminalIds = terminalIds
    },
    handleOk () {
      this.confirmLoading = true

      const params = { ...this.params }
      reboot(params).then(res => {
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
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
