<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="sform">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="公司名称">
              <a-input v-model="queryParam.name" placeholder="公司名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="销售名称">
              <a-input v-model="queryParam.salerName" placeholder="销售名称"/>
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
        v-action:client:add
        type="primary"
        icon="plus"
        @click="handleEdit(0)"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:client:edit
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit(1)"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:client:del
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
      :destroyOnClose="true"
      @ok="handleMgOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="公司名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入行业名称"
              v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
            />
          </a-form-item>
          <a-form-item label="公司简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入公司简称"
              v-decorator="['shortName', {rules: [{required: true, message: '请输入公司简称！'}]}]"
            />
          </a-form-item>
          <a-form-item label="所在区域(省/市-市/区)" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入所在区域"
              v-decorator="['area', {rules: [{required: true, message: '请输入所在区域！'}]}]"
            />
          </a-form-item>
          <a-form-item label="行业" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <industry-select
              v-decorator="['industryId', {rules: [{required: true, message: '请选择行业！'}]}]"
              @selectIndustry="handleSelectIndustry"
              :industryId="checkedIndustryId"
            ></industry-select>
          </a-form-item>
          <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入联系人"
              v-decorator="['contact', {rules: [{required: true, message: '请输入联系人！'}]}]"
            />
          </a-form-item>
          <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['contactType', {rules: [{ required: true,max: 11, message: '请输入11位数字联系电话！'}]}]"
              style="width: 100%"
            >
              <a-Select
                slot="addonBefore"
                v-decorator="['prefix', { initialValue: '86' }]"
                style="width: 70px"
              >
                <a-select-option value="86">
                  +86
                </a-select-option>
                <a-select-option value="87">
                  +87
                </a-select-option>
              </a-Select>
            </a-input>
          </a-form-item>
          <a-form-item label="职位" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入职位"
              v-decorator="['position', {rules: [{required: true, message: '请输入职位！'}]}]"
            />
          </a-form-item>
          <a-form-item label="销售员" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              disabled
              placeholder="请添加销售员"
              v-decorator="['salerName', {rules: [{required: true, message: '请添加销售员！'}]}]"
            >
              <a-button
                type="primary"
                size="small"
                shape="circle"
                icon="plus"
                slot="addonAfter"
                @click="() => visible = true"
              />
            </a-input>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-drawer
      title="销售员列表"
      :width="800"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <sale-list @selectRow="selectRow"></sale-list>
      <div style="position: absolute;left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
        <a-button type="primary" @click="onsubmitSaler">确定</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getClientData, saveClient, delClient } from '@/api/client'
import IndustrySelect from './IndustrySelect'
import saleList from './saleList'
import pick from 'lodash.pick'
export default {
  components: {
    STable,
    IndustrySelect,
    saleList
  },
  data () {
    return {
      salerId: null,
      selectedSaler: [],
      visible: false,
      checkedIndustryId: null,
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
          title: '公司名称',
          dataIndex: 'name'
        },
        {
          align: 'center',
          title: '公司简称',
          dataIndex: 'shortName'
        },
        {
          align: 'center',
          title: '行业',
          dataIndex: 'industryName'
        },
        {
          align: 'center',
          title: '权限',
          dataIndex: 'auth'
        },
        {
          align: 'center',
          title: '所在区域（省/市-市/区）',
          dataIndex: 'area'
        },
        {
          align: 'center',
          title: '投放次数',
          dataIndex: 'count'
        },
        {
          align: 'center',
          title: '所属销售员',
          dataIndex: 'salerName'
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
        return getClientData(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res)
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
        this.checkedIndustryId = record.industryId
        this.salerId = record.salerId
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(record, 'name', 'shortName', 'industryId', 'auth', 'area', 'salerName', 'contact', 'contactType', 'position'))
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
          return delClient(ids).then(res => {
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
          params.salerId = this.salerId
          console.log('保存的参数', params)
          saveClient(params).then(res => {
            console.log('返回', res)
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
    },
    handleSelectIndustry (v) {
      const record = {}
      record.industryId = v
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'industryId'))
      })
    },
    onClose () {
      this.visible = false
    },
    selectRow (v) {
      this.selectedSaler = v
    },
    onsubmitSaler () {
      if (this.selectedSaler.length !== 1) {
        this.$message.info('请选择一条数据')
        return
      }
      const record = {}
      this.salerId = this.selectedSaler[0].id
      record.salerName = this.selectedSaler[0].name
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'salerName'))
      })
      this.visible = false
    }
  }
}
</script>
