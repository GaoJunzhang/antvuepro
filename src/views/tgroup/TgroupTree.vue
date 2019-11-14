<template>
  <a-layout-sider
    width="230"
    breakpoint="xl"
    :collapsed="!show"
    collapsedWidth="30"
    style="background:#FFF"
    @collapse="onTgroupCollapse"
  >
    <a-card :title="$t('tgroup.tgroup')" v-show="show" style="height:100%">
      <a-button slot="extra" shape="circle" icon="left" size="small" @click="onClickExpand" />
      <a-button-group v-show="editable">
        <a-button
          icon="plus"
          @click="onAddTgroup"
          :title="$t('common.new')"
          :disabled="selectTgroupNode.key <= 0"
        />
        <a-button
          icon="edit"
          @click="onEditTgroup"
          :title="$t('common.edit')"
          :disabled="selectTgroupNode.key <= 0"
        />
        <a-button
          icon="delete"
          @click="onDelTgroup"
          :title="$t('common.del')"
          :disabled="selectTgroupNode.key <= 0"
        />
        <a-button icon="reload" @click="onReloadTgroup" :title="$t('common.reload')" />
        <a-button icon="search" @click="onSearchTgroup" :title="$t('common.search')" />
      </a-button-group>
      <a-tooltip placement="bottom" :title="searchTipTitle" trigger :visible="showToolTip">
        <a-input-search
          style="margin-top: 8px"
          v-show="showSearch"
          :placeholder="$t('tgroup.tgroupPlaceholder')"
          @change="onSearchNameChange"
          @search="onTgroupSearchChange"
        />
      </a-tooltip>
      <a-tree
        showIcon
        :loadedKeys="loadedKeys"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        :loadData="onTgroupLoadData"
        :treeData="tgroupTreeData"
        :filterTreeNode="filterTgroupNode"
        @select="onSelectTgroup"
        @expand="onExpandTgroup"
      >
        <a-icon slot="noShare" type="folder" />
      </a-tree>
    </a-card>
    <a-button
      v-show="!show"
      shape="circle"
      icon="right"
      size="small"
      @click="onClickExpand"
      style="margin:16px 3px"
    />
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </a-layout-sider>
</template>

<script>
import TgroupForm from './TgroupForm'
import { getTgroupList, delTgroup, getTgroupByName } from '@/api/tgroup'

