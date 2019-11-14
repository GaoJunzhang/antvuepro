<template>
  <a-select
    :defaultValue="industryId"
    showSearch
    optionFilterProp="children"
    @change="handleChange"
    placeholder="行业"
    :filterOption="filterOption"
  >
    <a-select-option
      :defaultActiveFirstOption="true"
      :defaultValue="industryId"
      v-for="item in industrys"
      :value="item.id"
      :key="item.id"
    >{{ item.name }}</a-select-option
    >
  </a-select>
</template>

<script>
import { getIndustryList } from '@/api/industry'
export default {
  name: 'IndustrySelect',
  props: {
    industryId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      industrys: []
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('selectIndustry', value)
    },
    getIndustryList () {
      getIndustryList().then(res => {
        this.industrys = res.result
      })
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  created () {
    this.getIndustryList()
  }
}
</script>

<style scoped>

</style>
