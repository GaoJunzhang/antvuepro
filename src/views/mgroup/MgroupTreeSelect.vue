<script>
import T from 'ant-design-vue/es/tree-select'
import { getMgroupList, getMgroupByName, getMgroupById } from '@/api/mgroup'

export default {
  props: Object.assign({}, T.props, {}),
  data () {
    return {
      mgroupTreeData: [],
      searchNamePage: 0,
      searchKey: 0,
      loadedKeys: [],
      expandedKeys: [],
      autoExpandParent: [],
      loadingData: false,
      selectKey: '',
      defaultMgroupId: 0,
      defaultMgroupParents: []
    }
  },
  created () {
    this.loadMgroups(0)
  },
  methods: {
    setDefaultMgroupId (val) {
      this.defaultMgroupId = val
      if (this.selectKey) {
        this.checkDefaultMgroup()
      }
    },
    checkDefaultMgroup () {
      if (!this.defaultMgroupId || this.defaultMgroupId <= 0) {
        if (this.treeCheckable) {
          this.selectKey = []
        } else {
          this.selectKey = this.mgroupTreeData.length > 0 ? '' + this.mgroupTreeData[0].key : ''
        }

        this.$emit('change', this.selectKey)
        return
      }
      var that = this
      this.loadingData = true
      getMgroupById({ id: this.defaultMgroupId }).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            that.expandedKeys = result.data
            that.defaultMgroupParents = [...result.data]
          }
          this.loadDefaultMgroupId()
          this.loadingData = false
        }
      })
    },
    loadMgroups (parentKey) {
      var param = {}
      if (parentKey > 0) {
        param = {
          id: parentKey
        }
      }
      this.loadingData = true
      getMgroupList(param).then(res => {
        res.result.forEach(obj => {
          obj.value = obj.key + ''
          if (obj.share === 1) {
            obj.slots = { icon: 'share' }
          } else {
            obj.slots = { icon: 'noShare' }
          }
        })
        if (parentKey <= 0) {
          this.mgroupTreeData = res.result
          this.checkDefaultMgroup()
        } else {
          var isLoaded = this.loadedKeys.findIndex(item => item === parentKey)
          if (isLoaded < 0) {
            this.loadedKeys.push(parentKey)
          }
          var parent = this.getParentNode(this.mgroupTreeData, parentKey)
          if (parent) {
            parent.children = res.result
            this.mgroupTreeData = [...this.mgroupTreeData]
            this.loadDefaultMgroupId()
          }
        }

        this.loadingData = false
      })
    },
    loadDefaultMgroupId () {
      if (this.getParentNode(this.mgroupTreeData, this.defaultMgroupId)) {
        this.selectKey = '' + this.defaultMgroupId
        this.$emit('change', this.selectKey)
        return
      }
      for (var i = this.defaultMgroupParents.length - 1; i >= 0; i--) {
        var isLoaded = this.loadedKeys.findIndex(item => item === this.defaultMgroupParents[i])
        if (isLoaded < 0) {
          this.loadMgroups(this.defaultMgroupParents[i])
          return
        }
      }
    },
    getParentNode (datas, key) {
      for (var i = 0; i < datas.length; i++) {
        if (datas[i].key === key) {
          return datas[i]
        }

        if (datas[i].children) {
          const node = this.getParentNode(datas[i].children, key)
          if (node) {
            return node
          }
        }
      }
    },
    onMgroupLoadData (treeNode) {
      this.loadingData = true
      return getMgroupList({ id: treeNode.dataRef.key }).then(res => {
        res.result.forEach(obj => {
          obj.value = obj.key + ''
          if (obj.share === 1) {
            obj.slots = { icon: 'share' }
          } else {
            obj.slots = { icon: 'noShare' }
          }
        })
        treeNode.dataRef.children = res.result
        var isLoaded = this.loadedKeys.findIndex(item => item === treeNode.dataRef.key)
        if (isLoaded < 0) {
          this.loadedKeys.push(treeNode.dataRef.key)
        }
        this.mgroupTreeData = [...this.mgroupTreeData]
        this.loadingData = false
      })
    },
    onExpandMgroup (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    search (name) {
      var param = {
        name: name,
        page: ++this.searchNamePage
      }
      var that = this
      this.loadingData = true
      getMgroupByName(param).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            that.searchKey = result.key
            that.expandedKeys = result.data
          } else if (result.totalCount <= 0) {
            // that.showSearchToolTip(this.$t('mgroup.searchNoResult'))
          } else {
            that.searchNamePage = 0
            // that.showSearchToolTip(this.$t('mgroup.searchNoMoreResult'))
          }
          this.loadingData = false
        }
      })
    },
    filterMgroupNode (value, node) {
      return this.loadingData || (node.data.props.title.indexOf(value) >= 0)
    },
    onChange (val) {
      this.selectKey = val
      this.$emit('change', val)
    }
  },
  render () {
    const props = {}
    Object.keys(T.props).forEach(k => {
      this[k] && (props[k] = this[k])
      return props[k]
    })
    const ts = (
      <a-tree-select
        {...{ props }}
        onChange={this.onChange}
        onSearch={this.search}
        onTreeExpand={this.onExpandMgroup}
        loadData={this.onMgroupLoadData}
        treeData={this.mgroupTreeData}
        loadedKeys={this.loadedKeys}
        treeExpandedKeys={this.expandedKeys}
        autoExpandParent={this.autoExpandParent}
        filterTreeNode={this.filterMgroupNode}
        value={this.selectKey}
      >
      </a-tree-select >
    )

    return ts
  }
}
</script>

<style lang="less" scoped>
</style>
