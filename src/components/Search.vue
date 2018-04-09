<template>
  <div class="container">
    <div class="spinner" v-if="state === 'init'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
    <ul>
      <li class="list-item" @click="goTopic(item.topic_id)" v-for="item in posts">
        <div class="item-avatar">
          <img :src="avatar(item)" />
        </div>
        <div class="item-main">
          <h3>{{title(item.topic_id)}}</h3>
          <p>{{item.blurb}}</p>
        </div>
      </li>
    </ul>
    <div v-if="state === 'finished' && !posts.length">
      <p>没有相关的答案，请重新搜索</p>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import TopicList from '@/components/TopicList'

export default {
  name: 'Search',
  data () {
    return {
      state: 'init',
      raw: {},
      posts: [],
    }
  },
  components: {
    'fa-icon': FontAwesomeIcon,
    TopicList,
  },
  methods: {
    avatar(post) {
      return `https://developer-forum.rokid.com/${post.avatar_template.replace('{size}', 36)}`
    },
    title(topicId) {
      const topic = this.raw.topics.find((item) => item.id === topicId)
      if (!topic)
        return null
      return topic.fancy_title
    },
    goTopic(id) {
      this.$router.push({
        path: `/topic/${id}`,
      })
    },
    async execSearch() {
      this.raw = {}
      this.posts = []
      this.state = 'init'
      const response = await this.$http.get('/search?q=' + this.$route.query.q)
      this.raw = response.data
      this.posts = this.raw.posts
      this.state = 'finished'
    },
  },
  watch: {
    $route(to, from) {
      this.execSearch()
    },
  },
  async mounted() {
    this.execSearch()
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 30px;
}
.spinner {
  text-align: center;
  padding: 10vh 0;
}
.list-item {
  display: flex;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  transition: all .3s;
}
.list-item:hover {
  background: rgb(231, 237, 243);
}
.item-avatar {
  flex: 1;
}
.item-avatar img {
  height: 36px;
  width: 36px;
  border-radius: 18px;
}
.item-main {
  flex: 12;
}
.item-main h3 {
  color: #667d99;
  font-size: 16px;
  font-weight: bold;
}
.item-main p {
  color: #787878;
}
</style>
