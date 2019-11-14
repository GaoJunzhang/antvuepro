<template>
  <div class="area-qrcode">
    <img v-if="content" :src="generateQrcode(content)" style="width:100%;height:100%;" />
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  components: {
  },
  data () {
    return {
      content: ''
    }
  },
  created () {
  },
  methods: {
    play (media) {
      if (!media) {
        return
      }
      this.content = media.content
    },
    generateQrcode (content) {
      var img = ''
      QRCode.toDataURL(content, { width: 200, margin: 2 }, (error, url) => {
        if (error) {
          return
        }
        img = url
      })

      return img
    }
  }
}
</script>

<style lang="less" scoped>
.area-qrcode {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/qrcode.png') #fff;
  background-size: 90px 90px;

  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
