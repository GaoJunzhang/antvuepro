<template>
  <a-drawer
    :title="$t('terminal.task') "
    placement="right"
    :closable="false"
    @close="() => visible=false"
    :confirmLoading="confirmLoading"
    :visible="visible"
    :width="650"
  >
    <div :style="{height:'100%', paddingBottom:'20px'}">
      <a-layout :style="{height:'100%', background: 'white'}">
        <mgroup-tree ref="mgroup" :editable="false" @mgroupChange="handleMgroupChange"></mgroup-tree>
        <a-layout-content :style="{padding:'0 24px', height:'100%'}">
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
            :loading="dataLoading"
            :pagination="pagination"
            :dataSource="data"
          >
            <a-list-item
              class="list-item-meta"
              slot="renderItem"
              slot-scope="item, index"
              @click.stop="onCheckTask(index, item)"
            >
              <div class="meta-pic">
                <div class="check">
                  <a-checkbox style="vertical-align: middle" :checked="item.check"></a-checkbox>
                </div>
              </div>
              <div class="meta-content">
                <div class="title">{{ item.name }}</div>
                <div class="description">
                  <span>{{ $t('common.validDate') }}:{{ item.start }}~{{ item.end }}</span>
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
        <a-button @click="onReturnTerminal" type="primary">{{ $t('common.ok') }}</a-button>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { STable } from '@/components'
import { getTaskList } from '@/api/task'
import MgroupTree from '../../mgroup/MgroupTree'
export default {
  components: {
    STable,
    MgroupTree
  },
  data () {
    return {
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
      dataLoading: false,
      data: [],
      visible: false,
      confirmLoading: false,
      queryParam: {},
      checkedTasks: [],
      multi: true
    }
  },
  methods: {
    show () {
      this.visible = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    handleMgroupChange (mgroup) {
      this.loadData()
    },
    loadData () {
      this.queryParam.mgroupId = this.$refs.mgroup.getSelected()
      var params = Object.assign({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        audit: 0
      }, this.queryParam)
      this.dataLoading = true
      getTaskList(params)
        .then(res => {
          this.pagination.total = res.result.totalCount
          this.pagination.current = res.result.pageNo
          this.data = []
          res.result.data.forEach(task => {
            const exist = this.checkedTasks.findIndex(item => item.id === task.id)
            task.check = (exist >= 0)
            this.data.push(task)
          })
          this.dataLoading = false
        })
    },
    onReturnTerminal () {
      if (this.checkedTasks.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.chooseMediaError'),
          duration: 4
        })
        return
      }
      this.$emit('returnTask', this.checkedTasks)
      this.visible = false
    },
    onCheckTask (idx, task) {
      this.data[idx].check = !this.data[idx].check
      const exist = this.checkedTasks.findIndex(item => item.id === task.id)
      if (exist < 0) {
        if (this.data[idx].check) {
          if (!this.multi) {
            this.checkedTasks = []
            this.data.forEach(item => {
              if (item.id === task.id) {
                item.check = false
              }
            })
          }
          this.checkedTasks.push(task)
        }
      } else {
        if (!this.data[idx].check) {
          this.checkedTasks.splice(exist, 1)
        }
      }
    }
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
</style>
