<template>
  <div class="container">
    <div class="controls">
      <el-select v-model="orderBy" size="small" @change="reload()">
        <el-option key="latest"
          :label="orderType.latest" value="latest"></el-option>
        <el-option key="top"
          :label="orderType.top" value="top"></el-option>
      </el-select>
    </div>
    <div class="spinner" v-if="state === 'init'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
    <ul v-infinite-scroll="more" infinite-scroll-distance="10">
      <li class="topic" @click="goTopic(item)" v-for="item in topics">
        <div class="topic-avatar">
          <img :src="avatar(item.posters[0].user_id)" />
        </div>
        <div class="topic-body">
          <h3>
            <fa-icon icon="thumbtack" v-if="item.pinned"></fa-icon>
            {{item.fancy_title}}
          </h3>
          <p>
            <fa-icon icon="reply"></fa-icon>
            <span class="topic-last-user">{{item.last_poster_username}}</span>
            <span class="topic-last-post">{{calendar(item.last_posted_at)}}回复</span>
          </p>
        </div>
        <div class="topic-controls">
          <span class="topic-tag" v-for="tag in item.tags">
            {{tag}}
          </span>
          <ul class="topic-summary">
            <li :style="item.posts_count > 1 ? '' : 'visibility:hidden'">
              <fa-icon :icon="['far', 'comment']"></fa-icon>
              <span>{{number(item.posts_count - 1)}}</span>
            </li>
            <li>
              <fa-icon :icon="['fas', 'eye']"></fa-icon>
              <span>{{number(item.views)}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="spinner" v-if="state === 'next'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'Category',
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  data() {
    return {
      nextUrl: null,
      topics: [],
      users: [],
      state: 'init',
      orderBy: 'latest',
      orderType: {
        latest: '最新',
        top: '热门',
      },
    }
  },
  computed: {
    orderText() {
      return this.orderType[this.orderBy]
    },
  },
  methods: {
    avatar(id) {
      const user = this.users.find((user) => user.id === id)
      if (user)
        return `https://developer-forum.rokid.com/${user.avatar_template.replace('{size}', 36)}`
      else
        return null
    },
    number(val) {
      if (val > 1000) {
        return `${parseInt(val / 1000)}k`
      } else {
        return val
      }
    },
    goTopic(item) {
      let path = `/topic/${item.id}`
      if (this.orderBy === 'latest') {
        path = `${path}#${item.posts_count - 1}`
      }
      this.$router.push({ path })
    },
    calendar(date) {
      return moment(date).fromNow()
    },
    async more() {
      this.state = 'next'
      await this.fetch()
      this.state = 'finished'
    },
    async fetch() {
      if (!this.nextUrl)
        return

      let response = await this.$http.get(this.nextUrl)
      this.topics = this.topics.concat(response.data.topic_list.topics)
      this.users = this.users.concat(response.data.users)
      this.nextUrl = response.data.topic_list.more_topics_url
    },
    async reload(id) {
      this.$scrollTo('body', 300)
      this.state = 'init'
      if (!id)
        id = this.$route.params.id

      this.topics.length = 0
      this.users.length = 0

      if (id === 'all') {
        this.nextUrl = `/${this.orderBy}.json`
      } else {
        this.nextUrl = `/c/${id}/l/${this.orderBy}.json?no_subcategories=false`
      }
      await this.fetch()
      this.state = 'finished'
    },
  },
  watch: {
    $route(to, from) {
      this.reload(to.params.id)
    },
  },
  mounted() {
    this.reload(this.$route.params.id)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 30px;
}
.controls {
  margin-bottom: 20px;
}
.spinner {
  text-align: center;
  padding: 10vh 0;
}
.topic {
  display: flex;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  transition: all .3s;
}
.topic:hover {
  background: rgb(231, 237, 243);
}
.topic-avatar {
  flex: 1;
}
.topic-avatar img {
  height: 36px;
  width: 36px;
  border-radius: 18px;
}
.topic-body {
  flex: 10;
}
.topic-body h3 {
  color: #667d99;
  font-size: 16px;
  font-weight: bold;
}
.topic-body p {
  color: #787878;
}
.topic-last-user {
  font-weight: bold;
}
.topic-controls {
  flex: 6;
  text-align: right;
}
.topic-tag {
  font-size: 10px;
  display: inline-block;
  padding: 3px 5px;
  margin: 0 3px;
  border-radius: 3px;
  background: #eee;
}
.topic-summary {
  display: inline-block;
  padding-left: 15px;
}
.topic-summary > li {
  display: inline-block;
  width: 40px;
  text-align: left;
}
</style>
