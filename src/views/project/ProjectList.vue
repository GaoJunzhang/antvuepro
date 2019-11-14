<template>
  <div class="content" :style="{height:'100%', paddingBottom:'20px'}">
    <a-layout :style="{height:'100%'}">
      <mgroup-tree ref="mgroup" @mgroupChange="handleMgroupChange"></mgroup-tree>
      <a-layout-content :style="{padding:'0 24px', height:'100%'}">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="16">
              <a-col span="8">
                <a-form-item :label="$t('project.name')">
                  <a-input
                    v-model="queryParam.name"
                    :placeholder="$t('project.projectPlaceholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col span="8">
                <a-form-item :label="$t('common.status')">
                  <a-select
                    v-model="queryParam.audit"
                    :placeholder="$t('common.choosePlaceholder')"
                    default-value
                  >
                    <a-select-option value>{{ $t('common.all') }}</a-select-option>
                    <a-select-option value="0">{{ $t('project.auditEdit') }}</a-select-option>
                    <a-select-option value="1">{{ $t('project.auditFail') }}</a-select-option>
                    <a-select-option value="2">{{ $t('project.auditWait') }}</a-select-option>
                    <a-select-option value="3">{{ $t('project.auditPassed') }}</a-select-option>
                    <a-select-option value="4">{{ $t('project.auditCancel') }}</a-select-option>
                    <a-select-option value="5">{{ $t('project.auditOutdata') }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <template v-if="advanced">
                <a-col span="8">
                  <a-form-item :label="$t('project.client')">
                    <a-input
                      v-model="queryParam.clientName"
                      :placeholder="$t('project.clientPlaceholder')"
                    />
                  </a-form-item>
                </a-col>
                <a-col span="8">
                  <a-form-item :label="$t('project.saler')">
                    <a-input
                      v-model="queryParam.salerName"
                      :placeholder="$t('project.salerPlaceholder')"
                    />
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
                    @click="() => queryParam = {}"
                  >{{ $t('common.reset') }}</a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator">
          <a-button
            v-action:project:add
            type="primary"
            icon="plus"
            @click="handleNew()"
          >{{ $t('common.new') }}</a-button>
          <a-button
            v-action:project:edit
            type="primary"
            :disabled="selectedRowKeys.length !== 1"
            icon="edit"
            @click="handleEdit()"
          >{{ $t('common.edit') }}</a-button>
          <a-button
            v-action:project:del
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="delete"
            @click="handleDelete()"
          >{{ $t('common.del') }}</a-button>
          <a-button
            v-action:project:audit
            type="primary"
            :disabled="selectedRowKeys.length !== 1"
            icon="audit"
            @click="handleAudit()"
          >{{ $t('project.audit') }}</a-button>
        </div>

        <s-table
          ref="table"
          size="default"
          row-key="id"
          :columns="columns"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
        >
          <span slot="audit" slot-scope="text, record">
            <a-tag
              v-if="text === 0"
              color="#108ee9"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditEdit') }}</a-tag>
            <a-tag
              v-if="text === 1"
              color="#f50"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditFail') }}</a-tag>
            <a-tag
              v-if="text === 2"
              color="#108ee9"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditWait') }}</a-tag>
            <a-tag
              v-if="text === 3"
              color="#87d068"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditPassed') }}</a-tag>
            <a-tag
              v-if="text === 4"
              color="#f50"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditCancel') }}</a-tag>
            <a-tag
              v-if="text === 5"
              color="#f50"
              @click="showAuditRecord(record.id)"
            >{{ $t('project.auditOutdate') }}</a-tag>
          </span>
          <span slot="validDate" slot-scope="text, record">
            <span v-if="text.length>0 || record.end.length>0">{{ text }} ~ {{ record.end }}</span>
            <span v-else>{{ $t('common.empty') }}</span>
          </span>
        </s-table>
      </a-layout-content>
    </a-layout>
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
    <a-drawer
      :title="$t('project.auditRecord')"
      placement="right"
      :closable="false"
      @close="onAuditRecordClose"
      :visible="auditRecordVisible"
    >
      <a-timeline :pending="loadingAuditRecord">
        <a-timeline-item
          v-for="record in auditRecord"
          :key="record.id"
          :color="filterTimeLineColor(record.audit)"
        >
          <p>{{ record.createTime }}</p>
          <p v-if="record.audit === 0">{{ record.userName }}{{ $t('project.auditEdit') }}</p>
          <p v-if="record.audit === 1">{{ record.userName }}{{ $t('project.auditFail') }}</p>
          <p v-if="record.audit === 2">{{ record.userName }}{{ $t('project.auditSubmit') }}</p>
          <p v-if="record.audit === 3">{{ record.userName }}{{ $t('project.auditPass') }}</p>
          <p v-if="record.audit === 4">{{ record.userName }}{{ $t('project.auditCancel') }}</p>
          <p v-if="record.audit === -1">{{ $t('common.noRecord') }}</p>
          <p v-if="record.remark && record.remark.length > 0">{{ record.remark }}</p>
        </a-timeline-item>
      </a-timeline>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getProjectList, delProject, auditProjectRecords } from '@/api/project'
