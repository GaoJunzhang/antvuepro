<template>
  <a-drawer
    title="字段列表"
    placement="right"
    :closable="false"
    @close="() => fieldVisible = false"
    :visible="fieldVisible"
    :width="400"
  >
    <div>
      <div class="table-operator">
        <a-button-group>
          <a-button
            type="primary"
            icon="plus"
            @click="newField(0)"
          ></a-button>
          <a-button
            type="primary"
            :disabled="selectedRowKeys.length !== 1"
            icon="edit"
            @click="newField(1)"
          ></a-button>
          <a-button
            type="primary"
            :disabled="selectedRowKeys.length <= 0"
            icon="delete"
            @click="handleDelete()"
          ></a-button>
        </a-button-group>
        <a-input-search style="width: 215px;" v-model="queryParam.fieldName" :placeholder="$t('field.fieldName')" @search="$refs.table.refresh(true)" />
        <!--<a-input-search v-model="queryParam.fieldName" style="width: 200px" :placeholder="$t('field.fieldName')" @search="$refs.table.refresh(true)" />-->
      </div>
      <s-table
        size="default"
        ref="table"
        row-key="id"
        :columns="columns"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
      ></s-table>
      <a-modal
        title="编辑字段"
        :visible="visible"
        @ok="handleSubmit"
        @cancel="() => visible=false"
        :zIndex="zIndex"
      >
        <a-form :form="form">
          <a-form-item :label="$t('field.fieldName')" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['fieldName', { rules: [{ required: true, message: $t('field.fieldNameplaceholder') }] }]"
            />
          </a-form-item>
          <a-form-item :label="$t('field.enName')" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['enName', { rules: [{ required: true, message: $t('field.enNameplaceholder') }] }]"
            />
          </a-form-item>
          <a-form-item :label="$t('common.sort')" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number :min="0" v-decorator="['sort',{ initialValue:0 }]" style="width: 100%"/>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </a-drawer>
</template>

<script>
import { fieldListData, saveField, delField } from '@/api/field'
import { STable } from '@/components'
import pick from 'lodash.pick'
export default {
  components: {
    STable
  },
  props: {
    terminalId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      zIndex: 99999,
      form: this.$form.createForm(this),
      visible: false,
      queryParam: {},
      fieldVisible: false,
      confirmLoading: false,
      loadData: parameter => {
        console.log(parameter)
        this.queryParam.terminalId = this.terminalId
        if (!parameter.sortField) {
          parameter.sortField = 'sort'
          parameter.sortOrder = 'ascend'
        }
        return fieldListData(Object.assign(parameter, this.queryParam))
          .then(res => {
            console.log(res)
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
      columns: [
        {
          title: this.$t('field.fieldName'),
          dataIndex: 'fieldName',
          sorter: true
        },
        {
          title: this.$t('field.enName'),
          dataIndex: 'enName',
          sorter: true
        },
        {
          title: this.$t('common.sort'),
          dataIndex: 'sort',
          sorter: true
        }
      ]
    }
  },
  methods: {
    show () {
      this.fieldVisible = true
    },
    newField (flag) {
      this.visible = true
      if (flag === 0) {
        this.form.resetFields()
      } else {
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(this.selectedRows[0], 'fieldName', 'enName', 'sort'))
        })
      }
    },
    handleDelete () {
      var that = this
      this.$confirm({
        title: this.$t('user.delTitle', [this.selectedRowKeys.length]),
        content: this.$t('user.delContent'),
        okType: 'danger',
        onOk () {
          return delField(that.selectedRowKeys).then(res => {
            if (res.code === 200) {
              that.$refs.table.clearSelected()
              that.$refs.table.refresh()
              that.$emit('handelAddField')
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
    handleSubmit () {
      const that = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (this.selectedRowKeys.length === 1) {
            params.id = this.selectedRowKeys[0]
          }
          saveField(params).then(res => {
            console.log(res)
            if (res.success === true) {
              that.$message.info(this.$t('task.saveTemplateSuccess'))
              that.$refs.table.refresh(true)
              that.$emit('handelAddField')
              that.visible = false
            } else {
              that.$message.info(res.message)
            }
          })
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style scoped>

</style>
