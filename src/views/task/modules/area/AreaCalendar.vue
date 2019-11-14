<template>
  <div class="area-calendar">
    <span :style="{fontSize: fontSize + 'px'}">{{ time }}</span>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    h: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      time: '',
      fontSize: 0
    }
  },
  created () {
    this.fontSize = this.h
  },
  methods: {
    moment,
    play (media) {
      if (!media) {
        this.time = ''
        return
      }
      this.time = moment().format(media.type)
    },
    changeSize (h) {
      this.fontSize = h
    }
  }
}
</script>

<style lang="less" scoped>
.area-calendar {
  width: 100%;
  height: 100%;
  background: url('~@/assets/area/calendar.png') #fff;
  background-size: 90px 90px;
  overflow: hidden;
  span {
    width: 100%;
    position: absolute;
    transform: translateY(-25%);
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
