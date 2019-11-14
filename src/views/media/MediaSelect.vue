<template>
  <a-drawer
    :title="$t('media.mediaSelect')"
    placement="right"
    :width="650"
    :closable="false"
    :visible="mediaDrawerShow"
    @close="onCloseMediaDrawer"
  >
    <div :style="{height:'100%', paddingBottom:'20px'}">
      <a-layout :style="{height:'100%', background: 'white'}">
        <mgroup-tree ref="mgroup" :editable="false" @mgroupChange="handleMgroupChange"></mgroup-tree>
        <a-layout-content :style="{padding:'12px 24px 24px 24px', height:'100%'}">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="16">
                <a-col span="16">
                  <a-form-item :label="$t('task.name')">
                    <a-input v-model="queryParam.name" :placeholder="$t('task.taskPlaceholder')" />
                  </a-form-item>
                </a-col>
                <a-col span="8">
                  <a-button type="primary" @click="loadData()">{{ $t('common.search') }}</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <a-list
            itemLayout="horizontal"
            :pagination="pagination"
            :dataSource="medias"
            :loading="dataLoading"
          >
            <a-list-item
              class="list-item-meta"
              slot="renderItem"
              slot-scope="item, index"
              @click.stop="onCheckMedia(index, item)"
            >
              <div class="meta-pic">
                <div class="check">
                  <a-checkbox style="vertical-align: middle" :checked="item.check"></a-checkbox>
                </div>
              </div>
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
                <div class="description">
                  <span
                    v-if="item.type===1 || item.type===0"
                  >{{ $t('media.resolution') }}：{{ item.width }}*{{ item.height }}&#12288;&#12288;</span>
                  <span
                    v-if="item.type===1 || item.type===2"
                  >{{ $t('media.duration') }}：{{ item.duration }}</span>
                </div>
                <div
                  class="description"
                >{{ item.userName }}&#12288;&#12288;&#12288;{{ item.createTime }}</div>
              </div>
            </a-list-item>
          </a-list>
        </a-layout-content>
      </a-layout>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 9999
        }"
      >
        <a-button @click="onReturnMedia" type="primary">{{ $t('common.ok') }}</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import MgroupTree from '../mgroup/MgroupTree'
import { getMediaData } from '@/api/media'
import CornerLabel from '@/components/CornerLabel/CornerLabel'

export default {
  components: {
    MgroupTree,
    CornerLabel
  },
  data () {
    return {
      mediaDrawerShow: false,
      pagination: {
        onChange: (page) => {
          this.pagination.current = page
          this.loadData()
        },
        current: 1,
        pageSize: 10,
        total: 0
      },
      form: this.$form.createForm(this),
      queryParam: {},
      type: '',
      medias: [],
      checkedMedias: [],
      dataLoading: false,
      multi: true
    }
  },
  watch: {

  },
  methods: {
    loadData () {
      this.queryParam.mgroupId = this.$refs.mgroup.getSelected()
      var params = Object.assign({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        audit: 0,
        types: this.type
      }, this.queryParam)
      this.dataLoading = true
      getMediaData(params)
        .then(res => {
          this.pagination.total = res.result.totalCount
          this.pagination.current = res.result.pageNo + 1
          this.medias = []
          res.result.data.forEach(media => {
            const exist = this.checkedMedias.findIndex(item => item.id === media.id)
            media.check = (exist >= 0)
            media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
            this.medias.push(media)
          })
          this.dataLoading = false
        })
    },
    show (type, multi) {
      this.type = type
      this.multi = multi
      this.checkedMedias = []
      this.mediaDrawerShow = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onCloseMediaDrawer () {
      this.mediaDrawerShow = false
    },
    handleMgroupChange (mgroup) {
      this.loadData()
    },
    onReturnMedia () {
      if (this.checkedMedias.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.chooseMediaError'),
          duration: 4
        })
        return
      }

      this.$emit('returnMedia', this.checkedMedias)
      this.mediaDrawerShow = false
    },
    onCheckMedia (idx, media) {
      this.medias[idx].check = !this.medias[idx].check
      const exist = this.checkedMedias.findIndex(item => item.id === media.id)
      if (exist < 0) {
        if (this.medias[idx].check) {
          if (!this.multi) {
            this.checkedMedias = []
            this.medias.forEach(item => {
              if (item.id !== media.id) {
                item.check = false
              }
            })
          }
          this.checkedMedias.push(media)
        }
      } else {
        if (!this.medias[idx].check) {
          this.checkedMedias.splice(exist, 1)
        }
      }
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
      height: 64px;

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
      width: 200px;
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
