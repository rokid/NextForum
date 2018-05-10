<template>
  <div class="sidebar-wrap">
    <!-- dialog for newDiscussion -->
    <el-dialog title="新建讨论" 
      center
      class="new-discussion-dialog"
      width="50%"
      :visible.sync="newDiscussionDialogVisible"
      @open="onNewDiscussionDialogOpen"
      @close="onNewDiscussionDialogClose">
      <new-discussion ref="newDiscussionForm" />
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="postNewDiscussion" :disabled="postingNew">发送</el-button>
      </div>
    </el-dialog>
    <!-- dialog for mobile newDiscussion -->
    <el-dialog title="新建讨论" 
      center
      class="new-discussion-dialog2"
      :visible.sync="newDiscussionDialogVisible2"
      :fullscreen="true"
      :modal="false"
      @open="onNewDiscussionDialogOpen"
      @close="onNewDiscussionDialogClose">
      <new-discussion ref="newDiscussionForm2" label-width="100px" inputMargin="0px" label-position="left" />
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible2 = false">取消</el-button>
        <el-button type="primary" @click="postNewDiscussion2" :disabled="postingNew2">发送</el-button>
      </div>
    </el-dialog>

    <nav id="sidebar" class="hidden-xs-only">

      <!-- the main sidebar items -->
      <affix relative-element-selector="#app-main" :offset="{ top: 50, bottom: 30 }" style="width:190px">
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
          <li class="text-button tags" :class="isActive('tags') ? 'active' : ''">
            <router-link to="/tags">
              <fa-icon icon="th-large" class="icon" />
              <span>标签</span>
            </router-link>
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
            <ul class="sub-categories" v-if="isActive(item)">
              <li v-for="subItem in subCategories"
                class="text-button"
                :class="isSubActive(subItem) ? 'active' : ''">
                <router-link :to="`/category/${categoryName(item)}/${categoryName(subItem)}`">
                  <span>{{subItem.name}}</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </affix>
    </nav>

    <div class="mob-sidebar-bg-cover" :class="{ dn: !showMobMenu }">
      <nav id="mob-sidebar">
        <!-- the main sidebar items -->
        <div>
          <ul>
            <li class="text-button all-discussion" @click="closeMobMenu" :class="isActive('all') ? 'active' : ''">
              <router-link to="/category/all">
                <fa-icon :icon="['far', 'comments']" class="icon" />
                <span>所有讨论</span>
              </router-link>
            </li>
            <li class="text-button tags" @click="closeMobMenu" :class="isActive('tags') ? 'active' : ''">
              <router-link to="/tags">
                <fa-icon icon="th-large" class="icon" />
                <span>标签</span>
              </router-link>
            </li>
            <li class="text-button" @click="closeMobMenu" :class="isActive('activity') ? 'active' : ''">
              <router-link to="/category/activity">
                <fa-icon icon="dove" class="icon" />
                <span>活动</span>
              </router-link>
            </li>
            <li class="separator"></li>
            <li class="text-button" @click="closeMobMenu" 
              :class="isActive(item) ? 'active': ''" 
              v-for="item in allCategories">
              <router-link :to="`/category/${categoryName(item)}`" :title="item.description">
                <i class="color-icon icon" :style="`background:#${item.color}`" />
                <span>{{item.name}}</span>
              </router-link>
              <ul class="sub-categories" v-if="isActive(item)">
                <li v-for="subItem in subCategories"
                  class="text-button"
                  :class="isSubActive(subItem) ? 'active' : ''">
                  <router-link :to="`/category/${categoryName(item)}/${categoryName(subItem)}`">
                    <span>{{subItem.name}}</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="new-discussion">
              <el-button @click="newDiscussionDialogVisible2 = true">新建讨论</el-button>
            </li>
          </ul>
        </div>
        
      </nav>
    </div> <!-- mob-sidebar-bg-cover end -->
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { mapGetters, mapActions } from "vuex";
import NewDiscussion from "./NewDiscussion";