import MgroupTree from '../mgroup/MgroupTree'
import ProjectAudit from './ProjectAudit'

export default {
  name: 'ProjectList',
  components: {
    STable,
    MgroupTree,
    ProjectAudit
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
          title: this.$t('project.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('common.validDate'),
          dataIndex: 'start',
          sorter: false,
          scopedSlots: { customRender: 'validDate' }
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'audit',
          align: 'center',
          sorter: true,
          scopedSlots: { customRender: 'audit' }
        },
        {
          title: this.$t('project.client'),
          dataIndex: 'clientName',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('project.saler'),
          dataIndex: 'salerName',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('user.userName'),
          dataIndex: 'userName',
          align: 'center',
          sorter: false
        },
        {
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        }
      ],

      loadData: parameter => {
        this.queryParam.mgroupId = this.$refs.mgroup.getSelected()
        return getProjectList(Object.assign(parameter, this.queryParam))
          .then(res => {
            this.$refs.table.clearSelected()
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
    handleEdit () {
      this.$router.push({ name: 'projectEdit', params: { id: this.selectedRowKeys[0] } })
    },
    handleNew () {
      this.$router.push({ name: 'projectEdit', params: { mgroupId: this.$refs.mgroup.getSelected() } })
    },
    handleAudit () {
      this.current = 'ProjectAudit'
      this.$nextTick(() => {
        this.$refs.model.audit(this.selectedRowKeys, this.selectedRows)
      })
    },
    handleDelete () {
      var that = this
      this.$confirm({
        title: this.$t('project.delTitle', [this.selectedRowKeys.length]),
        content: this.$t('task.delContent'),
        okType: 'danger',
        onOk () {
          return delProject(that.selectedRowKeys).then(res => {
            if (res.code === 200) {
              that.$refs.table.clearSelected()
              that.$refs.table.refresh()
            } else {
              that.$notification['error']({
                message: that.$t('common.error'),
                description: res.message || that.$t('common.tryLater'),
                duration: 4
              })
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    handleOk () {
      this.current = ''
      this.$refs.table.refresh()
    },
    handleClose () {
      this.current = ''
    },
    handleMgroupChange (mgroup) {
      this.$refs.table.refresh(true)
    },
    showAuditRecord (id) {
      this.auditRecordVisible = true
      this.loadingAuditRecord = this.$t('common.loading')
      this.auditRecord = []
      auditProjectRecords(id)
        .then(res => {
          if (res.code === 200) {
            this.auditRecord = res.result
          } else {
            this.auditRecord = [{
              audit: -1
            }]
          }

          this.loadingAuditRecord = false
        }, () => {
          this.auditRecord = [{
            audit: -1
          }]
          this.loadingAuditRecord = false
        })
    },
    onAuditRecordClose () {
      this.auditRecordVisible = false
      this.auditRecord = []
    },
    filterTimeLineColor (audit) {
      var colors = ['green', 'blue', 'red']
      if (audit < 0 || audit >= colors.length) {
        return 'blue'
      }

      return colors[audit]
    }
  },
  watch: {

  }
}
</script>
