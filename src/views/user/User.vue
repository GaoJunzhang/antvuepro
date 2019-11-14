<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-card :bordered="false" :style="{ height: '100%' }">
        <a-row>
          <a-col :md="2">
            <a-upload
              :action="uploadAvatar"
              :headers="accessToken"
              listType="picture-card"
              :fileList="fileList"
              :accept="accept"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 3">
                <a-icon type="plus" />
                <div class="ant-upload-text">头像</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleAvtCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </a-col>
          <a-col :md="22">
            <a-form :form="form">
              <a-form-item :label="$t('user.name')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  :placeholder="$t('user.namePlaceholder')"
                  v-decorator="['name', {rules: [{required: true, min: 2, message: '请输入至少2个字符！'}]}]"
                />
              </a-form-item>
              <a-form-item :label="$t('user.account')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  :placeholder="$t('user.accountPlaceholder')"
                  v-decorator="['account', {rules: [{required: true, min: 6, message: '请输入至少6个字符！'}]}]"
                />
              </a-form-item>
              <a-form-item :label="$t('common.status')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select
                  v-decorator="['status', {initialValue: 1, rules: [{ required: true, message: '请选择状态!' }]}]"
                  placeholder="请选择状态"
                >
                  <a-select-option v-for="item in status" :key="item.key">{{ item.val }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label="$t('user.role')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-select
                  v-decorator="['roleId', {rules: [{ required: true, message: '请选择角色!' }]}]"
                  placeholder="请选择角色"
                >
                  <a-select-option v-for="item in roles" :key="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label="$t('user.mgroup')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <mgroup-tree-select
                  ref="mgroup"
                  :treeCheckable="true"
                  :treeCheckStrictly="true"
                  :filterTreeNode="false"
                  v-decorator="['mgroup', {rules: [{ required: false, message: this.$t('project.mgroupError') }]}]"
                  :placeholder="$t('mgroup.mgroupPlaceholder')"
                ></mgroup-tree-select>
              </a-form-item>
              <a-form-item :label="$t('user.tgroup')" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <tgroup-tree-select
                  ref="tgroup"
                  :treeCheckable="true"
                  :treeCheckStrictly="true"
                  :filterTreeNode="false"
                  v-decorator="['tgroup', {rules: [{ required: false, message: this.$t('project.tgroupError') }]}]"
                  :placeholder="$t('tgroup.tgroupPlaceholder')"
                ></tgroup-tree-select>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import MgroupTreeSelect from '@/views/mgroup/MgroupTreeSelect'
import TgroupTreeSelect from '@/views/tgroup/TgroupTreeSelect'
import { saveUser, user } from '@/api/user'
import { getAllRoles } from '@/api/role'
import { uploadAvatar } from '@/api/oss'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  components: {
    MgroupTreeSelect,
    TgroupTreeSelect
  },
  data () {
    return {
      accept: '.jpg,.png,.svg',
      uploadAvatar: uploadAvatar + '?t=' + new Date().getTime(),
      accessToken: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      maskClosable: false,
      title: '新建用户',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      status: [
        {
          key: 0,
          val: '禁用'
        },
        {
          key: 1,
          val: '启用'
        }
      ],
      userId: null,
      isEdit: false,
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      roles: []
    }
  },
  created () {
    this.loadRoles()
    this.accessToken = {
      'Access-Token': Vue.ls.get(ACCESS_TOKEN)
    }
  },
  methods: {
    add () {
      this.title = '新建用户'
      this.visible = true
    },
    edit (record) {
      this.title = '修改用户'
      this.visible = true
      this.userId = record.id
      const { form: { setFieldsValue } } = this

      this.confirmLoading = true
      user(this.userId).then(res => {
        if (res.code === 200) {
          const userInfo = res.result
          const avaObj = {}
          avaObj.url = userInfo.avatar
          avaObj.uid = userInfo.id
          avaObj.name = userInfo.name
          avaObj.status = 'done'
          this.fileList.push(avaObj)
          this.$nextTick(() => {
            setFieldsValue(pick(userInfo, 'name', 'account', 'status', 'roleId', 'mgroup', 'tgroup'))
          })
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.message || this.$t('common.tryLater'),
            duration: 4
          })
        }

        this.confirmLoading = false
      }, () => {
        this.confirmLoading = false
      })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          params.userId = this.userId
          params.mgroupIds = []
          if (params.mgroup) {
            params.mgroup.forEach(m => {
              params.mgroupIds.push(Number(m.value))
            })
          }

          params.tgroupIds = []
          if (params.tgroup) {
            params.tgroup.forEach(m => {
              params.tgroupIds.push(Number(m.value))
            })
          }
          delete params['mgroup']
          delete params['tgroup']
          if (this.fileList.length > 0) {
            params.avatar = this.fileList[0].response
          }
          saveUser(params).then(res => {
            if (res.code === 200) {
              this.visible = false
              this.$emit('ok', '')
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.message || this.$t('common.tryLater'),
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
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    loadRoles () {
      getAllRoles({}).then(res => {
        this.roles = res
        return res
      })
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length > 1) {
        const newArry = []
        newArry.push(fileList.pop())
        this.fileList = newArry
      } else {
        this.fileList = fileList
      }
    },
    handleAvtCancel () {
      this.previewVisible = false
    }
  }
}
</script>
