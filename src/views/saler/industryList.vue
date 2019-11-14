<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="sform">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="行业名称">
              <a-input v-model="queryParam.name" :placeholder="$t('common.inputPlaceholder')"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="$refs.table.refresh(true)">{{ $t('common.search') }}</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">{{ $t('common.reset') }}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button
        v-action:industry:add
        type="primary"
        icon="plus"
        @click="handleEdit(0)"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:industry:add
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit(1)"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:industry:del
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('common.del') }}</a-button>
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
    <a-modal
      title="编辑"
      :visible="editvisible"
      @ok="handleMgOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="行业名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入行业名称"
              v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getIndustryData, saveIndustry, delIndustry } from '@/api/industry'
import pick from 'lodash.pick'
export default {
  components: {
    STable
  },
  data () {
    return {
      isEdit: 0,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      editvisible: false,
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onChange
        }
      },
      columns: [
        {
          align: 'center',
          title: this.$t('terminalExpand.industry'),
          dataIndex: 'name'
        },
        {
          align: 'center',
          title: this.$t('common.createBy'),
          dataIndex: 'userName'
        },
        {
          align: 'center',
          title: this.$t('common.createTime'),
          dataIndex: 'createTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getIndustryData(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      }
    }
  },
  methods: {
    handleEdit (flag) {
      this.editvisible = true
      this.isEdit = flag
      if (flag === 1) {
        const record = this.selectedRows[0]
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(record, 'name'))
        })
      }
    },
    handleDelete (record) {
      const ids = []
      if (record != null) {
        ids.push(record.id)
      } else {
        this.selectedRowKeys.forEach(function (v, k) {
          ids.push(v)
        })
      }
      var that = this
      this.$confirm({
        title: '确定删除' + this.selectedRowKeys.length + '个行业数据?',
        content: '删除后不可恢复',
        okType: 'danger',
        onOk () {
          return delIndustry(ids).then(res => {
            if (res.success === true) {
              that.$message.success('删除成功')
              that.$refs.table.refresh()
            } else {
              that.$notification['error']({
                message: '错误',
                description: res.errMsg || '请求出现错误，请稍后再试',
                duration: 4
              })
            }
          })
        }
      })
    },
    handleCancel () {
      this.editvisible = false
    },
    handleMgOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (this.isEdit === 1) {
            params.id = this.selectedRowKeys[0]
          }
          saveIndustry(params).then(res => {
            if (res.success) {
              this.$message.info('编辑成功')
              this.$refs.table.refresh(true)
              this.editvisible = false
            } else {
              this.$notification['error']({
                message: '错误',
                description: res.errMsg || '请求出现错误，请稍后再试',
                duration: 4
              })
            }

            this.confirmLoading = false
          }, () => {
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>
