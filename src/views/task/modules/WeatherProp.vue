<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.weather') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row>
      {{ $t('task.type') }}
      <span class="label-tail">:</span>
      <a-select
        :value="val"
        :placeholder="$t('common.choosePlaceholder')"
        @change="handleChange"
        style="width:150px"
      >
        <a-select-option :value="0">{{ $t('task.oneDay') }}</a-select-option>
        <a-select-option :value="1">{{ $t('task.multiDays') }}</a-select-option>
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
        type: 0
      },
      val: 0
    }
  },
  created () {
  },
  methods: {
    init (type, prop) {
      this.type = type
      if (!prop.type) {
        prop.type = 0
      }
      this.prop = prop
      this.val = prop.type
    },
    handleChange (val) {
      this.val = val
      this.prop.type = val
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
