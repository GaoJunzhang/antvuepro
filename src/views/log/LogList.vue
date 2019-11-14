<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="sform">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :label="$t('log.userName')">
              <a-input v-model="queryParam.userName" :placeholder="$t('log.userName')"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item :label="$t('common.validDate')">
              <a-range-picker @change="onChangeDate" />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col span="8">
              <a-form-item label="action">
                <a-input v-model="queryParam.action" placeholder="action"/>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 6 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">{{ $t('common.search') }}</a-button>
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
        v-action:log:info
        :disabled="selectedRows.length!=1"
        type="primary"
        icon="exclamation-circle"
        @click="logDetail"
      >{{ $t('common.detail') }}</a-button>
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
    </s-table>
    <log-detail ref="detail"></log-detail>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getLogData } from '@/api/log'
import LogDetail from './LogDetail'
import moment from 'moment'
export default {
  components: {
    STable,
    LogDetail
  },
  data () {
    return {
      advanced: false,
      form: this.$form.createForm(this),
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onChange
        }
      },
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          align: 'center',
          title: '用户',
          dataIndex: 'userName'
        },
        {
          align: 'center',
          title: 'status',
          dataIndex: 'status'
        },
        {
          title: 'action',
          align: 'center',
          dataIndex: 'action'
        },
        {
          align: 'center',
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          sorter: true
        }
      ],
      loadData: parameter => {
        return getLogData(Object.assign(parameter, this.queryParam)).then(res => {
          res.result.pageNo++
          return res.result
        })
      }
    }
  },
  methods: {
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    logDetail () {
      this.$refs.detail.show(this.selectedRows[0])
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onChangeDate (v) {
      this.queryParam.startDate = moment(v[0]).format('YYYY-MM-DD hh:mm:ss')
      this.queryParam.endDate = moment(v[1]).format('YYYY-MM-DD hh:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>
