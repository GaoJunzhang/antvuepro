<template>
  <div class="content" :style="{height:'100%', paddingBottom:'20px'}">
    <a-layout :style="{height:'100%'}">
      <a-layout-content :style="{padding:'0 24px', height:'100%'}">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col span="8">
                <a-form-item :label="$t('taskRecord.sendUser')">
                  <a-input
                    v-model="queryParam.userName"
                    :placeholder="$t('taskRecord.sendUserPlaceholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item :label="$t('taskRecord.type')">
                  <a-select
                    v-model="queryParam.type"
                    :placeholder="$t('common.choosePlaceholder')"
                    default-value
                  >
                    <a-select-option value>{{ $t('common.all') }}</a-select-option>
                    <a-select-option value="0">{{ $t('taskRecord.typeTask') }}</a-select-option>
                    <a-select-option value="1">{{ $t('taskRecord.typeDefaultTask') }}</a-select-option>
                    <a-select-option value="2">{{ $t('taskRecord.typeAddMedia') }}</a-select-option>
                    <a-select-option value="3">{{ $t('taskRecord.typeRemoveMedia') }}</a-select-option>
                    <a-select-option value="4">{{ $t('taskRecord.typeInsertMedia') }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <template v-if="advanced"></template>
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
                    @click="() => queryParam = {}"
                  >{{ $t('common.reset') }}</a-button>
                  <a v-show="false" @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator"></div>

        <s-table
          ref="table"
          size="default"
          row-key="id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
        >
          <template slot="name" slot-scope="text, record">
            <span style="cursor: pointer" @click="showTaskRecordMedia(record.id)">{{ text }}</span>
          </template>
          <span slot="validDate" slot-scope="text, record">
            <span v-if="text.length>0 || record.end.length>0">{{ text }} ~ {{ record.end }}</span>
            <span v-else>{{ $t('common.empty') }}</span>
          </span>
          <template slot="type" slot-scope="text">
            <span v-if="text === 0">{{ $t('taskRecord.typeTask') }}</span>
            <span v-else-if="text === 1">{{ $t('taskRecord.typeDefaultTask') }}</span>
            <span v-else-if="text === 2">{{ $t('taskRecord.typeAddMedia') }}</span>
            <span v-else-if="text === 3">{{ $t('taskRecord.typeRemoveMedia') }}</span>
            <span v-else-if="text === 4">{{ $t('taskRecord.typeInsertMedia') }}</span>
          </template>
          <template slot="terminalCnt" slot-scope="text, record">
            <a-badge
              @click="showTaskRecordTerminal(record.id)"
              :count="text"
              :numberStyle="{backgroundColor: 'grey', cursor: 'pointer'} "
            ></a-badge>
          </template>
        </s-table>
      </a-layout-content>
    </a-layout>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </div>
</template>

<script>
import { STable } from '@/components'
import TaskRecordTerminal from './TaskRecordTerminal'
import TaskRecordMedia from './TaskRecordMedia'
import { getTaskRecordList } from '@/api/taskRecord'

export default {
  name: 'TaskRecordList',
  components: {
    STable,
    TaskRecordTerminal,
    TaskRecordMedia
  },
  data () {
    return {
      current: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: this.$t('taskRecord.sendTime'),
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        },
        {
          title: this.$t('taskRecord.sendUser'),
          dataIndex: 'userName',
          align: 'center'
        },
        {
          title: this.$t('taskRecord.type'),
          dataIndex: 'type',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'type' }
        },
        {
          title: this.$t('task.name'),
          dataIndex: 'name',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: this.$t('common.validDate'),
          dataIndex: 'start',
          sorter: false,
          align: 'center',
          scopedSlots: { customRender: 'validDate' }
        },
        {
          title: this.$t('taskRecord.terminalCnt'),
          dataIndex: 'terminalCnt',
          align: 'center',
          sorter: false,
          scopedSlots: { customRender: 'terminalCnt' }
        }
      ],

      loadData: parameter => {
        return getTaskRecordList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.result
          })
      },

      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false,
      auditRecordVisible: false,
      loadingAuditRecord: false,
      auditRecord: []
    }
  },
  filters: {
  },
  created () {

  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.current = ''
    },
    handleClose () {
      this.current = ''
    },
    showTaskRecordMedia (id) {
      this.current = 'TaskRecordMedia'
      this.$nextTick(() => {
        this.$refs.model.show(id)
      })
    },
    showTaskRecordTerminal (id) {
      this.current = 'TaskRecordTerminal'
      this.$nextTick(() => {
        this.$refs.model.show(id)
      })
    }
  },
  watch: {

  }
}
</script>