export default {
  name: "Sidebar",
  components: {
    NewDiscussion,
    "fa-icon": FontAwesomeIcon
  },
  props: {
    showMobMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      subCategories: [],
      newDiscussionDialogVisible: false,
      newDiscussionDialogVisible2: false,
      postingNew: false,
      postingNew2: false
    };
  },
  computed: {
    ...mapGetters(["allCategories"])
  },
  methods: {
    ...mapActions(["getTags", "getCategories", "findCategoryBySlug"]),
    categoryName(item) {
      return item.slug ? item.slug : `${item.id}-category`;
    },
    isActive(item) {
      let id;
      if (item === "all") {
        id = "all";
      } else if (item === "activity") {
        id = "activity";
      } else if (item === "tags") {
        id = "tags";
      } else {
        id = this.categoryName(item);
      }

      if (
        this.$route.name === "CategoryDetail" &&
        this.$route.params.id === id
      ) {
        return true;
      } else if (this.$route.name === "TagList" && id === "tags") {
        return true;
      } else {
        return false;
      }
    },
    isSubActive(item) {
      const id = this.categoryName(item);
      if (
        this.$route.name === "CategoryDetail" &&
        this.$route.params.subId === id
      ) {
        return true;
      } else {
        return false;
      }
    },
    async postNewDiscussion() {
      const { data } = this.$refs.newDiscussionForm;
      if (!data.topic) {
        this.$message({ type: "error", message: "主题不可为空" });
        return;
      }
      if (!data.category || data.category.length === 0) {
        this.$message({ type: "error", message: "必须选择分类" });
        return;
      }
      if (!data.contents) {
        this.$message({ type: "error", message: "内容不可为空" });
        return;
      }

      this.postingNew = true;
      const response = await this.$http.post("/posts", {
        raw: data.contents,
        title: data.topic,
        unlist_topic: false,
        category: data.category.slice(-1)[0],
        is_warning: false,
        archetype: "regular",
        typing_duration_msecs: 3800,
        tags: data.tags,
        nested_post: true
      });
      this.postingNew = false;
      if (response.data.success) {
        this.newDiscussionDialogVisible = false;
        this.$router.push({
          path: `/topic/${response.data.post.id}`
        });
      } else {
        this.$message({
          type: "error",
          message: "服务器正忙，请稍后再试"
        });
        console.error("post occurs error", response);
      }
    },
    async postNewDiscussion2() {
      const { data } = this.$refs.newDiscussionForm2;
      if (!data.topic) {
        this.$message({ type: "error", message: "主题不可为空" });
        return;
      }
      if (!data.category || data.category.length === 0) {
        this.$message({ type: "error", message: "必须选择分类" });
        return;
      }
      if (!data.contents) {
        this.$message({ type: "error", message: "内容不可为空" });
        return;
      }

      this.postingNew2 = true;
      const response = await this.$http.post("/posts", {
        raw: data.contents,
        title: data.topic,
        unlist_topic: false,
        category: data.category.slice(-1)[0],
        is_warning: false,
        archetype: "regular",
        typing_duration_msecs: 3800,
        tags: data.tags,
        nested_post: true
      });
      this.postingNew2 = false;
      if (response.data.success) {
        this.newDiscussionDialogVisible2 = false;
        this.$router.push({
          path: `/topic/${response.data.post.id}`
        });
      } else {
        this.$message({
          type: "error",
          message: "服务器正忙，请稍后再试"
        });
        console.error("post occurs error", response);
      }
    },
    async checkSubCategories(route = this.$route) {
      this.subCategories = [];
      const curr = await this.findCategoryBySlug(route.params.id);
      if (!curr || !curr.has_children || !curr.id) {
        return;
      }
      this.subCategories = await this.getCategories(curr.id);
    },
    onNewDiscussionDialogOpen() {
      document.body.style.position = "fixed";
    },
    onNewDiscussionDialogClose() {
      document.body.style.position = "static";
    },
    closeMobMenu() {
      this.$emit('close-mob-menu')
    }
  },
  async mounted() {
    await Promise.all([this.getCategories(), this.getTags()]);
    await this.checkSubCategories();
  },
  watch: {
    async $route(to, from) {
      await this.checkSubCategories(to);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.new-discussion-dialog2 .el-form-item__label {
  text-align: left !important;
}
.dn {
  display: none;
}

.mob-sidebar-bg-cover {
  position: fixed;
  top: 52px;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #2d3339;
  padding: 15px 15px 0 15px;
  z-index: 2000;
}

#sidebar {
  flex: 2;
  width: 190px;
  min-width: 190px;
  font-size: 14px;
  padding-top: 30px;
}
#sidebar li.active > a, #mob-sidebar li.active > a {
  transition: all 0.3s;
  font-weight: bold;
  color: #333;
}
#mob-sidebar li.active > a {
  color: #555;
}
#sidebar ul.sub-categories li.active > a, #mob-sidebar ul.sub-categories li.active > a {
  font-weight: bold;
  color: #5e5e5e;
  text-decoration: underline;
}
#mob-sidebar ul.sub-categories li.active > a {
  color: #777;
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
  transition: all 0.3s;
}
.new-discussion button:hover {
  opacity: 0.8;
}

.text-button {
  width: 100%;
  display: flex;
  margin: 12px 0;
  flex-direction: column;
  justify-content: center;
}
.text-button > a {
  display: flex;
  color: #667d99;
  transition: all 0.4s;
  align-items: center;
}
#mob-sidebar .new-discussion {
  margin-bottom: 0;
  margin-top: 40px;
}
#mob-sidebar .text-button a {
  color: #fff;
  font-size: 16px;
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
ul.sub-categories {
  margin: 0 28px;
}
ul.sub-categories .text-button {
  margin: 6px 0;
  font-size: 14px;
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
