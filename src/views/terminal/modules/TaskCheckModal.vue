<template>
  <a-modal
    :title="$t('terminal.checkTask')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="600"
    :footer="null"
    @cancel="() => visible = false"
  >
    <a-table
      :pagination="false"
      row-key="id"
      bordered
      :columns="columns"
      :dataSource="data"
      size="middle" />
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button type="primary" @click="handleOk" icon="reload" :loading="iconLoading">{{ $t('common.reload') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'TaskCheckModal',
  data () {
    return {
      iconLoading: false,
      confirmLoading: false,
      visible: false,
      columns: [
        {
          title: this.$t('project.client'),
          dataIndex: 'client'
        },
        {
          title: this.$t('taskCheck.notice'),
          dataIndex: 'notice'
        },
        {
          title: this.$t('project.taboo'),
          dataIndex: 'taboo'
        },
        {
          title: this.$t('common.validDate'),
          dataIndex: 'validDate'
        },
        {
          title: this.$t('taskCheck.fileStatus'),
          dataIndex: 'fileStatus'
        }
      ],
      data: [
        {
          id: '1',
          client: '终端1',
          notice: 'John Brown',
          taboo: '经济',
          validDate: '0571-22098909',
          fileStatus: 18889898989
        }
      ]
    }
  },
  methods: {
    handleOk () {
      this.iconLoading = true
    },
    show () {
      this.visible = true
    },
    created () {}
  }
}
</script>

<style scoped>

</style>
