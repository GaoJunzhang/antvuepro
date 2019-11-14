<template>
  <div class="area-logo">
    <img v-if="type===0" :src="imgSrc" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      type: -1,
      imgSrc: ''
    }
  },
  created () {
  },
  methods: {
    play (media) {
      if (!media) {
        return
      }
      this.type = 0
      this.imgSrc = media.path
    }
  }
}
</script>

<style lang="less" scoped>
.area-logo {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/logo.png') #fff;
  background-size: 90px 90px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
