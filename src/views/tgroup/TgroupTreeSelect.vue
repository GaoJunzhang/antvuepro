<script>
import T from 'ant-design-vue/es/tree-select'
import { getTgroupList, getTgroupByName, tgroupById } from '@/api/tgroup'

export default {
  props: Object.assign({}, T.props, {}),
  data () {
    return {
      tgroupTreeData: [],
      searchNamePage: 0,
      searchKey: 0,
      loadedKeys: [],
      expandedKeys: [],
      autoExpandParent: [],
      loadingData: false,
      selectKey: '',
      defaultTgroupId: 0,
      defaultTgroupParents: []
    }
  },
  created () {
    this.loadTgroups(0)
  },
  methods: {
    setDefaultTgroupId (val) {
      this.defaultTgroupId = val
      if (this.selectKey) {
        this.checkDefaultTgroup()
      }
    },
    checkDefaultTgroup () {
      if (!this.defaultTgroupId || this.defaultTgroupId <= 0) {
        if (this.treeCheckable) {
          this.selectKey = []
        } else {
          this.selectKey = this.tgroupTreeData.length > 0 ? '' + this.tgroupTreeData[0].key : ''
        }

        this.$emit('change', this.selectKey)
        return
      }
      var that = this
      this.loadingData = true
      tgroupById({ id: this.defaultTgroupId }).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            that.expandedKeys = result.data
            that.defaultTgroupParents = [...result.data]
          }
          this.loadDefaultTgroupId()
          this.loadingData = false
        }
      })
    },
    loadTgroups (parentKey) {
      var param = {}
      if (parentKey > 0) {
        param = {
          id: parentKey
        }
      }
      this.loadingData = true
      getTgroupList(param).then(res => {
        res.result.forEach(obj => {
          obj.value = obj.key + ''
          if (obj.share === 1) {
            obj.slots = { icon: 'share' }
          } else {
            obj.slots = { icon: 'noShare' }
          }
        })
        if (parentKey <= 0) {
          this.tgroupTreeData = res.result
          this.checkDefaultTgroup()
        } else {
          var isLoaded = this.loadedKeys.findIndex(item => item === parentKey)
          if (isLoaded < 0) {
            this.loadedKeys.push(parentKey)
          }
          var parent = this.getParentNode(this.tgroupTreeData, parentKey)
          if (parent) {
            parent.children = res.result
            this.tgroupTreeData = [...this.tgroupTreeData]
            this.loadDefaultTgroupId()
          }
        }

        this.loadingData = false
      })
    },
    loadDefaultTgroupId () {
      if (this.getParentNode(this.tgroupTreeData, this.defaultTgroupId)) {
        this.selectKey = '' + this.defaultTgroupId
        this.$emit('change', this.selectKey)
        return
      }
      for (var i = this.defaultTgroupParents.length - 1; i >= 0; i--) {
        var isLoaded = this.loadedKeys.findIndex(item => item === this.defaultTgroupParents[i])
        if (isLoaded < 0) {
          this.loadTgroups(this.defaultTgroupParents[i])
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
    onTgroupLoadData (treeNode) {
      this.loadingData = true
      return getTgroupList({ id: treeNode.dataRef.key }).then(res => {
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
        this.tgroupTreeData = [...this.tgroupTreeData]
        this.loadingData = false
      })
    },
    onExpandTgroup (expandedKeys) {
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
      getTgroupByName(param).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            that.searchKey = result.key
            that.expandedKeys = result.data
          } else if (result.totalCount <= 0) {
            // that.showSearchToolTip(this.$t('tgroup.searchNoResult'))
          } else {
            that.searchNamePage = 0
            // that.showSearchToolTip(this.$t('tgroup.searchNoMoreResult'))
          }
          this.loadingData = false
        }
      })
    },
    filterTgroupNode (value, node) {
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
        onTreeExpand={this.onExpandTgroup}
        loadData={this.onTgroupLoadData}
        treeData={this.tgroupTreeData}
        loadedKeys={this.loadedKeys}
        treeExpandedKeys={this.expandedKeys}
        autoExpandParent={this.autoExpandParent}
        filterTreeNode={this.filterTgroupNode}
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
