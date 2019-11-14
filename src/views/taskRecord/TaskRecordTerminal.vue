<template>
  <a-drawer
    :title="$t('taskRecord.recordTerminalList')"
    placement="right"
    :width="450"
    :closable="false"
    :visible="terminalDrawerShow"
    @close="onCloseTerminalDrawer"
  >
    <div :style="{height:'100%', paddingBottom:'20px'}">
      <a-layout :style="{height:'100%', background: 'white'}">
        <a-layout-content :style="{padding:'12px 24px 24px 24px', height:'100%'}">
          <div class="table-page-search-wrapper">
            <a-form layout="inline">
              <a-row :gutter="16">
                <a-col span="16">
                  <a-form-item :label="$t('taskRecord.terminalName')">
                    <a-input
                      v-model="queryParam.name"
                      :placeholder="$t('taskRecord.terminalNamePlaceholder')"
                    />
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
            :dataSource="terminals"
            :loading="dataLoading"
          >
            <a-list-item class="list-item-meta" slot="renderItem" slot-scope="item">
              <div class="meta-content">
                <div class="title">{{ item.name }}</div>
                <div class="description">
                  <span>{{ $t('terminal.mac') }}：{{ item.mac }}&#12288;&#12288;</span>
                  <span>{{ $t('terminal.tgroupName') }}：{{ item.tgroupName }}</span>
                </div>
              </div>
              <div class="meta-pic">
                <a-tag v-if="item.status === 0" color="red">{{ $t('taskRecord.notSend') }}</a-tag>
                <a-tag v-if="item.status === 1" color="green">{{ $t('taskRecord.send') }}</a-tag>
              </div>
            </a-list-item>
          </a-list>
        </a-layout-content>
      </a-layout>
    </div>
  </a-drawer>
</template>

<script>
import { taskRecordTerminals } from '@/api/taskRecord'

export default {
  components: {
  },
  data () {
    return {
      terminalDrawerShow: false,
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
      terminals: [],
      dataLoading: false,
      taskRecordId: 0
    }
  },
  watch: {

  },
  methods: {
    loadData () {
      var params = Object.assign({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        id: this.taskRecordId
      }, this.queryParam)
      this.dataLoading = true
      taskRecordTerminals(params)
        .then(res => {
          this.pagination.total = res.result.totalCount
          this.pagination.current = res.result.pageNo
          this.terminals = []
          res.result.data.forEach(terminal => {
            this.terminals.push(terminal)
          })
          this.dataLoading = false
        })
    },
    show (id) {
      this.pagination.current = 1
      this.taskRecordId = id
      this.terminalDrawerShow = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onCloseTerminalDrawer () {
      this.terminalDrawerShow = false
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
    width: 50px;
  }

  .meta-content {
    flex: 1 0;

    .title {
      color: rgba(0, 0, 0, 1);
      margin-bottom: 4px;
      font-size: 16px;
      line-height: 22px;
      font-weight: 400;
      width: 300px;
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
