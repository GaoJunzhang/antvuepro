<template>
  <div class="content" :style="{height:'100%', paddingBottom:'20px'}">
    <terminal-expand v-if="currView=='expand'" @back="() => currView='index'" :terminal="selectedRows[0]"></terminal-expand>
    <a-layout :style="{height:'100%'}" v-if="currView=='index'">
      <tgroup-tree ref="tgroup" @tgroupChange="handleTgroupChange"></tgroup-tree>
      <a-layout-content :style="{padding:'0 24px', height:'100%'}">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col span="8">
                <a-form-item :label="$t('tgroup.tgroup')">
                  <a-input
                    v-model="queryParam.tgroupName"
                    :placeholder="$t('tgroup.tgroupPlaceholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item :label="$t('terminal.name')">
                  <a-input v-model="queryParam.name" :placeholder="$t('terminal.name')" />
                </a-form-item>
              </a-col>
              <template v-if="advanced">
                <a-col span="8">
                  <a-form-item :label="$t('terminal.mac')">
                    <a-input v-model="queryParam.mac" :placeholder="$t('terminal.macPlaceholder')" />
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="!advanced && 6 || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
                >
                  <a-button
                    type="primary"
                    @click="$refs.table.refresh(true)"
                  >{{ $t('common.search') }}</a-button>
                  <a-button
                    style="margin-left: 8px"
                    @click="() => queryParam={}"
                  >{{ $t('common.reset') }}</a-button>
                  <a v-show="true" @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator">
          <a-button-group>
            <a-button
              v-action:terminal:rename
              :disabled="selectedRows.length!=1"
              @click="showRename"
            >
              <a-icon type="retweet" />
              {{ $t('terminal.rename') }}
            </a-button>
            <a-button
              v-action:terminal:tgroup
              :disabled="selectedRows.length<=0"
              @click="() => $refs.tgroupDrawer.show()"
            >
              <a-icon type="copy" />
              {{ $t('terminal.allotTgroup') }}
            </a-button>
            <a-button
              v-action:terminal:switch
              :disabled="selectedRows.length<=0"
              @click="$refs.switch.show()"
            >
              <a-icon type="login" />
              {{ $t('terminal.switchgear') }}
            </a-button>
            <a-button
              v-action:terminal:task
              :disabled="selectedRows.length<=0"
              @click="showTask(0)"
            >
              <a-icon type="right-circle" />
              {{ $t('terminal.task') }}
            </a-button>
            <a-button
              v-action:terminal:addPlayer
              :disabled="selectedRows.length<=0"
              @click="addPlayer(0)"
            >
              <a-icon type="play-circle" />
              {{ $t('terminal.addPlayer') }}
            </a-button>
            <a-button
              v-action:terminal:info
              :disabled="selectedRows.length<=0"
              @click="() => currView='expand'"
            >
              <a-icon type="info-circle" />
              {{ $t('terminal.info') }}
            </a-button>
            <a-button
              @click="exportTerminal"
              v-action:terminal:excel>
              <a-icon type="info-circle" />
              {{ $t('common.excel') }}
            </a-button>
          </a-button-group>
          <a-dropdown>
            <a-button v-action:terminal:otherAction :disabled="selectedRows.length<=0">
              {{ $t('terminal.otherAction') }}
              <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item v-action:terminal:checkTask>
                <a @click="showTaskCheck">{{ $t('terminal.checkTask') }}</a>
              </a-menu-item>
              <a-sub-menu :title="$t('terminal.props')" key="test">
                <a-menu-item v-action:terminal:maxMedia><a @click="showTerminalInfo(1)">{{ $t('terminal.maxMedia') }}</a></a-menu-item>
                <a-menu-item v-action:terminal:sim><a @click="showTerminalInfo(2)">{{ $t('terminal.sim') }}</a></a-menu-item>
                <a-menu-item v-action:terminal:suspension><a @click="showTerminalInfo(3)">{{ $t('terminal.suspension') }}</a></a-menu-item>
                <a-menu-item v-action:terminal:business><a @click="showTerminalInfo(4)">{{ $t('terminal.business') }}</a></a-menu-item>
                <a-menu-item v-action:terminal:grade><a @click="showTerminalInfo(5)">{{ $t('terminal.grade') }}</a></a-menu-item>
              </a-sub-menu>
              <a-menu-item v-action:terminal:checkTime>
                <a @click="onCheckTime(0)">{{ $t('terminal.checkTime') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:screen>
                <a>{{ $t('terminal.screen') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:reboot>
                <a @click="onReboot(0)">{{ $t('terminal.reboot') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:serverSet>
                <a @click="serverSet">{{ $t('terminal.serverSet') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:fileMng>
                <a @click="fileMng">{{ $t('terminal.fileMng') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:update>
                <a>{{ $t('terminal.update') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:defaultMedia>
                <a @click="addPlayer(1)">{{ $t('terminal.defaultMedia') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:defaultTask>
                <a @click="showTask(1)">{{ $t('terminal.defaultTask') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:changeDefaultTask>
                <a @click="changeDefaultTask">{{ $t('terminal.changeDefaultTask') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:city>
                <a @click="showWeatherCity">{{ $t('terminal.city') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:led>
                <a @click="showLed">{{ $t('terminal.led') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:taskExport>
                <a @click="showLed">{{ $t('terminal.taskExport') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:voice>
                <a @click="showVoice">{{ $t('terminal.voice') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:limit>
                <a @click="showLimit">{{ $t('terminal.limit') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:p2p>
                <a @click="showP2P">{{ $t('terminal.p2p') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:sync>
                <a @click="showLed">{{ $t('terminal.sync') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:infc>
                <a @click="showLed">{{ $t('terminal.infc') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:osd>
                <a @click="showLed">{{ $t('terminal.osd') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:custom>
                <a @click="showLed">{{ $t('terminal.custom') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:msg>
                <a @click="showLed">{{ $t('terminal.msg') }}</a>
              </a-menu-item>
              <a-menu-item v-action:terminal:mobile>
                <a @click="showLed">{{ $t('terminal.mobile') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-popover placement="bottom">
            <a-list :dataSource="allColums" slot="content">
              <a-list-item slot="renderItem" slot-scope="item">
                <a-checkbox @change="onCheckChange" :value="item" :checked="item.checked">{{ item.title }}</a-checkbox>
              </a-list-item>
            </a-list>
            <a-button style="margin-left: 8px"> {{ $t('terminal.otherColumn') }} <a-icon type="down" /> </a-button>
          </a-popover>
        </div>
        <s-table
          bordered
          ref="table"
          size="default"
          row-key="id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          :scroll="scroll"
        >
          <span slot="devState" slot-scope="text,record">
            <a-tag v-if="record.devState==1" color="#87d068">{{ $t('terminal.play') }}</a-tag>
            <a-tag v-if="record.devState==2" color="#f50">{{ $t('terminal.pause') }}</a-tag>
          </span>
          <span slot="connectStatus" slot-scope="text,record">
            <a-tag v-if="record.cstr==1" color="#87d068">{{ $t('terminal.online') }}</a-tag>
            <a-tag v-if="record.cstr==2" color="#f50">{{ $t('terminal.offline') }}</a-tag>
            <a-tag v-if="record.cstr==3" color="red">{{ $t('terminal.offlinemanydays') }}</a-tag>
          </span>
          <span slot="adTaskName" slot-scope="text,record">
            <span v-if="record.taskF == 0" style="color: green">{{ record.adTaskName }}</span>
            <span v-if="record.taskF == 1" style="color: red">{{ record.adTaskName }}</span>
          </span>
          <span slot="adCount" slot-scope="text,record">
            <span v-if="record.adCount != null && record.adUseCount < record.adCount" style="color: green;">{{ record.adUseCount }}/{{ record.adCount }}</span>
            <span v-if="record.adCount != null && record.adUseCount >= record.adCount" style="color: red">{{ record.adUseCount }}/{{ record.adCount }}</span>
          </span>
          <a-collapse slot="playContent" slot-scope="text,record" :bordered="false">
            <a-collapse-panel :header="$t('terminal.playContent')" :style="customStyle">
              <p v-for="item in record.playContentArry" :key="item">{{ item }}</p>
            </a-collapse-panel>
          </a-collapse>
          <a-tooltip :title="record.diskTitle" slot="diskSpace" slot-scope="text,record">
            <a-progress
              :percent="record.userDisk"
              type="circle"
              v-if="record.userDisk>=90"
              strokeColor="red"
              :width="50"
            />
            <a-progress
              :percent="record.userDisk"
              type="circle"
              v-if="record.userDisk>=60&&record.userDisk<90"
              strokeColor="blue"
              :width="50"
            />
            <a-progress
              :percent="record.userDisk"
              type="circle"
              v-if="record.userDisk<60"
              strokeColor="green"
              :width="50"
            />
          </a-tooltip>
        </s-table>
      </a-layout-content>
      <cmd-status ref="cmdStatus"></cmd-status>
    </a-layout>
    <a-modal :title="$t('terminal.rename')" v-model="visible" @ok="renameOk">
      <a-form :form="form" class="form" :loading="rloading">
        <a-form-item :label="$t('terminal.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            :placeholder="$t('terminal.namePlaceholder')"
            v-decorator="['name', {rules: [{required: true, max:64, message: this.$t('terminal.namePlaceholder')}]}]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <switchgear ref="switch"></switchgear>
    <task-list-modal ref="taskList" @returnTask="returnTask"></task-list-modal>
    <media-select ref="mediaSelect" @returnMedia="returnMedia"></media-select>
    <tgroup-drawer ref="tgroupDrawer" @allotTgroup="allotTgroup"></tgroup-drawer>
    <component ref="model" :is="currentModel" @ok="handleModelOk" @close="handleModelClose"></component>
  </div>
</template>

<script>
import TgroupTree from '../tgroup/TgroupTree'
import CmdStatus from './modules/CmdStatus'
import { STable } from '@/components'
import { terminalData, renameTerminal, updateTgroup, exportTerminal } from '@/api/terminal'
import Switchgear from './modules/Switchgear'
import TaskListModal from './modules/TaskListModal'
import TerminalExpand from './modules/TerminalExpand'
import MediaSelect from '../media/MediaSelect'
import TgroupDrawer from './modules/TgroupDrawer'
import TerReboot from './modules/cmd/TerReboot'
import TerTime from './modules/cmd/TerTime'
import TaskCheckModal from './modules/TaskCheckModal'
import TerminalInfo from './modules/TerminalInfo'
import TerminalServeSet from './modules/TerminalServeSet'
import FileMng from './modules/FileMng'
import ChangeDefaultTask from './modules/ChangeDefaultTask'
import City from './modules/City'
import Led from './modules/Led'
import VoiceSlider from './modules/VoiceSlider'
import DownLimit from './modules/DownLimit'
import P2P from './modules/P2P'
export default {
  components: {
    TgroupTree,
    CmdStatus,
    STable,
    Switchgear,
    TaskListModal,
    TerminalExpand,
    MediaSelect,
    TgroupDrawer,
    TerReboot,
    TerTime,
    TaskCheckModal,
    TerminalInfo,
    TerminalServeSet,
    FileMng,
    ChangeDefaultTask,
    City,
    Led,
    VoiceSlider,
    DownLimit,
    P2P
  },
  data () {
    return {
      playType: null,
      taskType: null,
      currentModel: '',
      customStyle: 'border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      currView: 'index',
      taskVisible: false,
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      rloading: false,
      advanced: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      scroll: { x: 1300 },
      allColums: [
        {
          title: this.$t('terminal.tgroupName'),
          dataIndex: 'tgroupName',
          width: 120,
          align: 'center',
          fixed: 'left',
          sorter: true,
          checked: true
        },
        {
          title: this.$t('common.name'),
          dataIndex: 'name',
          width: 120,
          align: 'center',
          fixed: 'left',
          sorter: true,
          checked: true
        },
        {
          title: this.$t('terminal.mac'),
          dataIndex: 'mac',
          align: 'center',
          sorter: true,
          checked: true
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'connectStatus',
          width: 60,
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'connectStatus' },
          checked: true
        },
        {
          title: this.$t('terminal.devState'),
          dataIndex: 'devState',
          width: 100,
          sorter: true,
          align: 'center',
          defaultSortOrder: 'descend',
          scopedSlots: { customRender: 'devState' },
          checked: true
        },
        {
          title: this.$t('terminal.diskSpace'),
          dataIndex: 'diskSpace',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'diskSpace' },
          checked: true
        },
        {
          title: this.$t('terminal.adTaskName'),
          dataIndex: 'adTaskName',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'adTaskName' },
          checked: true
        },
        {
          title: this.$t('terminal.adCount'),
          dataIndex: 'adCount',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'adCount' },
          checked: true
        },
        {
          title: this.$t('terminal.playContent'),
          dataIndex: 'playContent',
          align: 'center',
          scopedSlots: { customRender: 'playContent' },
          checked: true
        },
        {
          dataIndex: 'connectTime',
          title: this.$t('terminal.connectTime'),
          width: 200,
          align: 'center'
        },
        {
          dataIndex: 'disconnectTime',
          title: this.$t('terminal.disconnectTime'),
          width: 200,
          align: 'center'
        },
        {
          dataIndex: 'appVersion',
          title: this.$t('terminal.appVersion'),
          width: 200,
          align: 'center'
        },
        {
          dataIndex: 'systemVersion',
          title: this.$t('terminal.systemVersion'),
          width: 200,
          align: 'center'
        }
      ],
      columns: [],
      loadData: parameter => {
        this.queryParam.tgroupId = this.$refs.tgroup.getSelected()
        if (!parameter.sortField) {
          parameter.sortField = 'connectStatus'
          parameter.sortOrder = 'descend'
        }
        return terminalData(Object.assign(parameter, this.queryParam))
          .then(res => {
            this.$refs.table.clearSelected()
            res.result.data.forEach(function (t) {
              if (t.useableSpace !== null && t.useableSpace !== '') {
                t.diskTitle = '总空间' + t.diskSpace + ',已用' + t.useableSpace
                t.userDisk = (parseFloat(t.useableSpace) / parseFloat(t.diskSpace)).toFixed(2) * 100
              }
              if (t.playContent !== null && t.playContent !== '') {
                var obj = JSON.parse(t.playContent)
                const arr = []
                for (var key in obj) {
                  arr.push(obj[key])
                }
                t.playContentArry = arr
              }
              if (t.adTaskName !== null) {
                if (t.adTaskName === t.sendTaskName) {
                  t.taskF = 0
                } else {
                  t.taskF = 1
                }
              }
              if (t.connectStatus === 1) {
                t.cstr = 1
              }
              if (t.connectStatus === 0) {
                if (t.disconnectTime.trim().length > 0) {
                  var today = new Date()
                  var date1 = new Date(t.disconnectTime)
                  if ((today - date1) < 3 * 24 * 60 * 60 * 1000) {
                    t.cstr = 2
                  } else {
                    t.cstr = 3
                  }
                }
              }
            })
            res.result.pageNo += 1
            return res.result
          })
      }
    }
  },
  methods: {
    handleTgroupChange (v) {
      this.$refs.table.refresh(true)
    },
    handleEdit () { },
    handleDelete () { },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showRename () {
      this.visible = true
      this.rloading = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: this.selectedRows[0].name
        })
      })
      this.rloading = false
    },
    renameOk () {
      const { form: { validateFields } } = this
      this.rloading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.id = this.selectedRowKeys[0]
          renameTerminal(params).then(res => {
            if (res.success === true) {
              this.visible = false
              this.$message.info('保存成功')
              this.$refs.table.refresh(true)
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.message || this.$t('common.tryLater'),
                duration: 4
              })
            }

            this.rloading = false
          }, () => {
            this.rloading = false
          })
        } else {
          this.rloading = false
        }
      })
    },
    allotTgroup (v) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请选择终端')
        return
      }
      updateTgroup({ ids: this.selectedRowKeys, tgroupId: v }).then(res => {
        if (res.success === true) {
          this.$message.info('分组成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    returnTask (v) {
      if (this.taskType === 0) {
        console.log('下发任务', v)
      }
      if (this.taskType === 1) {
        console.log('默认任务', v)
      }
    },
    returnMedia (v) {
      if (this.playType === 0) {
        console.log('插播文件', v)
      }
      if (this.playType === 1) {
        console.log('默认片源', v)
      }
    },
    handleModelOk (result) {
      switch (this.currentModel) {
        case 'TerReboot':
        case 'TerTime':
          this.$refs.cmdStatus.show(result.opNo)
          break
        case 'City':
          console.log('选择的城市', result)
      }
      this.currentModel = ''
    },
    handleModelClose () {
      this.currentModel = ''
    },
    onCheckTime (type) {
      this.currentModel = 'TerTime'
      this.$nextTick(() => {
        this.$refs.model.show(type === 1 ? this.$refs.tgroup.getSelected() : null, type === 1 ? null : this.selectedRowKeys)
      })
    },
    onReboot (type) {
      this.currentModel = 'TerReboot'
      this.$nextTick(() => {
        this.$refs.model.show(type === 1 ? this.$refs.tgroup.getSelected() : null, type === 1 ? null : this.selectedRowKeys)
      })
    },
    onCheckChange (e) {
      var columnObj = e.target.value
      if (e.target.checked) {
        columnObj.checked = true
        if (columnObj.width) {
          this.scroll.x += columnObj.width
        }
        this.columns.push(columnObj)
      } else {
        columnObj.checked = false
        this.columns.splice(this.columns.findIndex(item => item.dataIndex === columnObj.dataIndex), 1)
        if (columnObj.width) {
          this.scroll.x -= columnObj.width
        }
      }
      this.allColums.splice(this.allColums.findIndex(item => item.dataIndex === columnObj.dataIndex), 1, columnObj)
    },
    exportTerminal () {
      this.queryParam.tgroupId = this.$refs.tgroup.getSelected()
      exportTerminal(this.queryParam).then(res => {
        if (res.code === 200) {
          window.open(res.result.url)
          this.visible = false
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.message || this.$t('common.tryLater'),
            duration: 4
          })
        }
      })
    },
    showTaskCheck () {
      this.currentModel = 'TaskCheckModal'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showTerminalInfo (flag) {
      this.currentModel = 'TerminalInfo'
      this.$nextTick(() => {
        this.$refs.model.show(flag)
      })
    },
    serverSet () {
      const terminalId = this.selectedRowKeys[0]
      this.currentModel = 'TerminalServeSet'
      this.$nextTick(() => {
        this.$refs.model.show(terminalId)
      })
    },
    fileMng () {
      this.currentModel = 'FileMng'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    addPlayer (flag) {
      this.playType = flag
      this.$refs.mediaSelect.show('0,1', true)
    },
    showTask (flag) {
      this.taskType = flag
      this.$refs.taskList.show('0,1', true)
    },
    changeDefaultTask () {
      this.currentModel = 'ChangeDefaultTask'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showWeatherCity () {
      this.currentModel = 'City'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showLed () {
      this.currentModel = 'Led'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showVoice () {
      this.currentModel = 'VoiceSlider'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showLimit () {
      this.currentModel = 'DownLimit'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    showP2P () {
      this.currentModel = 'P2P'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    }
  },
  created () {
    this.allColums.forEach(item => {
      if (item.checked) {
        this.columns.push(item)
      }
    })
  }
}
</script>

<style scoped>
</style>
