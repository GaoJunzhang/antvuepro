<template>
  <div>
    <a-card class="card" :title="$t('project.project')" :bordered="false">
      <project-form :loading="loading" ref="project" />
    </a-card>
    <a-card class="card" :title="$t('project.medias')" :bordered="false">
      <project-medias ref="medias" />
    </a-card>
    <a-card class="card" :title="terminalsTitle" :bordered="false" style="margin-bottom:76px">
      <project-terminals ref="terminals" @change="onTerminalsChange" />
    </a-card>

    <footer-tool-bar
      :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 256 : 80}px)` : '100%'}"
    >
      <a-button type="primary" @click="validate" :loading="submitLoading">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { saveProject, project } from '@/api/project'
import ProjectForm from './modules/ProjectForm'
import ProjectMedias from './modules/ProjectMedias'
import ProjectTerminals from './modules/ProjectTerminals'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  mixins: [mixin, mixinDevice],
  components: {
    FooterToolBar,
    ProjectForm,
    ProjectTerminals,
    ProjectMedias
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      terminalsTitle: this.$t('project.terminals'),
      projectId: 0
    }
  },
  created () {
    if (this.$route.params.id) {
      this.projectId = this.$route.params.id
    }

    this.loadData()
  },
  methods: {
    loadData () {
      if (this.projectId > 0) {
        this.loading = true
        project(this.projectId).then(res => {
          if (res.code === 200) {
            this.$refs.project.initData(res.result)
          } else {
            this.$notification['error']({
              message: this.$t('common.error'),
              description: res.message || this.$t('common.tryLater'),
              duration: 4
            })
          }

          this.loading = false
        }, () => {
          this.loading = false
        })

        this.$nextTick(() => {
          this.$refs.medias.loadMedias(this.projectId)
          this.$refs.terminals.loadTerminals(this.projectId)
        })
      }
    },
    onTerminalsChange (val) {
      this.terminalsTitle = this.$t('project.terminals') + ':' + val
    },
    handleSubmit (e) {
      e.preventDefault()
    },
    validate () {
      this.submitLoading = true

      var params = { projectId: this.projectId }
      var error = false
      this.$refs.project.form.validateFields((err, values) => {
        if (!err) {
          params = Object.assign(params, values)
          params.start = values.validDate[0].format('YYYY-MM-DD')
          params.end = values.validDate[1].format('YYYY-MM-DD')
          delete params['validDate']
        } else {
          error = true
        }
      })

      if (error) {
        this.submitLoading = false
        return
      }

      params.medias = this.$refs.medias.getMedias()
      if (params.medias.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('project.mediasError'),
          duration: 4
        })
        this.submitLoading = false
        return
      }

      params.terminals = this.$refs.terminals.getTerminals()
      if (params.terminals.length <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('project.terminalsError'),
          duration: 4
        })
        this.submitLoading = false
        return
      }

      saveProject(params).then(res => {
        if (res.code === 200) {
          this.$router.push({ name: 'projectList' })
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.message || this.$t('common.tryLater'),
            duration: 4
          })
        }
        this.submitLoading = false
      }, () => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
</style>
