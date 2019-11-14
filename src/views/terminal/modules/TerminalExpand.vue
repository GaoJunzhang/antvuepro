<template>
  <div id="components-form-demo-advanced-search">
    <a-form class="ant-advanced-search-form" :form="form">
      <a-card :title="$t('terminalExpand.baseField')">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item :label="$t('terminal.mac')">
              <a-input
                disabled
                v-decorator="[
                  `mac`,
                  {
                    rules: [
                      {
                        required: true,
                        message: $t('terminal.macPlaceholder'),
                      },
                    ],
                  }
                ]"
                :placeholder="$t('terminal.macPlaceholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.deviceName')">
              <a-input
                v-decorator="[
                  'deviceName',
                  {
                    initialValue:'',
                    rules: [
                      {
                        required: true,
                        message: $t('terminalExpand.deviceNamePlaceholder'),
                      },
                    ]
                  },
                ]"
                :placeholder="$t('terminalExpand.deviceName')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.diviceNo')">
              <a-input
                v-decorator="['deviceNo'], {initialValue:''}"
                :placeholder="$t('terminalExpand.diviceNo')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminal.maxMedia')">
              <a-input-number
                style="width: 100%;"
                :min="0"
                v-decorator="[
                  'adCount',
                  {
                    rules: [
                      {
                        required: true,
                        message: $t('terminalExpand.maxMediaplaceholder'),
                      },
                    ],
                  },
                ]"
                :placeholder="$t('terminal.maxMedia')"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.deviceType')">
              <a-input
                v-decorator="['deviceType', {initialValue:''}]"
                :placeholder="$t('terminalExpand.deviceType')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.keyNo')">
              <a-input
                v-decorator="['keyNo', {initialValue:''}]"
                :placeholder="$t('terminalExpand.keyNo')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.simno')">
              <a-input
                v-decorator="['simNo', {initialValue:''}]"
                :placeholder="$t('terminalExpand.simno')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.simInfo')">
              <a-input
                v-decorator="['simInfo', {initialValue:''}]"
                :placeholder="$t('terminalExpand.simInfo')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.dateOfManufacture')">
              <a-date-picker
                style="width: 100%"
                v-decorator="['dateOfManufacture', {initialValue:null}]"
                :placeholder="$t('terminalExpand.dateOfManufacture')"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.installTime')">
              <a-date-picker
                style="width: 100%"
                v-decorator="['installTime', {initialValue:null}]"
                :placeholder="$t('terminalExpand.installTime')"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.address')">
              <a-input
                v-decorator="['address', {initialValue:''}]"
                :placeholder="$t('terminalExpand.address')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.installAddr')">
              <a-input
                v-decorator="['installAddr', {initialValue:''}]"
                :placeholder="$t('terminalExpand.installAddr')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.screen')">
              <a-input
                v-decorator="['screen', {initialValue:''}]"
                :placeholder="$t('terminalExpand.screen')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.playTaboos')">
              <a-input
                v-decorator="['playTaboos', {initialValue:''}]"
                :placeholder="$t('terminalExpand.playTaboos')"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :title="$t('terminalExpand.addrField')">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.bestCompany')">
              <a-input
                v-decorator="['bestCompany', {initialValue:''}]"
                :placeholder="$t('terminalExpand.bestCompany')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.requirement')">
              <a-input
                v-decorator="['requirement', {initialValue:''}]"
                :placeholder="$t('terminalExpand.requirement')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.industry')">
              <a-input
                v-decorator="['industry', {initialValue:''}]"
                :placeholder="$t('terminalExpand.industry')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.bulidingDescription')">
              <a-input
                v-decorator="['bulidingDescription', {initialValue:''}]"
                :placeholder="$t('terminalExpand.bulidingDescription')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.height')">
              <a-input
                v-decorator="['height', {initialValue:''}]"
                :placeholder="$t('terminalExpand.heightplaceholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.area')">
              <a-input
                v-decorator="['area', {initialValue:''}]"
                :placeholder="$t('terminalExpand.areaholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.popularity')">
              <a-select v-decorator="['popularity', {initialValue:''}]" :placeholder="$t('terminalExpand.popularity')">
                <a-select-option value="-1">{{ $t('common.choosePlaceholder') }}</a-select-option>
                <a-select-option value="0">{{ $t('terminalExpand.popularitA') }}</a-select-option>
                <a-select-option value="1">{{ $t('terminalExpand.popularitB') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.isActivity')">
              <a-select v-decorator="['isActivity', {initialValue:''}]" :placeholder="$t('terminalExpand.isActivity')">
                <a-select-option value="-1">{{ $t('common.choosePlaceholder') }}</a-select-option>
                <a-select-option value="0">{{ $t('common.yes') }}</a-select-option>
                <a-select-option value="1">{{ $t('common.no') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.activityType')">
              <a-input
                v-decorator="['activityType', {initialValue:''}]"
                :placeholder="$t('terminalExpand.activityType')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.registeredCapital')">
              <a-input
                v-decorator="['registeredCapital', {initialValue:''}]"
                :placeholder="$t('terminalExpand.registeredCapital')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.monthWages')">
              <a-input
                v-decorator="['monthWages', {initialValue:''}]"
                :placeholder="$t('terminalExpand.monthWages')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.industryRank')">
              <a-input
                v-decorator="['industryRank', {initialValue:''}]"
                :placeholder="$t('terminalExpand.industryRank')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.marketDes')">
              <a-input
                v-decorator="['marketDes', {initialValue:''}]"
                :placeholder="$t('terminalExpand.marketDes')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.marketValue')">
              <a-input
                v-decorator="['marketValue', {initialValue:''}]"
                :placeholder="$t('terminalExpand.marketValue')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.annualTurnover')">
              <a-input
                v-decorator="['annualTurnover', {initialValue:''}]"
                :placeholder="$t('terminalExpand.annualTurnover')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.officeCost')">
              <a-input
                v-decorator="['officeCost', {initialValue:''}]"
                :placeholder="$t('terminalExpand.officeCost')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.employees')">
              <a-input
                v-decorator="['employees', {initialValue:''}]"
                :placeholder="$t('terminalExpand.employees')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.competitionName')">
              <a-input
                v-decorator="['competitionName', {initialValue:''}]"
                :placeholder="$t('terminalExpand.competitionName')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.type')">
              <a-select v-decorator="['type', {initialValue:''}]" :placeholder="$t('terminalExpand.type')">
                <a-select-option value="-1">{{ $t('common.choosePlaceholder') }}</a-select-option>
                <a-select-option value="0">{{ $t('terminalExpand.typeA') }}</a-select-option>
                <a-select-option value="1">{{ $t('terminalExpand.typeB') }}</a-select-option>
                <a-select-option value="2">{{ $t('terminalExpand.typeC') }}</a-select-option>
                <a-select-option value="3">{{ $t('terminalExpand.typeD') }}</a-select-option>
                <a-select-option value="4">{{ $t('terminalExpand.typeE') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.level')">
              <a-select v-decorator="['level', {initialValue:''}]" :placeholder="$t('terminalExpand.level')">
                <a-select-option value="-1">{{ $t('common.choosePlaceholder') }}</a-select-option>
                <a-select-option value="0">{{ $t('terminalExpand.levelA') }}</a-select-option>
                <a-select-option value="1">{{ $t('terminalExpand.levelB') }}</a-select-option>
                <a-select-option value="2">{{ $t('terminalExpand.levelC') }}</a-select-option>
                <a-select-option value="3">{{ $t('terminalExpand.levelD') }}</a-select-option>
                <a-select-option value="4">{{ $t('terminalExpand.levelE') }}</a-select-option>
                <a-select-option value="5">{{ $t('terminalExpand.levelF') }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.charger')">
              <a-input
                v-decorator="['charger', {initialValue:''}]"
                :placeholder="$t('terminalExpand.charger')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.chargerMobile')">
              <a-input
                v-decorator="['chargerMobile', {initialValue:''}]"
                :placeholder="$t('terminalExpand.chargerMobile')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.contractor')">
              <a-input
                v-decorator="['contractor', {initialValue:''}]"
                :placeholder="$t('terminalExpand.contractor')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :label="$t('terminalExpand.contractorMobile')">
              <a-input
                v-decorator="['contractorMobile', {initialValue:''}]"
                :placeholder="$t('terminalExpand.contractorMobile')"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card :title="$t('terminalExpand.otherField')">
        <a-popover slot="extra">
          <template slot="content">
            <p>{{ $t('terminalExpand.addField') }}</p>
          </template>
          <a href="#" :title="$t('terminalExpand.addField')" @click="() => $refs.field.show()"><a-icon type="plus-square" /></a>
          <!--<a-button type="primary" @click="() => $refs.field.show()" icon="plus-square" size="small"></a-button>-->
        </a-popover>
        <a-row :gutter="24">
          <a-col :span="6" v-for="f in terFields" :key="f.enName">
            <a-form-item :label="f.fieldName">
              <a-input
                v-decorator="[f.enName,{initialValue:''}]"
                :placeholder="f.fieldName"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-divider/>
    </a-form>
    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button @click="() => $emit('back')" >{{ $t('common.back') }}</a-button>
      <a-button type="primary" @click="handleSubmit" style="margin-left: 10px">{{ $t('common.save') }}</a-button>
    </footer-tool-bar>
    <field-modal ref="field" @handelAddField="getFields" :terminalId="terminal.id"></field-modal>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import FooterToolBar from '@/components/FooterToolbar'
import { terminalExpandByTid, saveTerminalExpand } from '@/api/terminalExpand'
import { fieldList } from '@/api/field'
import pick from 'lodash.pick'
import moment from 'moment'
import FieldModal from './FieldModal'
export default {
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    FieldModal
  },
  props: {
    terminal: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      tid: '',
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      id: null,
      terFields: []
    }
  },
  methods: {
    handleSubmit (e) {
      const that = this
      const { form: { validateFields } } = this
      that.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const params = { ...values }
          if (that.id !== null) {
            params.id = that.id
          }
          for (var key in params) {
            if (params[key] === null) {
              delete params[key]
            }
          }
          if (params.dateOfManufacture) {
            params.dateOfManufacture = params.dateOfManufacture.format('YYYY-MM-DD HH:mm:ss')
          }
          if (params.installTime) {
            params.installTime = params.installTime.format('YYYY-MM-DD HH:mm:ss')
          }
          params.terminalId = this.terminal.id
          var arry = []
          this.terFields.forEach(v => {
            var obj = {}
            obj.id = v.id
            obj.fieldId = v.fieldId
            obj.value = params[v.enName]
            arry.push(obj)
          })
          params.fields = JSON.stringify(arry)
          saveTerminalExpand(params).then(res => {
            this.$emit('back')
          })
        } else {
          that.confirmLoading = false
        }
      })
    },
    terminalExpandByTid () {
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.terminal, 'mac', 'adCount'))
      })
      terminalExpandByTid(this.terminal.id).then(res => {
        const t = res.result
        if (t !== null) {
          this.id = t.id
          const { form: { setFieldsValue } } = this
          if (t.dateOfManufacture != null) {
            t.dateOfManufacture = moment(t.dateOfManufacture, 'YYYY-MM-DD')
          }
          if (t.installTime != null) {
            t.installTime = moment(t.installTime, 'YYYY-MM-DD')
          }
          t.isActivity = t.isActivity != null ? t.isActivity + '' : ''
          t.popularity = t.popularity != null ? t.popularity + '' : ''
          t.type = t.type != null ? t.type + '' : ''
          t.level = t.level != null ? t.level + '' : ''
          this.$nextTick(() => {
            setFieldsValue(pick(t, 'mac', 'deviceName', 'deviceNo', 'keyNo',
              'simNo', 'deviceType', 'macAddr', 'dateOfManufacture', 'industry', 'address', 'requirement',
              'bulidingDescription', 'height', 'area', 'popularity', 'isActivity', 'activityType',
              'registeredCapital', 'monthWages', 'industryRank', 'marketDes', 'marketValue', 'annualTurnover',
              'officeCost', 'employees', 'playTaboos', 'competitionName', 'type', 'level', 'bestCompany', 'installTime',
              'screen', 'charger', 'chargerMobile', 'contractor', 'contractorMobile', 'simInfo', 'installAddr'))
          })
        }
      })
    },
    getFields () {
      fieldList({ terminalId: this.terminal.id }).then(res => {
        this.terFields = res.result
        var vStr = []
        var obj = {}
        res.result.forEach(v => {
          obj[v.enName] = v.fieldContent
          vStr.push(v.enName)
        })
        const { form: { setFieldsValue } } = this
        this.$nextTick(() => {
          setFieldsValue(pick(obj, vStr))
        })
      })
    }
  },
  created () {
    this.terminalExpandByTid()
    this.getFields()
  }
}
</script>

<style>
  .ant-advanced-search-form {
    padding: 24px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
  }

  .ant-advanced-search-form .ant-form-item {
    display: flex;
  }

  .ant-advanced-search-form .ant-form-item-control-wrapper {
    flex: 1;
  }

  #components-form-demo-advanced-search .ant-form {
    max-width: none;
  }
  .ant-layout-header {
    background: #ffffff;
  }
</style>
