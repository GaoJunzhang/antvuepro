<template>
  <div>
    <div class="table-operator">
      <a-button
        v-action:project:add
        type="primary"
        icon="plus"
        @click="handleAdd()"
      >{{ $t('project.add') }}</a-button>
      <a-button
        v-action:task:del
        type="primary"
        :disabled="selectedRows.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('common.del') }}</a-button>
      <a-upload
        accept=".xls, .xlsx"
        :showUploadList="false"
        :headers="uploadHeaders"
        :action="uploadUrl"
        :beforeUpload="beforeUpload"
        @change="uploadChange"
      >
        <a-button icon="upload" :loading="uploading">{{ $t('common.upload') }}</a-button>
      </a-upload>
    </div>
    <a-table
      :columns="columns"
      :dataSource="terminals"
      size="middle"
      :pagination="false"
      :rowSelection="rowSelection"
      :loading="loading"
    >
      <span slot="adCount" slot-scope="text, terminal">
        <span v-if="text === null">0/0</span>
        <span
          v-if="text > terminal.adUseCount"
          style="color:#87d068"
        >{{ terminal.adUseCount }} / {{ terminal.adCount }}</span>
        <span v-else style="color:#f50">{{ terminal.adUseCount }} / {{ terminal.adCount }}</span>
      </span>
    </a-table>

    <terminal-select ref="terminalSelect" @returnTerminal="returnTerminal"></terminal-select>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { uploadTerminals, getProjectTerminals } from '@/api/project'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import TerminalSelect from '@/views/terminal/TerminalSelect'
import Vue from 'vue'

export default {
  components: {
    TerminalSelect
  },
  props: {
  },
  data () {
    return {
      uploadUrl: uploadTerminals,
      uploading: false,
      loading: false,
      terminals: [],
      columns: [
        {
          title: this.$t('project.tgroupName'),
          dataIndex: 'tgroupName',
          align: 'center'
        },
        {
          title: this.$t('project.terminalName'),
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: 'MAC',
          dataIndex: 'mac',
          align: 'center'
        },
        {
          title: this.$t('project.adCountNM'),
          dataIndex: 'adCount',
          align: 'center',
          scopedSlots: { customRender: 'adCount' }
        }
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRows = selectedRows
        },
        onSelect: (record, selected, selectedRows) => {
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
        }
      },
      selectedRows: [],
      id: 0
    }
  },
  watch: {
    terminals () {
      this.$emit('change', this.terminals.length)
    }
  },
  computed: {
    uploadHeaders () {
      return { 'Access-Token': Vue.ls.get(ACCESS_TOKEN) }
    }
  },
  methods: {
    loadTerminals (projectId) {
      if (projectId <= 0) {
        return
      }

      getProjectTerminals(projectId).then(res => {
        if (res.code === 200) {
          this.terminals = []
          res.result.forEach(ter => {
            ter.key = ter.id
            this.terminals.push({
              id: ter.id
            })
          })
        }
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    handleAdd () {
      this.$refs.terminalSelect.show(true)
    },
    handleDelete () {
      this.terminals = this.terminals.filter(terminal => {
        return this.selectedRows.findIndex(item => item.key === terminal.key) < 0
      })
    },
    beforeUpload (file) {
      return true
    },
    uploadChange (e) {
      const status = e.file.status
      this.uploading = (status === 'uploading')
      if (status === 'done') {
        var res = e.file.response
        if (res.code === 200) {
          res.result.forEach(ter => {
            const exist = this.terminals.findIndex(t => t.id === ter.id)
            if (exist < 0) {
              ter.key = ter.id
              this.terminals.push(ter)
            }
          })
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.message || this.$t('common.tryLater'),
            duration: 4
          })
        }
      } else if (status === 'error') {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: res.message || this.$t('common.tryLater'),
          duration: 4
        })
      }
    },
    getTerminals () {
      var terminalIds = []
      this.terminals.forEach(t => {
        if (t.key) {
          terminalIds.push(t.key)
        }
      })
      return terminalIds
    },
    returnTerminal (data) {
      data.forEach(ter => {
        const exist = this.terminals.findIndex(t => t.id === ter.id)
        if (exist < 0) {
          var t = pick(ter, 'id', 'mac', 'name', 'tgroupName', 'adCount', 'adUseCount')
          t.key = ter.id
          this.terminals.push(t)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table-operator {
  margin-bottom: 12px;

  button {
    margin-right: 8px;
  }
}
</style>
