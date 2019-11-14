<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.adv') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row>
      {{ $t('task.advName') }}
      <span class="label-tail">:</span>
      <a-input
        v-model="prop.name"
        :placeholder="$t('task.advNamePlaceholder')"
        style="width:250px"
      />
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: '',
      prop: {
        name: ''
      }
    }
  },
  created () {
  },
  methods: {
    init (type, prop) {
      this.type = type
      this.prop = prop
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
