<template>
  <div class="container">
    <el-dialog width="50%"
      :title="`修改主题：${title}`"
      :visible.sync="editPostDialogVisible">
      <edit-discussion 
        ref="editDiscussion"
        :topic="rawTopic"
        :post="editingPost" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPostDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePost">保 存</el-button>
      </span>
    </el-dialog>

    <div class="topic-main">
      <div class="spinner" v-if="loading">
        <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
      </div>
      <h1 ref="title"
        :contenteditable="titleEditable"
        @dblclick="editTitle"
        @blur="saveTitle">
        {{title}}
      </h1>
      <ul v-infinite-scroll="onLoadMore" infinite-scroll-distance="10">
        <li class="post"
          :id="`post${index}`"
          v-for="(item, index) in cookedPosts">
          <div class="avatar">
            <img :src="avatar(item.avatar_template, item)"
              :height="avatarSize" 
              :width="avatarSize" />
          </div>
          <div class="contents">
            <div class="post-header">
              <span class="username">{{item.display_username}}</span>
              <span class="datetime">{{calendar(item.created_at)}}</span>
              <span class="floor">#{{index + 1}}</span>
            </div>
            <div class="post-body js-pangu-render" v-html="item.cooked"></div>
            <div class="post-summary">
              <a class="likes"
                :class="item.isLiked ? 'liked' : ''"
                @click="toggleLike(item)">
                <fa-icon :icon="['far', 'thumbs-up']"></fa-icon>
                <span>{{item.likes}}</span>
              </a>
              <a class="replies" title="回复" @click="replyWith(item)">
                <fa-icon icon="reply"></fa-icon>
                <span>{{item.reply_count}}</span>
              </a>
              <div class="post-summary-right-controls">
                <a title="编辑" v-if="item.can_edit" @click="editPost(item)">
                  <fa-icon icon="pencil-alt"></fa-icon>
                  <span>编辑</span>
                </a>
                <a title="收藏" class="bookmark"
                  :class="item.bookmarked ? 'bookmarked' : ''"
                  @click="toggleBookmark(item)">
                  <fa-icon :icon="['far', 'bookmark']"></fa-icon>
                  <span>收藏</span>
                </a>
                <el-popover
                  :ref="`share-popover${index}`"
                  placement="bottom-end"
                  width="300"
                  trigger="click">
                  <span slot="reference">
                    <a class="share" title="分享链接">
                      <fa-icon icon="link"></fa-icon>
                      <span>分享</span>
                    </a>
                  </span>
                  <template>
                    <el-input size="small" autofocus
                      :value="`https://forum.rokid.com/topic/${item.id}?u=${username}#${index + 1}`" />
                    <el-button type="primary" size="small" class="share-popover-copybtn">复制链接</el-button>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="spinner" v-if="loadingMore">
        <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
      </div>
      <div id="reply" class="reply-box">
        <div class="reply-header">
          <fa-icon icon="reply"></fa-icon>
          <span>{{title}}</span>
        </div>
        <editor
          ref="replyEditor"
          :initialValue="contents" />
        <div class="reply-footer">
          <el-button type="primary" size="small" @click="sendReply()">
            <fa-icon icon="reply" /> 发送
          </el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="topic-controls hidden-sm-and-down">
      <affix relative-element-selector="#app-main" :offset="{ top: 40, bottom: 30 }" style="width:170px">
        <el-button type="primary" @click="replyWith()">回复</el-button>
        <el-button>邀请参与</el-button>
      </affix>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapGetters } from 'vuex'
import EditDiscussion from './EditDiscussion'
import MyEditor from './MyEditor'
import pangu from 'pangu'

