<template>
  <div>
    <a-spin :spinning="confirmLoading" tip="Loading...">
      <a-row :gutter="16">
        <a-col :md="24" :lg="16">
          <a-form layout="vertical" :form="form">
            <a-form-item label="Access Key">
              <a-input
                :placeholder="$t('system.accessKeyPlayceholder')"
                v-decorator="['key', {rules: [{required: true, message: this.$t('system.accessKeyPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="Access Secret">
              <a-input
                :placeholder="$t('system.accessSecretPlayceholder')"
                v-decorator="['secret', {rules: [{required: true, message: this.$t('system.accessSecretPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="Endpoint">
              <a-input
                :placeholder="$t('system.endpointPlayceholder')"
                v-decorator="['endpoint', {rules: [{required: true, message: this.$t('system.endpointPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="Bucket">
              <a-input
                :placeholder="$t('system.bucketPlayceholder')"
                v-decorator="['bucket', {rules: [{required: true, message: this.$t('system.bucketPlayceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="Access Url">
              <a-input
                :placeholder="$t('system.accessUrlPlceholder')"
                v-decorator="['url', {rules: [{required: true, message: this.$t('system.accessUrlPlceholder')}]}]"
              />
            </a-form-item>
            <a-form-item label="File">
              <a-input
                :placeholder="$t('system.filePceholder')"
                v-decorator="['file', {rules: [{required: true, message: this.$t('system.filePceholder')}]}]"
              />
            </a-form-item>

            <a-form-item>
              <a-button type="primary" @click="handleSubmit">{{ $t('common.save') }}</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { getAliyunOssSetting, setAliyunOssSetting } from '@/api/setting'

export default {
  created () {
    this.loadSetting()
  },
  data () {
    return {
      confirmLoading: true,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    loadSetting () {
      this.confirmLoading = true
      getAliyunOssSetting().then(res => {
        if (res.code === 200) {
          const ossParam = JSON.parse(res.result)
          this.form.setFieldsValue(ossParam)
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.message || '请求出现错误，请稍后再试',
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
          setAliyunOssSetting({
            setting: JSON.stringify(params)
          }).then(res => {
            if (res.code === 200) {
              this.$notification['success']({
                message: this.$t('common.success'),
                description: this.$t('common.save') + this.$t('common.success'),
                duration: 4
              })
            } else {
              this.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
