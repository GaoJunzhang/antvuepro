<template>
  <a-modal
    :title="$t('common.server')"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="600"
    @cancel="() => visible=false"
    :footer="null"
  >
    <a-form :form="form">
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelMaster"
      >
        <a-input
          v-decorator="[
            'masterIp',
            { rules: [{ required: true, message: labelMaster }] },
          ]"
          :placeholder="labelMaster"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelMasterPort"
      >
        <a-input
          v-decorator="[
            'masterPort',
            { rules: [{ required: true, message: labelMasterPort }] },
          ]"
          :placeholder="labelMasterPort"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelBranch"
      >
        <a-input
          v-decorator="[
            'branchIp',
            { rules: [{ required: true, message: labelBranch }] },
          ]"
          :placeholder="labelBranch"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelBranchPort"
      >
        <a-input
          v-decorator="[
            'branchPort',
            { rules: [{ required: true, message: labelBranchPort }] },
          ]"
          :placeholder="labelBranchPort"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelMasterFTP"
      >
        <a-input
          v-decorator="[
            'masterFTPip',
            { rules: [{ required: true, message: labelMasterFTP }] },
          ]"
          :placeholder="labelMasterFTP"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelMasterFTPPort"
      >
        <a-input
          v-decorator="[
            'masterFTPort',
            { rules: [{ required: true, message: labelMasterFTPPort }] },
          ]"
          :placeholder="labelMasterFTPPort"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="accountPwd"
      >
        <a-input
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
          v-decorator="[
            'masterAccount',
            { rules: [{ required: true, message: $t('user.account') }] },
          ]"
          :placeholder=" $t('user.account')"
        />
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          ~
        </span>
        <a-input
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
          v-decorator="[
            'masterPassword',
            { rules: [{ required: true, message: $t('user.password') }] },
          ]"
          :placeholder=" $t('user.password')"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelBranckFtp"
      >
        <a-input
          v-decorator="[
            'branchFtp',
            { rules: [{ required: true, message: labelBranckFtp }] },
          ]"
          :placeholder="labelBranckFtp"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="labelBranckFtpPort"
      >
        <a-input
          v-decorator="[
            'branchFtpPort',
            { rules: [{ required: true, message: labelBranckFtpPort }] },
          ]"
          :placeholder="labelBranckFtpPort"
        />
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        :label="accountPwd"
      >
        <a-input
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
          v-decorator="[
            'branchAccount',
            { rules: [{ required: true, message: $t('user.account') }] },
          ]"
          :placeholder=" $t('user.account')"
        />
        <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
          -
        </span>
        <a-input
          :style="{ display: 'inline-block', width: 'calc(50% - 12px)' }"
          type="password"
          v-decorator="[
            'branchPassword',
            { rules: [{ required: true, message: $t('user.password') }] },
          ]"
          :placeholder=" $t('user.password')"
        />
      </a-form-item>
    </a-form>
    <div style="left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button style="margin-right: 10px" @click="handleReload" icon="reload" :loading="iconrLoading">{{ $t('common.reload') }}</a-button>
      <a-button type="primary" @click="handleOk" icon="arrow-left" :loading="iconsLoading">{{ $t('common.set') }}</a-button>
    </div>
  </a-modal>
</template>

<script>
import { getServer } from '@/api/cmd'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}
export default {
  data () {
    return {
      labelMaster: this.$t('serverSet.master') + '' + this.$t('common.server') + '' + this.$t('common.address'),
      labelMasterPort: this.$t('serverSet.master') + '' + this.$t('common.server') + '' + this.$t('common.port'),
      labelBranch: this.$t('serverSet.branch') + '' + this.$t('common.server') + '' + this.$t('common.address'),
      labelBranchPort: this.$t('serverSet.branch') + '' + this.$t('common.server') + '' + this.$t('common.port'),
      labelMasterFTP: this.$t('serverSet.master') + 'FTP' + this.$t('common.address'),
      labelMasterFTPPort: this.$t('serverSet.master') + 'FTP' + this.$t('common.port'),
      labelBranckFtp: this.$t('serverSet.branch') + 'FTP' + this.$t('common.address'),
      labelBranckFtpPort: this.$t('serverSet.branch') + 'FTP' + this.$t('common.port'),
      accountPwd: this.$t('user.account') + '~' + this.$t('user.password'),
      iconrLoading: false,
      iconsLoading: false,
      confirmLoading: false,
      visible: false,
      formItemLayout,
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      terminalId: null
    }
  },
  methods: {
    show (terminalId) {
      this.visible = true
      this.terminalId = terminalId
    },
    getServer (terminalId) {
      this.iconrLoading = true
      getServer({ terminalId: terminalId }).then(res => {
        console.log(res)
      }, () => {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('common.tryLater'),
          duration: 4
        })
        this.iconrLoading = false
      })
    },
    handleReload () {
      this.getServer(this.terminalId)
    },
    handleOk () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {}
      })
    }
  }
}
</script>
