<template>
  <nav id="sidebar">
    <!-- dialog for newDiscussion -->
    <el-dialog title="新建讨论" 
      center
      class="new-discussion-dialog"
      width="40%" 
      :visible.sync="newDiscussionDialogVisible">
      <el-form size="small">
        <el-form-item label="主题" :label-width="newDiscussionForm.labelWidth">
          <el-input class="input-body" placeholder="输入讨论的主题"
            v-model="newDiscussionForm.data.topic"></el-input>
        </el-form-item>
        <el-form-item label="分类" :label-width="newDiscussionForm.labelWidth">
          <el-cascader
            class="input-body"
            :options="newDiscussionForm.categories"
            @active-item-change="loadSubCategories"
            v-model="newDiscussionForm.data.category">
          </el-cascader>
        </el-form-item>
        <el-form-item label="标签（可选）" :label-width="newDiscussionForm.labelWidth">
          <el-select
            class="input-body"
            multiple
            v-model="newDiscussionForm.data.tags"
            placeholder="请选择讨论的标签，可多选">
            <el-option
              v-for="tag in newDiscussionForm.tags"
              :key="tag" :label="tag" :value="tag">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="newDiscussionForm.labelWidth">
          <vue-editor v-model="newDiscussionForm.data.contents" 
            :editorToolbar.sync="editorToolbar"></vue-editor>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="newDiscussionDialogVisible = false">发送</el-button>
      </div>
    </el-dialog>

    <!-- the main sidebar items -->
    <affix relative-element-selector="#app-main" :offset="{ top: 40, bottom: 30 }" style="width:190px">
      <ul>
        <li class="new-discussion">
          <el-button @click="newDiscussionDialogVisible = true">新建讨论</el-button>
        </li>
        <li class="text-button all-discussion" :class="isActive('all') ? 'active' : ''">
          <router-link to="/category/all">
            <fa-icon :icon="['far', 'comments']" class="icon" />
            <span>所有讨论</span>
          </router-link>
        </li>
        <li class="text-button tags">
          <a href="/">
            <fa-icon icon="th-large" class="icon" />
            <span>标签</span>
          </a>
        </li>
        <li class="text-button" :class="isActive('activity') ? 'active' : ''">
          <router-link to="/category/activity">
            <fa-icon icon="dove" class="icon" />
            <span>活动</span>
          </router-link>
        </li>
        <li class="separator"></li>
        <li class="text-button" 
          :class="isActive(item) ? 'active': ''" 
          v-for="item in categories">
          <router-link :to="`/category/${categoryName(item)}`" :title="item.description">
            <i class="color-icon icon" :style="`background:#${item.color}`" />
            <span>{{item.name}}</span>
          </router-link>
          <ul class="sub-categories" v-if="isActive(item)">
            <li v-for="subItem in subCategories">
              <p>foobar</p>
            </li>
          </ul>
        </li>
      </ul>
    </affix>
  </nav>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { VueEditor } from 'vue2-editor'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      categories: [],
      subCategories: [],
      newDiscussionDialogVisible: false,
      newDiscussionForm: {
        labelWidth: '140px',
        categories: [],
        tags: [
          '官方教程',
          '开发接入',
          '未回答',
        ],
        data: {
          topic: null,
          category: null,
          tags: [],
          contents: null,
        },
      },
    }
  },
  computed: {
    ...mapGetters([
      'editorToolbar',
      'allCategories',
      'findCategoryById',
    ]),
    categoriesOption() {
      return this.createCategoriesOption(this.allCategories)
    },
  },
  components: {
    VueEditor,
    'fa-icon': FontAwesomeIcon,
  },
  methods: {
    ...mapActions(['getCategories']),
    categoryName(item) {
      return item.slug ? item.slug : `${item.id}-category`
    },
    isActive(item) {
      let id
      if (item === 'all')
        id = 'all'
      else if (item === 'activity')
        id = 'activity'
      else
        id = this.categoryName(item)
      if (this.$route.name === 'CategoryDetail'
        && this.$route.path === `/category/${id}`) {
        return true
      }
      return false
    },
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
      this.newDiscussionForm.data.category = [parentId]

      const { categories } = this.newDiscussionForm
      const category = categories.find(item => item.value === parentId)
      if (category) {
        category.children = this.createCategoriesOption(
          await this.getCategories(parentId), false)
      }
      console.log()
    }
  },
  async mounted() {
    this.categories = await this.getCategories()
    this.newDiscussionForm.categories = this.categoriesOption
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#sidebar {
  flex: 2;
  width: 190px;
  min-width: 190px;
  font-size: 14px;
  padding-top: 30px;
}
#sidebar ul {
  /*margin-top: 30px;*/
}
#sidebar li.active {
  font-weight: bold;
}
#sidebar li.active > a {
  color: #333;
}
.new-discussion {
  margin-bottom: 20px;
}
.new-discussion button {
  color: #fff;
  background: #e7672e;
  border: 0;
  width: 100%;
  font-size: inherit;
  font-weight: bold;
  transition: all .3s
}
.new-discussion button:hover {
  opacity: .8;
}

/*
 * new discussion dialog
 */
.input-body {
  width: 100%;
}

.text-button {
  height: 35px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.text-button > a {
  display: flex;
  color: #667d99;
  transition: all .4s;
}
.text-button > a:hover {
  color: #e7672e;
}
.text-button .icon {
  width: 16px;
  height: 16px;
  text-align: center;
  margin-right: 12px;
}
.separator {
  height: 1px;
  margin: 8px 0;
}
.color-icon {
  display: inline-block;
  background: #e7edf3;
  border-radius: 4px;
}
</style>
