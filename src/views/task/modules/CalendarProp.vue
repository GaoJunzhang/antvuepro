<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.calendar') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row>
      {{ $t('task.type') }}
      <span class="label-tail">:</span>
      <a-select
        :value="val"
        :placeholder="$t('common.choosePlaceholder')"
        @change="handleChange"
        style="width:250px"
      >
        <a-select-option value="YYYY-MM-DD">YYYY-MM-DD</a-select-option>
        <a-select-option value="YY-M-D">YY-M-D</a-select-option>
        <a-select-option value="HH:mm:ss">HH:mm:ss</a-select-option>
        <a-select-option value="H:m:s">H:m:s</a-select-option>
        <a-select-option value="HH:mm">HH:mm</a-select-option>
        <a-select-option value="H:m">H:m</a-select-option>
        <a-select-option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</a-select-option>
        <a-select-option value="YY-M-D H:m:s">YY-M-D H:m:s</a-select-option>
      </a-select>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: '',
      prop: {
        type: ''
      },
      val: 'YYYY-MM-DD'
    }
  },
  created () {
  },
  methods: {
    init (type, prop) {
      this.type = type
      if (!prop.type) {
        prop.type = 'YYYY-MM-DD'
      }
      this.prop = prop
      this.val = prop.type
    },
    handleChange (val) {
      this.val = val
      this.prop.type = val
      this.$emit('select', this.prop)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist {
  .label-tail {
    margin: 0 8px 0 2px;
  }
}
</style>
