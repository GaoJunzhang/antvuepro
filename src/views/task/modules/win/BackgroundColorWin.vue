<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="220"
    :visible="visible"
    :bodyStyle="bodyStyle"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <sketch :inline="true" v-model="colors" />
  </a-modal>
</template>

<script>
import { Sketch } from 'vue-color'

export default {
  components: {
    Sketch
  },
  data () {
    return {
      maskClosable: false,
      title: this.$t('task.backgroundColor'),
      visible: false,
      colors: '',
      bodyStyle: {
        padding: '0'
      }
    }
  },
  created () {
  },
  methods: {
    show (color) {
      this.visible = true
      this.colors = color
    },
    handleSubmit () {
      this.visible = false
      this.$emit('ok', this.colors.hex8)
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>
