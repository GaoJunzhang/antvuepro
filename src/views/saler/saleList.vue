<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" ref="sform">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item :label="$t('project.saler')">
              <a-input v-model="queryParam.name" :placeholder="$t('project.saler')"/>
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
        v-action:saler:add
        type="primary"
        icon="plus"
        @click="handleEdit(0)"
      >{{ $t('common.new') }}</a-button>
      <a-button
        v-action:saler:add
        type="primary"
        :disabled="selectedRowKeys.length !== 1"
        icon="edit"
        @click="handleEdit(1)"
      >{{ $t('common.edit') }}</a-button>
      <a-button
        v-action:saler:del
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
      <div slot="sex" slot-scope="text, record">
        <a-tag v-if="record.sex == 1" color="blue">{{ $t('common.male') }}</a-tag>
        <a-tag v-if="record.sex == 2" color="pink">{{ $t('common.female') }}</a-tag>
        <a-tag v-if="record.sex == 3" color="orange">{{ $t('common.unknown') }}</a-tag>
      </div>
    </s-table>
    <a-modal
      title="编辑"
      :visible="editvisible"
      @ok="handleMgOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :label="$t('project.saler')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :placeholder="$t('project.salerPlaceholder')"
              v-decorator="['name', {rules: [{required: true, min: 2, message: $t('tgroup.nameRules') }]}]"></a-input>
          </a-form-item>
          <a-form-item :label="$t('common.mobile')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              v-decorator="['tel', {rules: [{ required: true,max: 11, message: '请输入11位数字电话号码！'}]}]"
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
          <a-form-item :label="$t('common.sex')" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              labelInValue
              v-decorator="['sexObj', {rules: [{ required: true, message: $t('common.choosePlaceholder')}]}]"
              @change="handleChange"
            >
              <a-select-option value="1">{{ $t('common.male') }}</a-select-option>
              <a-select-option value="2">{{ $t('common.female') }}</a-select-option>
              <a-select-option value="3">{{ $t('common.unknown') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getSalerData, saveSaler, delSaler } from '@/api/saler'
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
          title: this.$t('project.saler'),
          dataIndex: 'name'
        },
        {
          title: this.$t('common.sex'),
          align: 'center',
          dataIndex: 'sex',
          scopedSlots: { customRender: 'sex' }
        },
        {
          align: 'center',
          title: this.$t('common.mobile'),
          dataIndex: 'tel'
        },
        {
          align: 'center',
          title: '已签数',
          dataIndex: 'adCount'
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
        return getSalerData(Object.assign(parameter, this.queryParam)).then(res => {
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
        let sexLabel = ''
        if (record.sex === 1) {
          sexLabel = '男'
        }
        if (record.sex === 2) {
          sexLabel = '女'
        }
        if (record.sex === 3) {
          sexLabel = '未知'
        }
        record.sexObj = { key: record.sex + '', label: sexLabel }
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(record, 'name', 'tel', 'sexObj'))
        })
      } else {
        this.form.resetFields()
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
          return delSaler(ids).then(res => {
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
          params.sex = values.sexObj.key
          if (this.isEdit === 1) {
            params.id = this.selectedRowKeys[0]
          }
          saveSaler(params).then(res => {
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
      this.$emit('selectRow', selectedRows)
    },
    handleChange (v) {
      console.log(v)
    }
  }
}
</script>
