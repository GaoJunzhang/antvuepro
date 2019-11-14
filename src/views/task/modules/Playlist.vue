<template>
  <div class="playlist">
    <a-row style="margin-bottom:12px;">
      <span style="font-weight:bold;">{{ $t('task.playlist') }}</span>
      <a-button-group style="float:right">
        <a-button
          icon="plus"
          size="small"
          type="default"
          @click="onAddMedia"
          :title="$t('common.new')"
        />
        <a-button
          icon="check"
          size="small"
          type="default"
          @click="onCheckAll"
          :title="$t('common.checkAll')"
        />
        <a-button
          icon="edit"
          size="small"
          type="default"
          :disabled="!isSelectMedia"
          @click="onEditMedias"
          :title="$t('common.edit')"
        />
        <a-button
          icon="delete"
          size="small"
          type="danger"
          :disabled="!isSelectMedia"
          @click="onClearMedia"
          :title="$t('common.del')"
        />
      </a-button-group>
    </a-row>
    <span v-if="medias.length <= 0">{{ $t('task.noData') }}</span>
    <a-list v-else itemLayout="horizontal" class="list-item-meta" :dataSource="medias">
      <a-list-item slot="renderItem" slot-scope="item, index" @click="onSelectMedia(item)">
        <!-- <a slot="actions"> -->
        <div class="meta-pic">
          <div class="check">
            <a-checkbox @change="onCheckMedia(index)" :checked="item.check"></a-checkbox>
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
            <corner-label color="#8D6E63" :cornerRadius="32" :content="$t('mediaType.application')"></corner-label>
          </div>
          <div v-else-if="item.type===4" class="pic">
            <img src="~@/assets/text.png" />
            <corner-label color="#8D6E63" :cornerRadius="32" :content="$t('mediaType.subtitle')"></corner-label>
          </div>
        </div>
        <div class="meta-content">
          <div class="title">{{ item.name }}</div>
          <div class="description">
            <div v-if="item.type === 1" class="prop">
              <a-row>
                <span>{{ $t('task.loop') }} : {{ item.loop }}&#12288;&#12288;&#12288;</span>
                <span class="prop-next">{{ $t('task.volume') }} : {{ item.volume }}</span>
              </a-row>
            </div>
            <div v-if="item.type === 0" class="prop">
              <div>{{ $t('task.duration') }} : {{ item.duration }}</div>
            </div>
            <div v-if="item.type === 4" class="prop">
              <a-row>
                <span>{{ $t('task.loop') }} : {{ item.loop }}&#12288;&#12288;&#12288;</span>
                <span class="prop-next">{{ $t('task.speed') }} : {{ item.speed }}</span>
              </a-row>
            </div>
          </div>
          <div class="description">
            <div
              v-if="item.start.length>0||item.end.length>0"
              class="prop"
            >{{ $t('common.validDate') }} : {{ item.start }} ~ {{ item.end }}</div>
            <div v-else class="prop">{{ $t('common.validDate') }} : {{ $t('common.empty') }}</div>
          </div>
        </div>
        <a slot="actions">
          <a-button
            icon="edit"
            size="small"
            type="link"
            @click="onEditMedia(index)"
            :title="$t('common.edit')"
          />
          <a-button
            icon="close"
            size="small"
            type="link"
            @click="onDelMedia(index)"
            :title="$t('common.del')"
            style="color:red"
          />
        </a>
      </a-list-item>
    </a-list>
    <media-property-win ref="mediaProperty" @ok="onReturnProperty" />
    <media-select ref="mediaSelect" @returnMedia="returnMedia"></media-select>
  </div>
</template>

<script>
import moment from 'moment'
import MediaPropertyWin from './win/MediaPropertyWin'
import MediaSelect from '../../media/MediaSelect'
import CornerLabel from '@/components/CornerLabel/CornerLabel'

