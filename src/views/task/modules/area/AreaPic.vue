<template>
  <div class="area-pic">
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
        this.type = -1
        return
      }
      if (media.type === 0) {
        this.type = media.type
        this.imgSrc = media.path
      }
    }
  }
}
</script>

<style lang="less" scoped>
.area-pic {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/pic.png') #fff;
  background-size: 90px 90px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
