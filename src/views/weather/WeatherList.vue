<template>
  <div class="content">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="16">
          <a-col span="8">
            <a-form-item :label="$t('weather.city')">
              <a-input v-model="queryParam.name" :placeholder="$t('weather.cityPlaceholder')" />
            </a-form-item>
          </a-col>
          <template v-if="advanced"></template>
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
              <a @click="toggleAdvanced" v-show="false" style="margin-left: 8px">
                {{ advanced ? $t('common.collapse') : $t('common.expand') }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="addWeather()">{{ $t('weather.add') }}</a-button>
      <a-button
        v-action:weather:del
        type="primary"
        :disabled="selectedRowKeys.length <= 0"
        icon="delete"
        @click="handleDelete()"
      >{{ $t('weather.del') }}</a-button>
    </div>

    <s-table
      size="default"
      ref="table"
      row-key="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :showPagination="false"
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
import { getWeatherList, delUserWeather } from '@/api/weather'
import Weather from './Weather'

export default {
  name: 'WeatherList',
  components: {
    STable,
    Weather
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
          title: this.$t('weather.city'),
          dataIndex: 'city',
          sorter: false,
          align: 'center'
        },
        {
          title: this.$t('weather.info'),
          dataIndex: 'info',
          sorter: false,
          align: 'center'
        },
        {
          title: this.$t('weather.updateTime'),
          dataIndex: 'updateTime',
          align: 'center'
        }
      ],
      loadData: parameter => {
        return getWeatherList(Object.assign(parameter, this.queryParam))
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
  created () {

  },
  methods: {
    handleDelete () {
      var that = this
      this.$confirm({
        title: this.$t('weather.delWeatherTitle', [this.selectedRowKeys.length]),
        content: this.$t('weather.delContent'),
        okType: 'danger',
        onOk () {
          return delUserWeather(that.selectedRowKeys).then(res => {
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
    addWeather () {
      this.current = 'weather'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    }
  },
  watch: {

  }
}
</script>
