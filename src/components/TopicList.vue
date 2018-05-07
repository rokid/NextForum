<template>
  <div class="topic-list">
    <div class="spinner" v-if="state === 'init'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
    <ul v-infinite-scroll="onLoadMore" infinite-scroll-distance="10">
      <li class="topic" v-for="item in topics">
        <div class="topic-avatar">
          <img :src="avatar(item.posters[0].user_id)" />
        </div>
        <div class="topic-body" @click="onClickItem(item)">
          <h3>
            <fa-icon icon="thumbtack" v-if="item.pinned"></fa-icon>
            <span v-html="item.fancy_title"></span>
          </h3>
          <p>
            <fa-icon icon="reply"></fa-icon>
            <span class="topic-last-user">{{item.last_poster_username}}</span>
            <span class="topic-last-post">{{calendar(item.last_posted_at)}}回复</span>
          </p>
        </div>
        <div class="topic-controls">
          <router-link v-for="tag in item.tags"
            class="topic-tag" 
            :to="`/category/tag?id=${tag}`">{{tag}}</router-link>
          <ul class="topic-summary">
            <li>
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

<script type="text/javascript">
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'TopicList',
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  props: ['topics', 'users', 'fetch', 'onClickItem'],
  data() {
    return {
      state: 'init',
      loadable: false,
    }
  },
  methods: {
    avatar(id) {
      const user = this.users.find((user) => user.id === id)
      if (user)
        return `https://developer-forum.rokid.com/${user.avatar_template.replace('{size}', 36)}`
      else
        return null
    },
    calendar(date) {
      return moment(date).fromNow()
    },
    number(val) {
      if (val > 1000) {
        return `${parseInt(val / 1000)}k`
      } else {
        return val
      }
    },
    async onLoadMore() {
      if (!this.loadable)
        return;
      this.loadable = false
      this.state = 'next'
      await this.$props.fetch()
      this.state = 'finished'
      this.loadable = true
    },
    async reload() {
      this.state = 'init'
      await this.$props.fetch()
      this.state = 'finished'
      this.loadable = true
    },
  }
}
</script>

<style scoped>
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
  color: #333;
  font-size: 13px;
  display: inline-block;
  padding: 3px 5px;
  margin: 0 3px;
  border-radius: 3px;
  background: #eee;
  transition: all .3s;
}
.topic-tag:hover {
  background: #e7672e;
  color: #fff;
}
.topic-summary {
  display: inline-block;
  padding-left: 15px;
}
.topic-summary > li {
  display: inline-block;
  width: 45px;
  text-align: left;
}
</style>
