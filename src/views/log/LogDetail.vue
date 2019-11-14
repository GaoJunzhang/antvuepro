<template>
  <a-drawer
    :title="$t('common.detail')"
    placement="right"
    :closable="false"
    @close="() => visible=false"
    :visible="visible"
    :width="800"
  >
    <div>
      <a-row type="flex">
        <a-col :span="6"><strong>用户: </strong>{{ logObj.userName }}</a-col>
        <a-col :span="6"><strong>action: </strong>{{ logObj.action }}</a-col>
        <a-col :span="6"><strong>status: </strong>{{ logObj.status }}</a-col>
        <a-col :span="6"><strong>时间: </strong>{{ logObj.createTime }}</a-col>
      </a-row>
      <a-divider orientation="left">Request</a-divider>
      <a-row>
        <a-col :span="24">
          <json-viewer
            :value="logObj.request"
            :expand-depth="5"
            copyable
            boxed
            sort></json-viewer>
        </a-col>
      </a-row>
      <a-divider orientation="left">Response</a-divider>
      <a-row>
        <a-col :span="24">
          <json-viewer
            :value="logObj.response"
            :expand-depth="5"
            copyable
            boxed
            sort></json-viewer>
        </a-col>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      logObj: {
        userName: '',
        action: '',
        status: '',
        createTime: '',
        request: {},
        response: []
      }
    }
  },
  methods: {
    show (o) {
      this.visible = true
      this.logObj = o
    }
  }
}
</script>
