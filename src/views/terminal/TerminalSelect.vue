<template>
  <a-drawer
    :title="$t('terminal.terminalSelect')"
    placement="right"
    :width="800"
    :closable="false"
    :visible="terminalDrawerShow"
    @close="onCloseTerminalDrawer"
  >
    <div :style="{height:'100%', paddingBottom:'20px'}">
      <a-layout :style="{height:'100%', background: 'white'}">
        <tgroup-tree ref="tgroup" :editable="false" @tgroupChange="handleTgroupChange"></tgroup-tree>
        <a-layout-content :style="{padding:'12px 24px 24px 24px', height:'100%'}">
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
                  <a-button @click="checkAll()">{{ $t('common.checkAll') }}</a-button>
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
            <a-list-item
              class="list-item-meta"
              slot="renderItem"
              slot-scope="item, index"
              @click.stop="onCheckTerminal(index, item)"
            >
              <div class="meta-pic">
                <div class="check">
                  <a-checkbox style="vertical-align: middle" :checked="item.check"></a-checkbox>
                </div>
              </div>
              <div class="meta-content">
                <div class="title">{{ item.name }}</div>
                <div class="description">
                  <span>{{ $t('terminal.mac') }}：{{ item.mac }}&#12288;&#12288;</span>
                  <span>{{ $t('terminal.tgroupName') }}：{{ item.tgroupName }}</span>
                </div>
                <div class="description">
                  <span>{{ $t('terminal.adCount') }}：{{ item.adUseCount }}/{{ item.adCount }}</span>
                </div>
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
import TgroupTree from '../tgroup/TgroupTree'
import { terminalData } from '@/api/terminal'

export default {
  components: {
    TgroupTree
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
      checkedTerminals: [],
      dataLoading: false,
      multi: true
    }
  },
  watch: {

  },
  methods: {
    loadData () {
      this.queryParam.tgroupId = this.$refs.tgroup.getSelected()
      var params = Object.assign({
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }, this.queryParam)
      this.dataLoading = true
      terminalData(params)
        .then(res => {
          this.pagination.total = res.result.totalCount
          this.pagination.current = res.result.pageNo + 1
          this.terminals = []
          res.result.data.forEach(terminal => {
            const exist = this.checkedTerminals.findIndex(item => item.id === terminal.id)
            terminal.check = (exist >= 0)
            this.terminals.push(terminal)
          })
          this.dataLoading = false
        })
    },
    show (multi) {
      this.multi = multi
      this.checkedTerminals = []
      this.terminalDrawerShow = true
      this.$nextTick(() => {
        this.loadData()
      })
    },
    onCloseTerminalDrawer () {
      this.terminalDrawerShow = false
    },
    handleTgroupChange (tgroup) {
      this.loadData()
    },
    onReturnTerminal () {
      if (this.checkedTerminals.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.chooseTerminalError'),
          duration: 4
        })
        return
      }

      this.$emit('returnTerminal', this.checkedTerminals)
      this.terminalDrawerShow = false
    },
    onCheckTerminal (idx, terminal) {
      this.terminals[idx].check = !this.terminals[idx].check
      const exist = this.checkedTerminals.findIndex(item => item.id === terminal.id)
      if (exist < 0) {
        if (this.terminals[idx].check) {
          if (!this.multi) {
            this.checkedTerminals = []
            this.terminals.forEach(item => {
              if (item.id !== terminal.id) {
                item.check = false
              }
            })
          }
          this.checkedTerminals.push(terminal)
        }
      } else {
        if (!this.terminals[idx].check) {
          this.checkedTerminals.splice(exist, 1)
        }
      }
    },
    checkAll () {
      this.terminals.forEach(terminal => {
        terminal.check = true
        const exist = this.checkedTerminals.findIndex(item => item.id === terminal.id)
        if (exist < 0) {
          this.checkedTerminals.push(terminal)
        }
      })
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