export default {
  components: {
    MediaPropertyWin,
    MediaSelect,
    CornerLabel
  },
  data () {
    return {
      type: '',
      visiblePropertyModal: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      medias: [],
      editMediaIndex: -1
    }
  },
  created () {
  },
  computed: {
    isSelectMedia () {
      var idx = this.medias.findIndex(item => { return item.check })
      return idx >= 0
    }
  },
  methods: {
    moment,
    init (type, prop) {
      this.type = type
      if (!prop.playlist) {
        prop.playlist = []
      }
      this.medias = prop.playlist
      this.medias.forEach(media => {
        if (media.type === 1) {
          media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
        }
      })
    },
    onAddMedia () {
      let mediaType = ''
      switch (this.type) {
        case 'Pic':
          mediaType = '0'
          break
        case 'Mix':
          mediaType = '0,1'
          break
        case 'Txt':
          mediaType = '4'
          break
      }
      this.$refs.mediaSelect.show(mediaType, true)
    },
    returnMedia (data) {
      let err = false
      data.forEach((m, idx) => {
        if (this.medias.length >= 64) {
          err = true
          return
        }
        var media = {
          id: m.id,
          name: m.name,
          type: m.type,
          path: m.path,
          localPath: m.localPath,
          loop: 1,
          speed: 1,
          duration: 15,
          volume: 100,
          start: '',
          end: '',
          check: false
        }
        if (media.type === 1) {
          media.preImg = media.path.replace(/\.[^/.]+$/, '.jpg')
        }
        this.medias.push(media)

        if (idx === 0) {
          this.$emit('select', this.medias[this.medias.length - 1])
        }
      })

      if (err) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.maxAreaCntError', ['64']),
          duration: 4
        })
      }
    },
    onClearMedia () {
      for (let idx = this.medias.length - 1; idx >= 0; idx--) {
        if (this.medias[idx].check) {
          this.medias.splice(idx, 1)
        }
      }
    },
    onDelMedia (idx) {
      this.medias.splice(idx, 1)
    },
    onCheckMedia (idx) {
      this.medias[idx].check = !this.medias[idx].check
    },
    onCheckAll () {
      var idx = this.medias.findIndex(item => { return !item.check })
      if (idx >= 0) {
        this.medias.forEach(item => { item.check = true })
      } else {
        this.medias.forEach(item => { item.check = false })
      }
    },
    handlePropertyOk () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.visiblePropertyModal = false
        }
      })
    },
    handlePropertyCancel () {
      this.visiblePropertyModal = false
    },
    onEditMedias () {
      this.editMediaIndex = -1
      let editPropertys = ['validDate']
      this.medias.forEach(media => {
        if (media.check) {
          switch (media.type) {
            case 1:
              editPropertys.push(...['loop', 'volume'])
              break
            case 0:
              editPropertys.push(...['duration'])
              break
            case 4:
              editPropertys.push(...['loop', 'speed'])
              break
          }
        }
      })
      editPropertys = Array.from(new Set(editPropertys))
      this.$refs.mediaProperty.show(editPropertys)
    },
    onEditMedia (idx) {
      this.editMediaIndex = idx
      const media = this.medias[idx]
      let editPropertys = []
      switch (media.type) {
        case 1:
          editPropertys = ['loop', 'volume', 'validDate']
          break
        case 0:
          editPropertys = ['duration', 'validDate']
          break
        case 4:
          editPropertys = ['loop', 'speed', 'validDate']
          break
      }
      this.$refs.mediaProperty.show(editPropertys, media)
    },
    onReturnProperty (props) {
      if (this.editMediaIndex < 0 || this.editMediaIndex >= this.medias.length) {
        this.medias.forEach(media => {
          if (media.check) {
            Object.assign(media, props)
          }
        })
        return
      }
      Object.assign(this.medias[this.editMediaIndex], props)
    },
    onSelectMedia (media) {
      this.$emit('select', media)
    }
  }
}
</script>

<style lang="less" scoped>
.playlist {
  .list-item-meta {
    align-items: flex-start;
    display: flex;
    flex: 1;
    font-size: 0;
    width: 100%;

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
      width: 100%;

      .title {
        color: rgba(0, 0, 0, 1);
        margin-bottom: 4px;
        font-size: 16px;
        line-height: 22px;
        font-weight: 400;
        width: 180px;
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
}
</style>
