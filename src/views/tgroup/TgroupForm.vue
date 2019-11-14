<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="mapLoading">
      <div class="amap-page-container">
        <a-form :form="form">
          <a-form-item :label="$t('common.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :placeholder="$t('tgroup.namePlaceholder')"
              v-decorator="['name', {rules: [{required: true, min: 2, message: this.$t('tgroup.tgroupPlaceholder')}]}]"
            />
          </a-form-item>
        </a-form>
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap
          :center="mapCenter"
          :zoom="16"
          class="amap-demo"
          :plugin="plugin"
          :events="events"
        >
          <el-amap-marker v-for="(marker, index) in markers" :position="marker" :key="index" :events="events"></el-amap-marker>
          <el-amap-info-window
            :position="currentWindow.position"
            :visible="currentWindow.visible">
            <a-button @click="onClick">{{ settingTitle }}</a-button>
          </el-amap-info-window>
        </el-amap>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { saveTgroup, getTgroupById } from '@/api/tgroup'

export default {
  data () {
    return {
      mapLoading: false,
      settingTitle: '设置此处为坐标',
      lng: null,
      lat: null,
      currentWindow: {
        position: [0, 0],
        visible: false
      },
      events: {
        'rightclick': (e) => {
          this.settingTitle = '设置此处为坐标'
          const window = {}
          const position = []
          position.push(e.lnglat.lng)
          position.push(e.lnglat.lat)
          window.position = position
          window.visible = true
          this.currentWindow.visible = false
          this.$nextTick(() => {
            this.currentWindow = window
          })
          this.markers.push(position)
        }
      },
      plugin: [
        {
          pName: 'ToolBar'
        },
        {
          pName: 'MapType',
          defaultType: 0
        }
      ],
      markers: [],
      searchOption: {
        city: '上海',
        citylimit: false
      },
      mapCenter: [121.31807429194453, 31.0983702620479],
      maskClosable: false,
      title: this.$t('tgroup.tgroup'),
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 }
      },
      status: [
        {
          key: 0,
          val: this.$t('common.no')
        },
        {
          key: 1,
          val: this.$t('common.yes')
        }
      ],
      id: null,
      tgroupId: null,
      isEdit: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  methods: {
    add (tgroupId) {
      this.title = this.$t('tgroup.newTgroup')
      this.visible = true
      if (tgroupId >= 0) {
        this.tgroupId = tgroupId
      }
    },
    edit (tgroup) {
      this.mapLoading = true
      this.title = this.$t('tgroup.editTgroup')
      this.visible = true
      this.id = tgroup.key
      tgroup.name = tgroup.title
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(tgroup, 'name'))
      })
      this.getTgroupById(tgroup.key)
    },
    handleSubmit () {
      if (this.lat == null || this.lng === null) {
        this.$message.error('请右键地图，设置坐标')
        return
      }
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (this.id !== null) {
            params.id = this.id
          }
          if (this.tgroupId !== null) {
            params.tgroupId = this.tgroupId
          }
          params.lat = this.lat
          params.lng = this.lng
          saveTgroup(params).then(res => {
            console.log(res)
            if (res.success === true) {
              this.visible = false
              this.$emit('ok', res.result)
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
                duration: 4
              })
            }

            this.confirmLoading = false
          }, () => {
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    onSearchResult (pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
          this.markers.push([poi.lng, poi.lat])
        })
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    onClick () {
      this.lng = this.currentWindow.position[0]
      this.lat = this.currentWindow.position[1]
      this.$message.info('设置坐标成功！')
      this.currentWindow.visible = false
    },
    getTgroupById (id) {
      getTgroupById(id).then(res => {
        if (res.success === true) {
          const lngs = res.result.lng
          const lats = res.result.lat
          if (lngs !== '' && lats !== '') {
            this.lng = lngs
            this.lat = lats
            this.mapCenter = [lngs, lats]
            this.markers.push([lngs, lats])
            this.currentWindow.position = [lngs, lats]
            this.currentWindow.visible = true
            this.settingTitle = '当前坐标'
          }
        }
        this.mapLoading = false
      })
    }
  }
}
</script>
<style>
  .amap-demo {
    height: 500px;
    width: 100%;
    margin-top: -40px;
  }

  .search-box {
    position: absolute;
    top: 10px;
    left: 85px;
  }

  .amap-page-container {
    height: 500px;
    width: 100%;
    position: relative;
  }
</style>
