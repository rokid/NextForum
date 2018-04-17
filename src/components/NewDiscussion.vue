<template>
  <el-form size="small">
    <el-form-item label="主题" :label-width="labelWidth">
      <el-input class="input-body" placeholder="输入讨论的主题"
        v-model="data.topic"
        :rules="[
          { required: true, message: '主题不能为空', }
        ]"></el-input>
    </el-form-item>
    <el-form-item label="分类" :label-width="labelWidth">
      <el-cascader
        class="input-body"
        :options="categories"
        @active-item-change="loadSubCategories"
        v-model="data.category">
      </el-cascader>
    </el-form-item>
    <el-form-item label="标签（可选）" :label-width="labelWidth">
      <el-select
        class="input-body"
        multiple
        filterable
        v-model="data.tags"
        placeholder="请选择讨论的标签，可多选">
        <el-option
          v-for="tag in tags"
          :key="tag" :label="tag" :value="tag">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label-width="labelWidth">
      <vue-editor v-model="data.contents" 
        :editorToolbar.sync="editorToolbar"></vue-editor>
    </el-form-item>
  </el-form>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NewDiscussion',
  components: {
    VueEditor,
  },
  data () {
    return {
      labelWidth: '140px',
      categories: [],
      tags: [],
      data: {
        topic: null,
        category: null,
        tags: [],
        contents: null,
      },
    }
  },
  computed: {
    ...mapGetters([
      'editorToolbar',
      'allTags',
      'allCategories',
    ]),
    categoriesOption() {
      return this.createCategoriesOption(this.allCategories)
    },
    tagsOption() {
      return this.allTags.map(tag => tag.id)
    },
  },
  methods: {
    ...mapActions([
      'getTags',
      'getCategories',
    ]),
    createCategoriesOption(list, ownChildren = true) {
      return list.map((item) => {
        const option = {
          label: item.name,
          value: item.id,
        }
        if (!item.has_children)
          return option

        option.children = ownChildren ? [] : undefined
        return option
      })
    },
    async loadSubCategories(val) {
      const parentId = val[val.length - 1]
      this.data.category = [parentId]

      const category = this.categories.find(
        item => item.value === parentId)
      if (category) {
        category.children = this.createCategoriesOption(
          await this.getCategories(parentId), false)
      }
    },
  },
  async mounted() {
    this.categories = this.categoriesOption
    this.tags = this.tagsOption
  },
}
</script>

<style scoped>
.input-body {
  width: 100%;
}
</style>