export default {
  components: {
    TgroupForm
  },
  props: {
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      show: true,
      showSearch: false,
      loadedKeys: [],
      expandedKeys: [],
      autoExpandParent: false,
      tgroupTreeData: [],
      selectTgroupNode: { key: 0 },
      current: '',
      searchNamePage: 0,
      searchKey: 0,
      showToolTip: false,
      searchTipTitle: ''
    }
  },
  created () {
    this.loadTgroups({})
  },
  methods: {
    loadTgroups (param) {
      getTgroupList(param).then(res => {
        res.result.forEach(obj => {
          obj.slots = { icon: 'noShare' }
        })
        this.tgroupTreeData = res.result
        if (this.tgroupTreeData.length > 0) {
          this.expandedKeys = [this.tgroupTreeData[0].key]
        }
      })
    },
    onClickExpand () {
      this.show = !this.show
    },
    setExpand (expand) {
      if (expand !== 'undefined') {
        this.show = !expand
      }
    },
    onTgroupCollapse (collapse) {
      this.setExpand(collapse)
    },
    onSelectTgroup (key, e) {
      if (e.selected) {
        this.selectTgroupNode = e.node.dataRef
      } else {
        this.selectTgroupNode = { key: 0 }
      }

      this.$emit('tgroupChange', this.selectTgroupNode)
    },
    onTgroupLoadData (treeNode) {
      return getTgroupList({ id: treeNode.dataRef.key }).then(res => {
        res.result.forEach(obj => {
          obj.slots = { icon: 'noShare' }
        })
        treeNode.dataRef.children = res.result
        if (res.result.length <= 0) {
          var isLoaded = this.loadedKeys.findIndex(item => item === treeNode.dataRef.key)
          if (isLoaded < 0) {
            this.loadedKeys.push(treeNode.dataRef.key)
          }
        }
        this.tgroupTreeData = [...this.tgroupTreeData]
      })
    },
    onExpandTgroup (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onAddTgroup () {
      if (this.selectTgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('tgroup.chooseError'),
          duration: 4
        })
        return
      }

      this.current = 'TgroupForm'
      this.$nextTick(() => {
        this.$refs.model.add(this.selectTgroupNode.key)
      })
    },
    onEditTgroup () {
      if (this.selectTgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('tgroup.chooseError'),
          duration: 4
        })
        return
      }

      this.current = 'TgroupForm'
      this.$nextTick(() => {
        this.$refs.model.edit(this.selectTgroupNode)
      })
    },
    onDelTgroup () {
      if (this.selectTgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('tgroup.chooseError'),
          duration: 4
        })
        return
      }
      var that = this
      this.$confirm({
        title: this.$t('tgroup.delTitle', [this.selectTgroupNode.title]),
        content: this.$t('tgroup.delContent'),
        okType: 'danger',
        onOk () {
          return delTgroup(that.selectTgroupNode.key).then(res => {
            if (res.code === 200) {
              that.selectTgroupNode = { key: 0 }
              that.reloadTgroup(res.result)
            } else {
              that.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
                duration: 4
              })
            }
          })
        }
      })
    },
    onSearchTgroup () {
      this.showSearch = !this.showSearch
    },
    onReloadTgroup () {
      this.reloadTgroup(this.selectTgroupNode.key)
    },
    reloadTgroup (key) {
      if (key <= 0) {
        this.expandedKeys = []
        this.loadedKeys = []
        this.loadTgroups({})
      } else {
        var isLoaded = this.loadedKeys.findIndex(item => item === key)
        if (isLoaded >= 0) {
          this.loadedKeys.splice(isLoaded, 1)
        }

        var isExpand = this.expandedKeys.findIndex(item => item === key)
        if (isExpand >= 0) {
          this.expandedKeys.splice(isExpand, 1)
        }
        this.clearTreeChild(key, this.tgroupTreeData)
        this.expandedKeys.push(key)
      }
    },
    clearTreeChild (key, data) {
      var found = false
      data.forEach(obj => {
        if (found) {
          return found
        }

        if (obj.key === key) {
          obj.children = []
          found = true
        } else if (obj.children && obj.children.length >= 0) {
          found = this.clearTreeChild(key, obj.children)
        }
      })
      return found
    },
    handleOk (key) {
      this.current = ''
      this.reloadTgroup(key)
    },
    handleClose () {
      this.current = ''
    },
    onSearchNameChange () {
      this.searchNamePage = 0
      this.searchKey = 0
    },
    onTgroupSearchChange (name) {
      var param = {
        name: name,
        page: ++this.searchNamePage
      }
      var that = this
      getTgroupByName(param).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            that.searchKey = result.key
            that.expandedKeys = result.data
          } else if (result.totalCount <= 0) {
            that.showSearchToolTip(this.$t('tgroup.searchNoResult'))
          } else {
            that.searchNamePage = 0
            that.showSearchToolTip(this.$t('tgroup.searchNoMoreResult'))
          }
        }
      })
    },
    showSearchToolTip (title) {
      this.searchTipTitle = title
      this.showToolTip = true
      setTimeout(() => {
        this.showToolTip = false
      }, 2000)
    },
    filterTgroupNode (node) {
      return this.showSearch && node.dataRef.key === this.searchKey
    },
    getSelected () {
      return this.selectTgroupNode.key <= 0 ? '' : this.selectTgroupNode.key
    },
    getSelectedNode () {
      return this.selectTgroupNode.key <= 0 ? null : this.selectTgroupNode
    }
  }
}
</script>
