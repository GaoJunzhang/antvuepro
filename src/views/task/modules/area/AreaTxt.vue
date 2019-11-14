<template>
  <div class="area-txt" :style="{backgroundColor:backgroundColor}">
    <a-spin :spinning="loading">
      <div class="content">
        <marquee :style="{marginTop: top + 'px'}">
          <span :style="{fontSize: fontSize + 'px', color: color}">{{ content }}</span>
        </marquee>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { getSutitleInfoById } from '@/api/media'

export default {
  props: {
    h: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      loading: false,
      type: -1,
      path: '',
      content: '',
      fontSize: 0,
      color: '#000000',
      backgroundColor: '#fff'
    }
  },
  created () {
    this.fontSize = this.h * 80 / 100
    this.top = this.h * 80 / 100
  },
  methods: {
    play (media) {
      if (!media) {
        this.type = -1
        this.content = ''
        return
      }

      this.type = media.type
      this.loading = true
      getSutitleInfoById({ id: media.id }).then(res => {
        const data = res.result
        this.content = data.BR
        this.color = data.FontColor
        this.backgroundColor = data.BackColor
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    changeSize (h) {
      this.fontSize = h * 80 / 100
      this.top = h * 80 / 100
    }
  }
}
</script>

<style lang="less" scoped>
.area-txt {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/text.png') #fff;
  background-size: 90px 90px;
  overflow: hidden;

  .content {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateY(-50%);

    span {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
