<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    @ok="() => setModal1Visible(false)"
    @cancel="() => setModal1Visible(false)"
    :footer="null"
    :destroyOnClose="true"
  >
    <video id="media" ref="media" controls autoplay :style="vStyle"></video>
  </a-modal>
</template>

<script>
import flvjs from 'flv.js'
export default {
  name: 'FlvPlayer',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      title: '视频',
      visible: false,
      vStyle: {
        height: '100%',
        width: '100%'
      },
      modalWidth: '800px'
    }
  },
  methods: {
    show (media) {
      if (media.height > media.width) {
        this.vStyle.height = '600px'
        this.vStyle.width = '600px'
        this.modalWidth = '650px'
      } else {
        this.vStyle.height = '100%'
        this.vStyle.width = '100%'
        this.modalWidth = '800px'
      }
      this.title = media.name
      this.visible = true
      const flvSrc = media.path
      this.$nextTick(function () {
        if (flvjs.isSupported()) {
          const videoElement = this.$refs.media
          var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            // url: 'http://yunxianchang.live.ujne7.com/vod-system-bj/TLaf2cc9d469939803949187b46da16c45.flv'
            url: flvSrc
          })
          flvPlayer.attachMediaElement(videoElement)
          flvPlayer.load()
          flvPlayer.play()
        }
      })
    },
    setModal1Visible (visible) {
      this.visible = visible
    }
  }
}
</script>

<style scoped>
</style>
