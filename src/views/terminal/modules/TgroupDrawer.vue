<template>
  <a-drawer
    :title="$t('terminal.allotTgroup')"
    placement="right"
    :closable="false"
    @close="() => tgroupDrawerVisible=false"
    :visible="tgroupDrawerVisible"
    :width="400"
  >
    <a-tooltip placement="bottom" :title="searchTipTitle" trigger :visible="showToolTip">
      <a-input-search
        style="margin-top: 8px;"
        :placeholder="$t('tgroup.tgroupPlaceholder')"
        @change="onSearchNameChange"
        @search="onTgroupSearchChange"
      />
    </a-tooltip>
    <a-tree
      :checkStrictly="true"
      :checkable="true"
      :loadedKeys="loadedKeys"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :loadData="onTgroupLoadData"
      :treeData="tgroupTreeData"
      :filterTreeNode="filterTgroupNode"
      @select="onSelectTgroup"
      @expand="onExpandTgroup"
      :selectedKeys="selectedKeys"
      @check="onCheck"
    >
      <a-icon slot="noShare" type="folder" />
    </a-tree>
    <div style="position: absolute;left: 0;bottom: 0;width: 100%;border-top: 1px solid #e9e9e9;padding: 10px 16px;background: #fff;text-align: right">
      <a-button type="primary" @click="allotTgroup">{{ $t('common.save') }}</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { getTgroupList, getTgroupByName } from '@/api/tgroup'
export default {
  components: {
  },
  data () {
    return {
      tgroupDrawerVisible: false,
      selectedKeys: [],
      loadedKeys: [],
      expandedKeys: [],
      autoExpandParent: false,
      tgroupTreeData: [],
      selectTgroupNode: { key: 0 },
      searchNamePage: 0,
      searchKey: 0,
      showToolTip: false,
      searchTipTitle: ''
    }
  },
  methods: {
    show () {
      this.tgroupDrawerVisible = true
    },
    allotTgroup (v) {
      if (this.selectedKeys.length !== 1) {
        this.$message.info('请勾选一个终端组')
        return
      }
      this.$emit('allotTgroup', this.selectedKeys[0])
      this.tgroupDrawerVisible = false
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
    filterTgroupNode (node) {
      return node.dataRef.key === this.searchKey
    },
    onSelectTgroup (key, e) {
      this.selectedKeys = []
      if (e.selected) {
        this.selectTgroupNode = e.node.dataRef
        this.selectedKeys.push(e.node.dataRef.key)
      } else {
        this.selectTgroupNode = { key: 0 }
      }
      this.$emit('tgroupChange', this.selectTgroupNode)
    },
    onExpandTgroup (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys, info) {
      this.selectedKeys = checkedKeys.checked
    },
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
    }
  },
  created () {
    this.loadTgroups({})
  }
}
</script>

<style scoped>

</style>
