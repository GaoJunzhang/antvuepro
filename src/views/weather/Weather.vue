<template>
  <a-modal
    :maskClosable="maskClosable"
    :title="title"
    :width="540"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :label="$t('weather.city')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-cascader
            :placeholder="$t('weather.cityPlaceholder')"
            :options="citys"
            :showSearch="true"
            :fieldNames="fieldNames"
            expandTrigger="hover"
            v-decorator="['city', {rules: [{required: true, message: $t('common.choosePlaceholder')}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { weatherCityData, addUserWeather } from '@/api/weather'

export default {
  components: {
  },
  data () {
    return {
      maskClosable: false,
      title: this.$t('weather.city'),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      citys: [],
      fieldNames: { label: 'city', value: 'id', children: 'children' }
    }
  },
  created () {
    this.loadCitys()
  },
  methods: {
    show () {
      this.visible = true
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ids: [values.city[2]] }
          addUserWeather(params).then(res => {
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
    loadCitys () {
      weatherCityData({}).then(res => {
        if (res.code === 200) {
          this.citys = res.result
        } else {
          this.citys = []
        }
        return res
      })
    }
  }
}
</script>
