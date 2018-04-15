<template>
  <nav id="sidebar">
    <!-- dialog for newDiscussion -->
    <el-dialog title="新建讨论" 
      center
      class="new-discussion-dialog"
      width="40%" 
      :visible.sync="newDiscussionDialogVisible">
      <new-discussion />
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postNewDiscussion">发送</el-button>
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
          v-for="item in allCategories">
          <router-link :to="`/category/${categoryName(item)}`" :title="item.description">
            <i class="color-icon icon" :style="`background:#${item.color}`" />
            <span>{{item.name}}</span>
          </router-link>
          <ul class="sub-categories">
            <li v-for="subItem in subCategories">
              <p>123</p>
            </li>
          </ul>
        </li>
      </ul>
    </affix>
  </nav>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapGetters, mapActions } from 'vuex'
import NewDiscussion from './NewDiscussion'

export default {
  name: 'Sidebar',
  components: {
    NewDiscussion,
    'fa-icon': FontAwesomeIcon,
  },
  data () {
    return {
      subCategories: [],
      newDiscussionDialogVisible: false,
    }
  },
  computed: {
    ...mapGetters([
      'editorToolbar',
      'allTags',
      'allCategories',
    ]),
    // async subCategories() {
    //   const curr = await this.findCategoryBySlug(this.$route.params.id)
    //   if (curr && curr.id) {
    //     const list = await this.getCategories(curr.id)
    //     console.log(list)
    //     return list
    //   } else {
    //     return []
    //   }
    // },
  },
  methods: {
    ...mapActions([
      'getTags',
      'getCategories',
      'findCategoryById',
      'findCategoryBySlug',
    ]),
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
    async postNewDiscussion() {
      // ready for data
      this.newDiscussionDialogVisible = false
    },
  },
  async mounted() {
    await Promise.all([
      this.getCategories(),
      this.getTags(),
    ])
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
