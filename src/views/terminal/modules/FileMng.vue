<template>
  <a-modal
    :title="$t('terminal.fileMng')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="600"
    @cancel="() => visible=false"
    :footer="null"
  >
    <a-tabs @change="callback" type="card">
      <a-tab-pane key="1">
        <span slot="tab">
          {{ $t('mediaType.video') }}
          <a @click="refresh(1)"><a-icon type="reload" :style="{ fontSize: '8px'}"/></a>
          <a-icon type="link" />
        </span>
        <a-table :columns="columns" :dataSource="data" :pagination="false" bordered>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          {{ $t('mediaType.img') }}
          <a @click="refresh(2)"><a-icon type="reload" :style="{ fontSize: '8px'}"/></a>
          <a-icon type="link" />
        </span>
        <a-table :columns="columns" :dataSource="data" :pagination="false" bordered>
        </a-table>
      </a-tab-pane>
      <a-tab-pane key="3">
        <span slot="tab">
          {{ $t('mediaType.subtitle') }}
          <a @click="refresh(3)"><a-icon type="reload" :style="{ fontSize: '8px'}"/></a>
          <a-icon type="link" />
        </span>
      </a-tab-pane>
      <a-tab-pane key="4">
        <span slot="tab">
          {{ $t('mediaType.model') }}
          <a @click="refresh(4)"><a-icon type="reload" :style="{ fontSize: '8px'}"/></a>
          <a-icon type="link" />
        </span>
      </a-tab-pane>
      <a-tab-pane key="5">
        <span slot="tab">
          {{ $t('terminalExpand.typeE') }}
          <a @click="refresh(5)"><a-icon type="reload" :style="{ fontSize: '8px'}"/></a>
          <a-icon type="link" />
        </span>
      </a-tab-pane>
    </a-tabs>
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button style="margin-right: 10px" @click="handleFormat" icon="reload" :loading="iconrLoading">{{ $t('common.format') }}</a-button>
      <a-button type="primary" @click="handleDel" icon="delete" :loading="iconsLoading">{{ $t('common.del') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      columns: [
        {
          dataIndex: 'fileName',
          title: this.$t('terminal.fileName'),
          align: 'left'
        }
      ],
      data: [
        {
          id: 1,
          fileName: 'file.mp4'
        }
      ]
    }
  },
  methods: {
    handleFormat () {},
    handleDel () {},
    show () {
      this.visible = true
    },
    callback (key) {
      console.log(key)
    },
    refresh (flg) {
      console.log(flg)
    }
  }
}
</script>

<style scoped>

</style>
