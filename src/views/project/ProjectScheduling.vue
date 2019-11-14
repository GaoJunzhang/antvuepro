<template>
  <div class="content" :style="{height:'100%', paddingBottom:'20px'}">
    <a-layout :style="{height:'100%'}">
      <tgroup-tree :editable="false" ref="tgroup" @tgroupChange="handleTgroupChange"></tgroup-tree>
      <a-layout-content :style="{padding:'0 24px', height:'100%'}">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col span="14">
                <a-form-item :label="$t('project.timeSection')">
                  <a-range-picker
                    style="width:280px"
                    v-model="queryParam.date"
                    :defaultValue="[moment(), moment().add(7, 'days')]"
                  />
                </a-form-item>
              </a-col>
              <a-col span="10">
                <a-form-item :label="$t('terminal.mac')">
                  <a-input v-model="queryParam.mac" :placeholder="$t('project.macPlaceholder')" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col span="14">
                <a-form-item :label="$t('common.name')">
                  <a-input
                    v-model="queryParam.name"
                    :placeholder="$t('project.terminalNamePlaceholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col span="10">
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
                    @click="() => queryParam = {date:[moment(), moment().add(7, 'days')]}"
                  >{{ $t('common.reset') }}</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator">
          <a-button
            v-action:project:exportVacancy
            type="primary"
            icon="file-excel"
            @click="exportVacancy()"
          >{{ $t('project.exportEmptyExcel') }}</a-button>
        </div>

        <s-table
          ref="table"
          row-key="id"
          bordered
          :data="loadData"
          :columns="columns"
          :dataSource="datas"
          :scroll="tableScroll"
        >
          <template slot="adCnt" slot-scope="text">
            <span v-if="text">{{ text }}</span>
            <span v-else>0/0/0</span>
          </template>
          <template slot="projectName" slot-scope="text">
            <span
              class="project-name"
              v-if="text && text.endsWith('(w)')"
              style="color:grey"
              :title="text.substring(0, text.length-3)"
            >{{ text.substring(0, text.length-3) }}</span>
            <span class="project-name" v-else style="color:black" :title="text">{{ text }}</span>
          </template>
        </s-table>
      </a-layout-content>
    </a-layout>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </div>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'
import { projectSchedulingList } from '@/api/project'
import TgroupTree from '../tgroup/TgroupTree'
import ExportVacancy from './modules/ExportVacancy'

export default {
  name: 'ProjectList',
  components: {
    TgroupTree,
    STable,
    ExportVacancy
  },
  data () {
    return {
      current: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      columns: [],
      tableScroll: { x: 1600 },
      datas: [],
      loadingData: false
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    moment,
    loadData (parameter) {
      if (this.$refs.tgroup) {
        this.queryParam.tgroupId = this.$refs.tgroup.getSelected()
      }

      const param = Object.assign(parameter, this.queryParam)
      param.start = this.queryParam.date ? this.queryParam.date[0].format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
      param.end = this.queryParam.date ? this.queryParam.date[1].format('YYYY-MM-DD') : moment().add(7, 'days').format('YYYY-MM-DD')
      delete param['date']
      return projectSchedulingList(param)
        .then(res => {
          this.renderColumns(res.result.adCount)
          return res.result
        })
    },
    renderColumns (adCount) {
      let start
      let end
      if (this.queryParam && this.queryParam.date) {
        start = this.queryParam.date[0]
        end = this.queryParam.date[1]
      }

      start = (start == null) ? moment() : moment(start)
      end = (end == null) ? moment().add(7, 'days') : moment(end)

      var columns = [
        { title: 'MAC', dataIndex: 'mac', width: 150, align: 'center', fixed: 'left' },
        { title: this.$t('common.name'), dataIndex: 'name', width: 150, align: 'center', fixed: 'left' }
      ]
      while (!start.isAfter(end)) {
        const day = start.format('YYYY-MM-DD')
        var children = [{ title: this.$t('project.adNum'), dataIndex: day + '_adCnt', align: 'center', width: 120, scopedSlots: { customRender: 'adCnt' } }]
        for (let i = 0; i < adCount; i++) {
          children.push({ title: i + 1, dataIndex: day + '_' + i, align: 'center', width: 120, scopedSlots: { customRender: 'projectName' } })
        }
        columns.push({ title: day, dataIndex: day, children: children })
        start.add(1, 'days')
      }
      this.tableScroll = { x: (120 * (adCount + 1) * (columns.length - 2)) + 310 }
      columns.push({ title: '', dataIndex: 'em' })
      this.columns = columns
    },
    exportVacancy () {
      this.current = 'ExportVacancy'
      this.$nextTick(() => {
        let start
        let end
        if (this.queryParam && this.queryParam.date) {
          start = this.queryParam.date[0]
          end = this.queryParam.date[1]
        }

        start = (start == null) ? moment() : moment(start)
        end = (end == null) ? moment().add(7, 'days') : moment(end)
        this.$refs.model.show(start, end, this.$refs.tgroup.getSelected())
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleTgroupChange (mgroup) {
      this.$refs.table.refresh()
    },
    handleOk () {
      this.current = ''
    },
    handleClose () {
      this.current = ''
    }
  }
}
</script>

<style scoped>
.project-name {
  width: 80px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
