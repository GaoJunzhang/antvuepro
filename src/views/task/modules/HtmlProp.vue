<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.html') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row>
      <a-input
        v-model="prop.url"
        :placeholder="$t('task.htmlUrlPlaceholder')"
        style="width:100%"
        @pressEnter="loadUrl"
        @change="loadUrl"
      >
        <a-select
          v-model="prop.http"
          slot="addonBefore"
          defaultValue="http://"
          style="width: 90px"
          @change="loadUrl"
        >
          <a-select-option value="http://">http://</a-select-option>
          <a-select-option value="https://">https://</a-select-option>
        </a-select>
      </a-input>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: '',
      prop: {
        http: 'http://',
        url: ''
      }
    }
  },
  created () {
  },
  methods: {
    init (type, prop) {
      this.type = type
      this.prop = prop
      if (!this.prop.http) {
        this.prop.http = 'http://'
      }
    },
    loadUrl () {
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
