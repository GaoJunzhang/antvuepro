<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="630"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin tip="努力加载中···" :spinning="spinning">
      <a-row>
        <a-col :span="24">
          <a-input placeholder="字幕名称" v-model="fileName"/>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24" style="margin: 20px 0px">
          <mgroup-select-tree @change="handleChange" :mGroupId="mGroupId" :mGroupName="mGroupName"></mgroup-select-tree>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <div style="border:1px solid #D6DBD9">
            <a-popover
              title="字体"
              trigger="click"
              v-model="fsvisible"
              placement="bottom"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                defaultValue="宋体"
                class="aselect"
                @change="handleFamilyChange"
                :filterOption="filterOption"
                style="width: 100%"
                slot="content"
              >
                <a-select-option v-for="i in fontsFamily" :key="i.value">{{ i.name }}</a-select-option>
              </a-select>
              <a title="字体" style="margin-left: 10px">
                <a-icon type="highlight" />
              </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-popover
              title="字体大小"
              trigger="click"
              v-model="bvisible"
              placement="bottom"
            >
              <a-select
                showSearch
                optionFilterProp="children"
                defaultValue="16px"
                class="aselect"
                @change="handleSizeChange"
                :filterOption="filterOption"
                slot="content"
                style="width: 100%"
              >
                <a-select-option v-for="i in fonts" :key="i">{{ i }}</a-select-option>
              </a-select>
              <a title="大小">
                <a-icon type="font-size" />
              </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-popover
              title="颜色"
              placement="bottom"
              trigger="click"
            >
              <sketch-picker v-model="colors" slot="content" @input="updateValue"/>
              <a title="颜色">
                <a-icon type="font-colors" :style="fStyle"/>
              </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-popover
              title="背景色"
              placement="bottom"
              trigger="click"
            >
              <sketch-picker v-model="colors" slot="content" @input="updateBValue"/>
              <a title="背景色">
                <a-icon type="bg-colors" :style="bStyle" />
              </a>
            </a-popover>
            <a-divider type="vertical" />
            <a-icon title="清除样式" type="close" @click="resetStyle" />
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-textarea v-model="subtitleText" placeholder="字幕内容" :autosize="true" :style="subtitleStyle"/>
        <span v-show="false" ref="subTextares" id="subTextares" :style="subtitleStyle" >{{ subtitleText }}</span>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { saveSubtitle, getSutitleInfoById } from '@/api/media'
import { Sketch } from 'vue-color'
import MgroupSelectTree from './MgroupSelectTree'
export default {
  name: 'SubtitleForm',
  components: {
    'sketch-picker': Sketch,
    MgroupSelectTree
  },
  data () {
    return {
      spinning: false,
      bvisible: false,
      fsvisible: false,
      mediaId: '',
      mGroupId: '',
      mGroupName: '',
      fileName: '',
      subtitleText: '',
      maskClosable: false,
      title: '编辑字幕',
      confirmLoading: false,
      visible: false,
      fonts: [],
      fontsFamily: [
        {
          name: '宋体',
          value: 'SimSun'
        },
        {
          name: '黑体',
          value: 'SimHei'
        },
        {
          name: '微软雅黑',
          value: 'Microsoft Yahei'
        }
      ],
      colors: '#194d33',
      fStyle: {
        color: 'black'
      },
      bStyle: {
        background: 'white'
      },
      subtitleStyle: {
        'font-family': 'simsun',
        'color': '#000000',
        'height': '200px',
        'font-size': '16px',
        'background-color': '#ffffff'
      }
    }
  },
  methods: {
    show (flag, mediaId) {
      this.fStyle = {
        color: 'black'
      }
      this.bStyle = {
        background: 'white'
      }
      this.mediaId = mediaId
      if (flag === 0) {
        this.mGroupId = ''
        this.resetStyle()
        this.fileName = ''
        this.subtitleText = ''
      } else {
        this.spinning = true
        getSutitleInfoById({ id: mediaId }).then(res => {
          const data = res.result
          this.subtitleText = data.BR
          this.subtitleStyle['font-family'] = data.FontName
          this.subtitleStyle.color = data.FontColor
          this.subtitleStyle['background-color'] = data.BackColor
          this.subtitleStyle['font-size'] = data.FontSize
          this.fileName = data.fileName
          this.mGroupId = data.mGroupId
          this.mGroupName = data.mGroupName
          this.spinning = false
        })
      }
      this.visible = true
    },
    handleSubmit () {
      if (this.subtitleText === '') {
        this.$message.info('请输入字幕内容')
        return
      }
      if (this.fileName === '') {
        this.$message.info('请输入字幕名称')
        return
      }
      this.spinning = true
      const param = {}
      if (this.subtitleStyle['background-color']) {
        param.BackColor = this.subtitleStyle['background-color']
      }
      if (this.subtitleStyle.color) {
        param.FontColor = this.subtitleStyle.color
      }
      if (this.subtitleStyle['font-size']) {
        param.FontSize = this.subtitleStyle['font-size']
      }
      if (this.subtitleStyle['font-family']) {
        param.FontName = this.subtitleStyle['font-family']
      }
      param.subtitle = this.subtitleText
      param.fileName = this.fileName
      param.mGroupId = this.mGroupId
      param.subtitleHtml = document.getElementById('subTextares').outerHTML
      if (this.mediaId !== null) {
        param.id = this.mediaId
      }
      saveSubtitle(param).then(res => {
        if (res.success) {
          this.visible = false
          this.$emit('ok')
          this.$message.info('成功')
        }
        this.spinning = false
      })
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    handleSizeChange (v) {
      this.subtitleStyle['font-size'] = v
      this.bvisible = false
    },
    handleFamilyChange (v) {
      this.subtitleStyle['font-family'] = v
      this.fsvisible = false
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    initFontSizes () {
      for (let i = 9; i <= 72; i++) {
        this.fonts.push(i + 'px')
      }
    },
    updateValue (v) {
      this.fStyle.color = v.hex
      this.subtitleStyle.color = v.hex
    },
    updateBValue (v) {
      this.bStyle.background = v.hex
      this.subtitleStyle['background-color'] = v.hex
    },
    resetStyle () {
      this.subtitleStyle = {
        'font-family': 'simsun',
        'color': '#000000',
        'height': '200px',
        'font-size': '16px',
        'background-color': '#ffffff'
      }
    },
    handleChange (v) {
      this.mGroupId = v
    }
  },
  mounted () {
    this.initFontSizes()
  }
}
</script>
