<template>
  <div class="container">
    <div class="controls">
      <el-select class="full-width" v-model="orderBy" size="small" @change="reload()">
        <el-option key="latest"
          :label="orderType.latest" value="latest"></el-option>
        <el-option key="top"
          :label="orderType.top" value="top"></el-option>
      </el-select>
    </div>
    <topic-list 
      ref="topicList"
      :topics="topics"
      :users="users"
      :fetch="fetch"
      :onClickItem="goTopic" />
  </div>
</template>

<script>
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import TopicList from '@/components/TopicList'

export default {
  name: 'Category',
  components: {
    'fa-icon': FontAwesomeIcon,
    TopicList,
  },
  data() {
    return {
      nextUrl: null,
      topics: [],
      users: [],
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
    async fetch() {
      if (!this.nextUrl)
        return

      let response = await this.$http.get(this.nextUrl)
      this.topics = this.topics
        .concat(response.data.topic_list.topics)
        .filter(topic => topic.visible)
      this.users = this.users.concat(response.data.users)
      this.nextUrl = response.data.topic_list.more_topics_url
    },
    async reload(slug, subSlug) {
      this.$scrollTo('body', 300)
      if (!slug) {
        slug = this.$route.params.id
        subSlug = this.$route.params.subId
      }

      this.topics.length = 0
      this.users.length = 0

      if (slug === 'all') {
        this.nextUrl = `/${this.orderBy}.json`
      } else if (slug === 'activity') {
        this.nextUrl = `/${this.orderBy}.json?tags=活动`
      } else if (slug === 'faq') {
        this.nextUrl = `/${this.orderBy}.json?tags=常见问题`
      } else if (slug === 'tag') {
        this.nextUrl = `/${this.orderBy}.json?tags=${this.$route.query.id}`
      } else {
        let slugs = [slug, subSlug].filter(item => !!item).join('/')
        this.nextUrl = `/c/${slugs}/l/${this.orderBy}.json?no_subcategories=false`
      }
      await this.$refs.topicList.reload()
    },
    goTopic(item) {
      let path = `/topic/${item.id}`
      if (this.orderBy === 'latest' && item.posts_count > 1) {
        path = `${path}#${item.posts_count - 1}`
      }
      this.$router.push({ path })
    },
  },
  watch: {
    $route(to, from) {
      var { id, subId } = to.params
      this.reload(id, subId)
    },
  },
  mounted() {
    var { id, subId } = this.$route.params
    this.reload(id, subId)
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
@media only screen and (max-width: 767px) {
  .container {
    padding: 30px 0;
  }
  .full-width {
    width: 100%;
  }
}
</style>
