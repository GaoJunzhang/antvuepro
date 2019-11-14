<template>
  <a-list
    :grid="{ gutter: 8, xs: 1, sm: 2, md: 4, lg: 6, xl: 6, column: 6 }"
    :dataSource="medias"
    :loading="loading"
  >
    <a-list-item slot="renderItem" slot-scope="item, idx">
      <div class="media-list">
        <div v-if="item.type !== -1" class="media-list-item">
          <div class="item-info">
            <div v-if="item.type===0" class="pic">
              <img v-real-img="item.path" src="~@/assets/image.png" />
            </div>
            <div v-if="item.type===1" class="pic">
              <img v-real-img="item.preImg" src="~@/assets/video.png" />
            </div>
            <span class="item-actions">
              <a-icon type="delete" class="action" @click="onRemoveMedia(idx)" />
            </span>
          </div>
        </div>
        <div v-else class="media-list-select" @click="onAddMedia">
          <a-icon class="anticon" type="plus" />
        </div>
      </div>
    </a-list-item>
    <media-select ref="mediaSelect" @returnMedia="returnMedia"></media-select>
  </a-list>
</template>

<script>
import { getProjectMedias } from '@/api/project'
import MediaSelect from '@/views/media/MediaSelect'
export default {
  components: {
    MediaSelect
  },
  data () {
    return {
      medias: [{ type: -1 }],
      loading: false
    }
  },
  methods: {
    loadMedias (projectId) {
      if (projectId <= 0) {
        return
      }

      getProjectMedias(projectId).then(res => {
        if (res.code === 200) {
          this.medias = []
          res.result.forEach((m, idx) => {
            if (this.medias.length >= 8) {
              return
            }
            var media = {
              id: m.id,
              name: m.name,
              type: m.type,
              path: m.path,
              localPath: m.localPath
            }
            if (media.type === 1) {
              media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
            }
            this.medias.push(media)
          })
          this.medias.push({ type: -1 })
        }
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    onAddMedia () {
      this.$refs.mediaSelect.show('0,1', true)
    },
    onRemoveMedia (idx) {
      this.medias.splice(idx, 1)
    },
    returnMedia (data) {
      let err = false
      this.medias.splice(this.medias.length - 1, 1)
      data.forEach((m, idx) => {
        if (this.medias.length >= 8) {
          err = true
          return
        }
        var media = {
          id: m.id,
          name: m.name,
          type: m.type,
          path: m.path,
          localPath: m.localPath
        }
        if (media.type === 1) {
          media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
        }
        this.medias.push(media)
      })
      this.medias.push({ type: -1 })
      if (err) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.maxAreaCntError', ['8']),
          duration: 4
        })
      }
    },
    getMedias () {
      var mediaIds = []
      this.medias.forEach(m => {
        if (m.id) {
          mediaIds.push(m.id)
        }
      })
      return mediaIds
    }
  }
}
</script>

<style lang="less" scoped>
.media-list {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  zoom: 1;

  .media-list-item {
    float: left;
    width: 130px;
    height: 130px;
    margin: 0 8px 8px 0;
    position: relative;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;

    .item-info {
      position: relative;
      height: 100%;
      overflow: hidden;
      padding: 0;
      margin: 0;

      .pic {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: center;
        background: transparent;
        color: #fff;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        vertical-align: middle;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .item-actions {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 10;
      white-space: nowrap;
      transform: translate(-50%, -50%);
      transition: all 0.3s;
      background: rgba(0, 0, 0, 0.6);
      width: 100%;
      height: 100%;
      text-align: center;
      vertical-align: middle;
      line-height: 120px;
      opacity: 0;

      .action {
        z-index: 10;
        margin: 0 4px;
        color: rgba(255, 255, 255, 1);
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s;
      }
    }

    .item-actions:hover {
      opacity: 1;
    }
  }

  .media-list-select {
    display: table;
    width: 130px;
    height: 130px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    padding: 8px;

    .anticon {
      font-size: 30px;
    }
  }
}
</style>
