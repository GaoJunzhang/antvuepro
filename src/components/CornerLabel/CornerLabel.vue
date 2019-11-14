<template>
  <span>
    <div :style="label">
      <span :style="labelFont">{{ content }}</span>
    </div>
  </span>
</template>

<script>

export default {
  name: 'CornerLabel',
  props: {
    cornerRadius: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: 'red'
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    label () {
      const height = Math.sqrt(Math.pow(this.cornerRadius * 0.8, 2) / 2)
      const width = height * 4
      const originOffset = Math.sqrt(Math.pow(height / 2, 2) / 2) + 5
      const left = -width / 2 + originOffset
      const top = -height / 2 + originOffset
      const style = {
        position: 'absolute',
        width: width + 'px',
        height: height + 'px',
        background: this.color,
        zIndex: '999',
        top: top + 'px',
        left: left + 'px',
        transform: ' scale(0.8) rotate(-45deg)'
      }
      return style
    },
    labelFont () {
      return {
        color: '#fff',
        fontSize: '12px',
        fontWeight: '200'
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
