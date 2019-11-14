<template>
  <a-modal
    :title="$t('terminal.switchgear') "
    :visible="visible"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
    @cancel="() => visible=false"
    :width="600"
  >
    <a-card style="margin-top: -24px">
      <a-tabs defaultActiveKey="1" @change="callback" style="margin-top: -25px">
        <a-tab-pane :tab="$t('terminal.daySwitch') " key="1">
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="4" :order="1">{{ $t('terminal.time') }}1:</a-col>
            <a-col :span="16" :order="2" :offset="4"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('terminal.time') }}2:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('terminal.time') }}3:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('terminal.time') }}4:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('terminal.time') }}5:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane :tab="$t('terminal.weekSwitch') " key="2" forceRender>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="4" :order="1">{{ $t('common.Mon') }}:</a-col>
            <a-col :span="16" :order="2" :offset="4"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Tue') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Wed') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Thu') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Fri') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Sat') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="space-around" class="timeRow">
            <a-col :span="8" :order="1">{{ $t('common.Sun') }}:</a-col>
            <a-col :span="16" :order="2"><a-time-picker @change="onChange" />~<a-time-picker @change="onChange" /></a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane :tab="$t('terminal.holidaySwitch') " key="3">
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}1{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}1{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}2{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}2{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}3{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}3{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}4{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
          <a-row type="flex" justify="center" class="timeRow">
            <a-col :span="8">{{ $t('terminal.time') }}4{{ $t('terminal.bootTime') }}:</a-col>
            <a-col :span="8"><a-date-picker @change="onChange" /></a-col>
            <a-col :span="8"><a-time-picker @change="onChange" /></a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-modal>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    handleOk () {},
    callback (v) {
      console.log(v)
    },
    onChange (v) {
      console.log(v)
    }
  }
}
</script>
<style>
  .timeRow {
    margin-bottom: 10px;
  }
</style>
