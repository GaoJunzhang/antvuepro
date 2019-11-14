<template>
  <a-modal
    :title="$t('terminal.led')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="400"
    @cancel="() => visible=false"
    :footer="null"
  >
    <div class="icon-wrapper">
      <a-icon :style="{color: preColor}" type="notification" />
      <a-slider :min="min" :max="max" @change="handleChange" :value="value" />
    </div>
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button style="margin-right: 10px" @click="handleReload" icon="reload" :loading="iconrLoading">{{ $t('common.reload') }}</a-button>
      <a-button type="primary" @click="handelOk" icon="arrow-left" :loading="iconsLoading">{{ $t('common.set') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      iconrLoading: false,
      iconsLoading: false,
      max: 100,
      min: 0,
      value: 0,
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handelOk () {
      this.iconsLoading = true
    },
    handleChange (value) {
      this.value = value
    },
    handleReload () {
      this.iconrLoading = true
    }
  },
  computed: {
    preColor () {
      const { value } = this
      if (value > 90) {
        return 'red'
      }
      return 'green'
    }
  }
}
</script>

<style scoped>
  .icon-wrapper {
    position: relative;
    padding: 0px 30px;
  }

  .icon-wrapper .anticon {
    position: absolute;
    top: -2px;
    width: 16px;
    height: 16px;
    line-height: 1;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.25);
  }

  .icon-wrapper .anticon:first-child {
    left: 0;
  }

  .icon-wrapper .anticon:last-child {
    right: 0;
  }
</style>