export default {
  name: 'Topic',
  components: {
    EditDiscussion,
    editor: MyEditor,
    'fa-icon': FontAwesomeIcon,
  },
  data () {
    return {
      title: null,
      posts: [],
      avatarSize: 48,
      loading: true,
      loadingMore: false,
      rendered: false,
      rawTopic: {},
      contents: '',
      replyToPostId: null,
      titleEditable: false,
      editingPost: null,
      editPostDialogVisible: false,
    }
  },
  computed: {
    cookedPosts() {
      return this.posts.map((post) => {
        post.likes = 0
        post.isLiked = false
        post.actions_summary.forEach((action) => {
          if (action.id === 2) {
            post.likes += action.count || 0
            if (!post.isLiked && action.acted) {
              post.isLiked = true
            }
          }
        })
        return post;
      });
    },
    ...mapGetters([
      'username',
    ]),
  },
  methods: {
    // 盘古开天辟地，把文字劈开。search pangu on github for more info
    spacing(text) {
      return pangu.spacing(text)
    },
    avatar(template_url, item) {
      return `https://developer-forum.rokid.com/${template_url.replace('{size}', this.avatarSize)}`
    },
    calendar(date) {
      return moment(date).fromNow()
    },
    editTitle() {
      if (!this.rawTopic.details.can_edit)
        return;
      this.titleEditable = true
    },
    async saveTitle() {
      this.titleEditable = false
      var title = this.$refs.title.innerText
      if (!title) {
        this.$message({ type: 'error', message: '标题不能为空' })
        this.$refs.title.innerText = this.title
        return
      }
      if (title === this.title) {
        // just skip it if the title is not changed
        return;
      }
      var { data } = await this.$http.put(`/t/topic/${this.rawTopic.id}`, { title })
      this.title = title
      this.$message({ type: 'success', message: '标题修改成功' })
    },
    editPost(item) {
      this.editingPost = item
      this.editPostDialogVisible = true
      setTimeout(() => {
        this.$refs.editDiscussion.setPost(item)
      }, 100)
    },
    async savePost() {
      var discussion = this.$refs.editDiscussion
      if (!discussion.data.topic) {
        this.$message({ type: 'error', message: '标题不能为空' })
        return
      }
      if (!discussion.contents) {
        this.$message({ type: 'error', message: '文章不能为空' })
        return
      }
      if (discussion.isEditTopic) {
        await this.$http.put(`/t/topic/${this.rawTopic.id}`, {
          title: discussion.data.topic,
          tags: discussion.data.tags,
        })
      }
      this.$http.put(`/posts/${discussion.post.id}`, {
        post: {
          raw: discussion.contents,
        },
      }).then((response) => {
        this.editPostDialogVisible = false
        this.$message({ type: 'success', message: '修改成功' })
        this.reload()
      }).catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          this.$alert(error.response.data.errors.join(''))
        }else{
          this.$alert('啊哦😰！未知错误，你可以给我们反馈')
        }
      })
    },
    async toggleLike(post) {
      if (post.isLiked) {
        this.$message({
          message: '你已经赞过了',
        })
      } else {
        post.isLiked = true
        post.likes += 1
        this.$forceUpdate()
        var res = await this.$http.request({
          method: 'post',
          url: '/post_actions',
          data: {
            id: post.id,
            post_action_type_id: 2, // for like, is 2
          }
        })
      }
    },
    replyWith(item) {
      if (item) {
        this.contents = ''
        // bug-fix: 第一次点击回复后，把editor内容清空，再点击同一个人回复失效
        this.$nextTick(() => {
          this.contents = `@${item.username} `
          this.replyToPostId = item.id
          this.$scrollTo('#reply', 800)
          this.$refs.replyEditor.focus()
        });
      }

    },
    async sendReply() {
      var eidtor = this.$refs.replyEditor
      var data = {
        raw: eidtor.value,
        unlist_topic: false,
        category: this.rawTopic.category_id,
        topic_id: this.rawTopic.id,
        is_warning: false,
        archetype: this.rawTopic.archetype,
        nested_post: false,
      }
      if (this.replyToPostId) {
        data.reply_to_post_number = this.replyToPostId
        data.nested_post = true
      }

      this.$http.request({
        method: 'post',
        url: '/posts',
        data,
      }).then((response) => {
        let resultPost
        if (this.replyToPostId && response.data.success) {
          resultPost = response.data.post 
        } else {
          resultPost = response.data
        }
        // hack: 发表回复后图片路径替换。discourse会自动替换，但posts不会
        resultPost.cooked = resultPost.cooked.replace(/<img src="(\S+)"/g, '<img src="//developer-forum.rokid.com$1"')
        // bug-fix: 原评论数没同步，导致无限加载
        this.rawTopic.posts_count++;
        this.posts.push(resultPost)
        this.contents = ' '
        // hack: 发表回复后清空编辑器
        this.$nextTick(() => {
          this.contents = ''
        })
        this.replyToPostId = null
      }).catch((error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          this.$alert(error.response.data.errors.join(''))
        }else{
          this.$alert('啊哦😰！未知错误，你可以给我们反馈')
        }
      })

    },
    postViewHandler(index, event) {
      if (this.rendered) {
        if (event.type === 'enter') {
          this.$router.replace({
            path: `#${index}`,
          })
          return
        }
      }
    },
    async reload() {
      this.$scrollTo('body', 300)
      this.loading = true

      var res = await this.$http.get(`/t/${this.$route.params.id}.json`)
      this.rawTopic = res.data
      this.title = res.data.title
      this.posts = res.data.post_stream.posts
      this.loading = false
    },
    async onLoadMore() {
      if (this.loadingMore || this.loading)
        return;

      if (this.rawTopic.posts_count === this.posts.length)
        return;
      
      this.loadingMore = true
      var lastId = this.posts.length + 6
      var res = await this.$http.get(`/t/${this.$route.params.id}/${lastId}.json`)
      var next = res.data.post_stream.posts
      
      if (next && next.length) {
        for (let i = 0; i < next.length; i++) {
          let j = next[i].post_number - 1
          this.posts[j] = next[i]
        }
        this.$forceUpdate();
      }
      
      this.loadingMore = false
    },
    async toggleBookmark(post) {
      var val = !post.bookmarked
      post.bookmarked = val
      this.$forceUpdate()

      var data = new FormData()
      data.set('bookmarked', post.bookmarked)
      await this.$http.put(`/posts/${post.id}/bookmark`, data, {
        config: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      })
    }
  },
  async mounted() {
    await this.reload()

    setTimeout(() => {
      if (this.$route.hash) {
        this.$scrollTo(`#post${this.$route.hash.slice(1)}`, 300, {
          offset: -52,
        })
        setTimeout(() => this.rendered = true, 300)
      } else {
        this.rendered = true
      }
      pangu.spacingElementByClassName('js-pangu-render')
    }, 300)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  display: flex;
  margin-left: 30px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.spinner {
  text-align: center;
  padding: 10vh 0;
}
.topic-main {
  flex: 8;
}
.topic-main > h1 {
  font-size: 22px;
}
.topic-main > h1,
.topic-main > ul {
  width: 100%;
}
.topic-controls {
  flex: 2;
}
.post {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #e7edf3;
}
.post .avatar {
  width: 85px;
}
.post .avatar img {
  border-radius: 24px;
  border: 1px solid #ececec;
}
.post .contents {
  width: 100%;
  overflow: auto;
}
.post-header {
  font-size: 14px;
}
.post-header .username {
  font-weight: bold;
  margin-right: 10px;
}
.post-header .datetime {
  color: #667d99;
}
.post-header .floor {
  float: right;
}
.post-body {
  padding-top: 10px;
  font-family: 'PingFang SC', Helvetica, Arial, sans-serif;
  font-size: 16px;
  color: #222;
  line-height: 1.8;
}
.post-summary {
  margin: 20px 0 0 0;
}
.post-summary a {
  display: inline-block;
  width: 35px;
  transition: all .3s;
  color: #2c3e50;
  cursor: pointer;
}
.post-summary a:hover,
.post-summary a.liked,
.post-summary a.bookmarked {
  color: #e7672e;
}
.post-summary-right-controls {
  width: 160px;
  float: right;
  text-align: right;
}
.post-summary-right-controls a {
  width: 50px;
}
.share-popover-copybtn {
  margin-top: 10px;
}

/**
 * right controls styles
 */
.topic-controls button {
  width: 100%;
  display: block;
  margin: 0 0 10px 0;
}
/**
 * editor css
 */
.reply-box {
  padding-top: 20px;
}
.reply-header {
  margin-bottom: 10px;
  font-size: 16px;
}
.reply-footer {
  margin-top: 10px;
}

@media only screen and (max-width: 767px) {
  .container {
    margin-left: 0;
  }
  #post0 .contents {
    margin-left: -85px;
  }
  #post0 .contents .post-header {
    line-height: 48px;
    padding-left: 85px;
  }
}
</style>
