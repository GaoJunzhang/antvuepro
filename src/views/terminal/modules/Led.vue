<template>
  <a-modal
    :title="$t('terminal.led')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="400"
    @cancel="() => visible=false"
    @ok="handelOk"
  >
    <a-textarea
      :placeholder="$t('common.inputPlaceholder')"
      :autosize="{ minRows: 6, maxRows: 12 }"
    />
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handelOk () {
    }
  }
}
</script>

<style scoped>

</style>
