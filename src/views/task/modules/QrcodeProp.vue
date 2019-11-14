<template>
  <div class="playlist" @resize="onResize">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.qrcode') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row style="margin-bottom:12px;">
      <a-input
        v-model="prop.content"
        :placeholder="$t('task.qrcodePlaceholder')"
        @change="loadQrcode"
      ></a-input>
    </a-row>
    <a-row>
      <div class="btn">
        <span class="upload">
          <img
            v-if="prop.content"
            :src="generateQrcode(prop.content)"
            style="width:200px;height:200px;"
          />
          <a-icon v-else type="qrcode" class="anticon" />
        </span>
      </div>
    </a-row>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  data () {
    return {
      type: '',
      prop: {
        content: ''
      },
      logoSrc: ''
    }
  },
  created () {
  },
  methods: {
    onResize (x, y) {
      console.log('onResize', x, y)
    },
    init (type, prop) {
      this.type = type
      this.prop = prop
      this.loadQrcode()
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
    },
    loadQrcode () {
      this.$emit('select', this.prop)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist {
  .btn {
    border: 1px dashed #d9d9d9;
    width: 100%;
    border-radius: 4px;
    background-color: #fafafa;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    vertical-align: top;
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 24px;
    display: flex;

    .qrcode {
      width: 200px;
      height: 200px;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }

    .upload {
      width: 100%;
      height: 100%;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      padding: 8px;

      .anticon {
        font-size: 64px;
      }

      .text {
        margin-top: 12px;
        color: #666;
      }
    }
  }
}
</style>
