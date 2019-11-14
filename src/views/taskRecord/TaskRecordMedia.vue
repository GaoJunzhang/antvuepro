<template>
  <a-drawer
    :title="$t('taskRecord.recordMediaList')"
    placement="right"
    :width="350"
    :closable="false"
    :visible="mediaDrawerShow"
    @close="onCloseMediaDrawer"
  >
    <div :style="{height:'100%', paddingBottom:'20px'}">
      <a-layout :style="{height:'100%', background: 'white'}">
        <a-layout-content :style="{padding:'12px 24px 24px 24px', height:'100%'}">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="16"></a-row>
            </a-form>
          </div>
          <a-list
            itemLayout="horizontal"
            :pagination="false"
            :dataSource="medias"
            :loading="dataLoading"
          >
            <a-list-item class="list-item-meta" slot="renderItem" slot-scope="item">
              <div class="meta-pic">
                <div v-if="item.type===0" class="pic">
                  <img v-real-img="item.path" src="~@/assets/image.png" />
                  <corner-label color="#42A5F5" :cornerRadius="32" :content="$t('mediaType.img')"></corner-label>
                </div>
                <div v-else-if="item.type===1" class="pic">
                  <img v-real-img="item.preImg" src="~@/assets/video.png" />
                  <corner-label color="#66BB6A" :cornerRadius="32" :content="$t('mediaType.video')"></corner-label>
                </div>
                <div v-else-if="item.type===2" class="pic">
                  <img src="~@/assets/audio.png" />
                  <corner-label color="#FFA726" :cornerRadius="32" :content="$t('mediaType.audio')"></corner-label>
                </div>
                <div v-else-if="item.type===3" class="pic">
                  <img src="~@/assets/zip.png" />
                  <corner-label
                    color="#8D6E63"
                    :cornerRadius="32"
                    :content="$t('mediaType.application')"
                  ></corner-label>
                </div>
                <div v-else-if="item.type===4" class="pic">
                  <img src="~@/assets/text.png" />
                  <corner-label
                    color="#8D6E63"
                    :cornerRadius="32"
                    :content="$t('mediaType.subtitle')"
                  ></corner-label>
                </div>
              </div>
              <div class="meta-content">
                <div class="title">{{ item.name }}</div>
                <div class="description">{{ item.userName }}</div>
              </div>
            </a-list-item>
          </a-list>
        </a-layout-content>
      </a-layout>
    </div>
  </a-drawer>
</template>

<script>
import { taskRecordMedias } from '@/api/taskRecord'
import CornerLabel from '@/components/CornerLabel/CornerLabel'

export default {
  components: {
    CornerLabel
  },
  data () {
    return {
      mediaDrawerShow: false,
      form: this.$form.createForm(this),
      queryParam: {},
      type: '',
      medias: [],
      dataLoading: false,
      taskRecordId: 0
    }
  },
  watch: {

  },
  methods: {
    loadData () {
      var params = Object.assign({
        id: this.taskRecordId
      }, this.queryParam)
      this.dataLoading = true
      taskRecordMedias(params)
        .then(res => {
          this.medias = []
          res.result.data.forEach(media => {
            media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
            this.medias.push(media)
          })
          this.dataLoading = false
        })
    },
    show (id) {
      this.taskRecordId = id
      this.mediaDrawerShow = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onCloseMediaDrawer () {
      this.mediaDrawerShow = false
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
.list-item-meta {
  align-items: flex-start;
  display: flex;
  flex: 1;
  font-size: 0;

  .meta-pic {
    margin-right: 8px;

    .check {
      margin-top: 24px;
      vertical-align: middle;
    }

    .pic {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      list-style: none;
      display: table-cell;
      text-align: center;
      background: transparent;
      color: #fff;
      white-space: nowrap;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
      width: 64px;
      height: 44px;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .meta-content {
    flex: 1 0;

    .title {
      color: rgba(0, 0, 0, 1);
      margin-bottom: 4px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 400;
      width: 150px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .description {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      line-height: 22px;
    }
  }
}
</style>
