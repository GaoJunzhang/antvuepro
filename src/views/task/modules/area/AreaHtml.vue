<template>
  <div class="area-html">
    <iframe v-if="url" :src="url" style="width:100%;height:100%;background:white"></iframe>
    <div class="mask"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      html: ''
    }
  },
  created () {
  },
  methods: {
    play (media) {
      if (!media) {
        this.url = ''
        return
      }

      if (media.url && media.http) {
        this.url = media.http + media.url
      }
    }
  }
}
</script>

<style lang="less" scoped>
.area-html {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/html.png') #fff;
  background-size: 90px 90px;

  .mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
