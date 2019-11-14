<template>
  <div class="area-mix">
    <img v-if="type===0" :src="imgSrc" />
    <video
      v-if="type===1"
      id="media"
      ref="media"
      loop
      autoplay
      style="background-color:#000;height:100%;width:100%;object-fit:fill;"
    ></video>
  </div>
</template>

<script>
import flvjs from 'flv.js'

export default {
  data () {
    return {
      type: -1,
      imgSrc: '',
      flvPlayer: null
    }
  },
  created () {
  },
  beforeDestroy () {
    this.destoryPlayer()
  },
  methods: {
    play (media) {
      this.destoryPlayer()
      if (!media) {
        this.type = -1
        return
      }

      this.type = media.type
      if (media.type === 0) {
        this.imgSrc = media.path
      } else if (media.type === 1) {
        this.$nextTick(function () {
          if (flvjs.isSupported()) {
            const videoElement = this.$refs.media
            this.flvPlayer = flvjs.createPlayer({
              type: 'flv',
              url: media.path
            })
            this.flvPlayer.attachMediaElement(videoElement)
            this.flvPlayer.load()
            this.flvPlayer.play()
          }
        })
      }
    },
    destoryPlayer () {
      if (this.flvPlayer != null) {
        this.flvPlayer.pause()
        this.flvPlayer.unload()
        this.flvPlayer.detachMediaElement()
        this.flvPlayer.destroy()
        this.flvPlayer = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.area-mix {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/mix.png') #fff;
  background-size: 90px 90px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
