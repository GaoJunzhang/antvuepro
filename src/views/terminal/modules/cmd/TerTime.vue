<template>
  <a-modal
    :maskClosable="maskClosable"
    :width="340"
    :title="$t('terminal.checkTime')"
    :visible="visible"
    :confirmLoading="getLoading || setLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <span style="color:red;margin-right:20px">{{ errorMsg }}</span>
      <a-button
        key="get"
        :loading="getLoading"
        @click="handleGet"
        :disabled="setLoading || getLoading || (this.params.terminalIds && this.params.terminalIds.length!=1)"
      >{{ $t('terminal.get') }}"</a-button>
      <a-button
        key="submit"
        type="primary"
        :disabled="setLoading || getLoading"
        :loading="setLoading"
        @click="handleOk"
      >{{ $t('terminal.timing') }}</a-button>
    </template>
    <a-form layout="inline">
      <a-form-item :label="$t('terminal.datetime')">
        <a-input :value="time" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getTime, setTime } from '@/api/cmd'

export default {
  data () {
    return {
      maskClosable: true,
      visible: false,
      getLoading: false,
      setLoading: false,
      params: {},
      errorMsg: '',
      time: ''
    }
  },
  created () {
  },
  methods: {
    show (tgroupId, terminalIds) {
      this.visible = true
      this.params = {
        tgroupId: tgroupId,
        terminalIds: terminalIds
      }
    },
    handleOk () {
      this.errorMsg = ''
      this.setLoading = true
      const params = { ...this.params }

      setTime(params).then(res => {
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
        this.setLoading = false
      }, () => {
        this.setLoading = false
      })
    },
    handleGet () {
      this.errorMsg = ''
      this.getLoading = true
      getTime({ terminalId: this.params.terminalIds[0] }).then(res => {
        if (res.code === 200) {
          this.time = res.result.time
        } else {
          this.errorMsg = res.errMsg || this.$t('terminal.getError')
        }
        this.getLoading = false
      }, () => {
        this.errorMsg = this.$t('terminal.getError')
        this.getLoading = false
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
