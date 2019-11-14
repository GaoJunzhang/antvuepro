<template>
  <a-drawer
    :placement="placement"
    :destroyOnClose="true"
    @close="onClose"
    height="110"
    :visible="showAudioPlayer"
  >
    <aplayer
      autoplay
      :music="musicList">
    </aplayer>
  </a-drawer>
</template>

<script>

import aplayer from 'vue-aplayer'
export default {
  name: 'AudioPlayer',
  props: {
    pdfurl: {
      type: String,
      default: 'http://seeyoomps.oss-cn-shanghai.aliyuncs.com/mpsoss/sysimg/audio.png'
    }
  },
  components: {
    aplayer: aplayer
  },
  data () {
    return {
      placement: 'bottom',
      showAudioPlayer: false,
      musicList: {
        title: 'Music',
        artist: 'mps',
        src: this.pdfurl,
        pic: 'http://seeyoomps.oss-cn-shanghai.aliyuncs.com/mpsoss/sysimg/audio.png'
      }
    }
  },
  computed: {
    url () {
      return this.pdfurl
    }
  },
  methods: {
    show (mobj) {
      this.showAudioPlayer = true
      this.musicList.src = mobj.path
      this.musicList.title = mobj.name
    },
    onClose () {
      this.showAudioPlayer = false
    }
  },
  mounted () {

  }

}
</script>

<style scoped>
</style>
