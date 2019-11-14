<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.logo') }}{{ $t('task.property') }}</span>
    </a-row>
    <a-row>
      <div class="btn" @click="onChoose">
        <img v-if="imgSrc" :src="imgSrc" />
        <span v-else class="upload">
          <div>
            <i class="anticon">
              <svg
                viewBox="64 64 896 896"
                data-icon="plus"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                class
              >
                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
                <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
              </svg>
            </i>
            <div class="text">{{ $t('task.chooseLogo') }}</div>
          </div>
        </span>
      </div>
    </a-row>
    <media-select ref="mediaSelect" @returnMedia="returnMedia"></media-select>
  </div>
</template>

<script>
import MediaSelect from '../../media/MediaSelect'
import set from 'lodash.set'

export default {
  components: {
    MediaSelect
  },
  data () {
    return {
      type: '',
      prop: {
        id: 0,
        path: ''
      },
      imgSrc: ''
    }
  },
  created () {
  },
  methods: {
    init (type, prop) {
      this.type = type
      this.prop = prop
      this.imgSrc = prop.path
    },
    onChoose () {
      this.$refs.mediaSelect.show('0', false)
    },
    returnMedia (data) {
      data.forEach((m, idx) => {
        if (m.type === 0) {
          set(this.prop, 'id', m.id)
          set(this.prop, 'path', m.path)
          set(this.prop, 'localPath', m.localPath)
          this.$emit('select', this.prop)
          this.imgSrc = m.path
        }
      })
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

    img {
      width: 100%;
      height: auto;
    }

    .upload {
      width: 100%;
      height: 100%;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      padding: 8px;

      .anticon {
        font-size: 24px;

        .text {
          margin-top: 8px;
          color: #666;
        }
      }
    }
  }
}
</style>
