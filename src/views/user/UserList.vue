<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col span="8">
            <a-form-item :label="$t('user.name')">
              <a-input v-model="queryParam.name" :placeholder="$t('user.namePlaceholder')" />
            </a-form-item>
          </a-col>
          <a-col span="8">
            <a-form-item :label="$t('user.account')">
              <a-input v-model="queryParam.account" :placeholder="$t('user.accountPlaceholder')" />
            </a-form-item>
          </a-col>

          <template v-if="advanced">
            <a-col span="8">
              <a-form-item :label="$t('common.status')">
                <a-select
                  v-model="queryParam.status"
                  :placeholder="$t('common.choosePlaceholder')"
                  default-value
                >
                  <a-select-option value>{{ $t('common.all') }}</a-select-option>
                  <a-select-option value="1">{{ $t('common.enable') }}</a-select-option>
                  <a-select-option value="2">{{ $t('common.disable') }}</a-select-option>
                </a-select>
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
        v-action:user:add
        type="primary"
        icon="plus"
        @click="newUser()"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:user:edit
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit()"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:user:del
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('common.del') }}</a-button>
      <a-button
        v-action:user:resetPassword
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="lock"
        @click="handleResetPassword()"
      >{{ $t('user.resetPassword') }}</a-button>
    </div>

    <s-table
      size="default"
      ref="table"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="status" slot-scope="text">
        <a-tag v-if="text === 1" color="#87d068">{{ $t('common.enable') }}</a-tag>
        <a-tag v-else color="#f50">{{ $t('common.disable') }}</a-tag>
      </span>
    </s-table>

    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserList, delUser, resetPassword } from '@/api/user'
import UserForm from './User'

const statusMap = {
  0: {
    color: 'error',
    text: '禁用'
  },
  1: {
    color: 'success',
    text: '启用'
  }
}

export default {
  name: 'UserList',
  components: {
    STable,
    UserForm
  },
  data () {
    return {
      current: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: this.$t('user.name'),
          dataIndex: 'name',
          sorter: true
        },
        {
          title: this.$t('user.account'),
          dataIndex: 'account',
          sorter: true
        },
        {
          title: this.$t('user.role'),
          dataIndex: 'roleName',
          sorter: false
        },
        {
          title: this.$t('common.status'),
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('user.lastLoginTime'),
          dataIndex: 'loginTime',
          align: 'center',
          sorter: true
        },
        {
          title: this.$t('user.createTime'),
          dataIndex: 'createTime',
          align: 'center',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getUserList(Object.assign(parameter, this.queryParam))
          .then(res => {
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
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusColorFilter (type) {
      return statusMap[type].color
    }
  },
  created () {

  },
  methods: {
    handleEdit (record) {
      this.current = 'userForm'
      this.$nextTick(() => {
        this.$refs.model.edit(this.selectedRows[0])
      })
    },
    handleDelete () {
      var that = this
      this.$confirm({
        title: this.$t('user.delTitle', [this.selectedRowKeys.length]),
        content: this.$t('user.delContent'),
        okType: 'danger',
        onOk () {
          return delUser(that.selectedRowKeys).then(res => {
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
    handleResetPassword () {
      var that = this
      this.$confirm({
        title: this.$t('user.resetPasswordTitle', [this.selectedRowKeys.length]),
        content: this.$t('user.resetPasswordContent'),
        okType: 'danger',
        onOk () {
          return resetPassword({ ids: that.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              that.$refs.table.clearSelected()
              that.$notification['success']({
                message: that.$t('common.success'),
                description: that.$t('user.resetPasswordSuccess'),
                duration: 4
              })
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
    newUser () {
      this.current = 'userForm'
      this.$nextTick(() => {
        this.$refs.model.add()
      })
    }
  },
  watch: {

  }
}
</script>
