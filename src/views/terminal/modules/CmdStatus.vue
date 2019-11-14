<template>
  <a-layout-sider
    width="230"
    :collapsed="!expand"
    collapsedWidth="30"
    style="background:#FFF"
    @collapse="onTgroupCollapse"
  >
    <a-card :title="$t('terminal.cmdStatus')" v-show="expand" style="height:100%">
      <a-button slot="extra" shape="circle" icon="right" size="small" @click="onClickExpand" />
      <a-list
        :dataSource="data"
        :pagination="false"
        :dataLoading="dataLoading"
        size="small"
        rowKey="mac"
      >
        <template
          slot="footer"
        >{{ $t('terminal.cmdStatusDetail',[total,notSend, sended, returned]) }}</template>
        <a-list-item slot="renderItem" slot-scope="item">
          <a-tag v-if="item.status === 2" color="#108ee9">{{ $t('terminal.sended') }}</a-tag>
          <a-tag v-if="item.status === 1" color="#87d068">{{ $t('terminal.returned') }}</a-tag>
          <a-tag v-if="item.status === 0" color="#f50">{{ $t('terminal.notSend') }}</a-tag>
          {{ item.name }}
        </a-list-item>
      </a-list>
    </a-card>
    <a-button
      v-show="!expand"
      shape="circle"
      icon="left"
      size="small"
      @click="onClickExpand"
      style="margin:16px 3px"
    />
  </a-layout-sider>
</template>

<script>
import { getCmdStatus } from '@/api/cmd'

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      expand: false,
      dataLoading: false,
      oprNo: '',
      data: [],
      total: 0,
      notSend: 0,
      sended: 0,
      returned: 0,
      columns: [
        {
          title: this.$t('common.name'),
          dataIndex: 'name',
          width: 80
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          width: 60
        }
      ]
    }
  },
  created () {
  },
  methods: {
    onClickExpand () {
      this.expand = !this.expand
    },
    setExpand (expand) {
      if (expand !== 'undefined') {
        this.expand = !expand
      }
    },
    onTgroupCollapse (collapse) {
      this.setExpand(collapse)
    },
    show (oprNo) {
      this.expand = true
      this.oprNo = oprNo
      this.refresh()
    },
    refresh () {
      this.dataLoading = true
      if (this.oprNo.length <= 0) {
        return
      }
      getCmdStatus({ opNo: this.oprNo }).then(res => {
        if (res.code === 200) {
          this.total = res.result.total
          this.sended = res.result.send
          this.notSend = res.result.notSend
          this.returned = res.result.return
          this.data = res.result.rows
          if (this.expand) {
            setTimeout(() => {
              this.refresh()
            }, 1500)
          }
        }
        this.dataLoading = false
      }, () => {
        this.dataLoading = false
      })
    }
  }
}
</script>
