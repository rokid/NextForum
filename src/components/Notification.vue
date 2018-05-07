<template>
  <div class="container">
    <ul>
      <li class="list-item"
        :class="item.read ? 'read' : ''"
        @click="redirect(item)" 
        v-for="item in allNotifications">
        <div class="item-avatar">
          <fa-icon :icon="iconName(item.notification_type)" style="font-size:18px" />
        </div>
        <div class="item-main">
          <p v-if="item.notification_type === 2">
            <b>{{item.data.display_username}}</b>
            回复了你
            <a>{{item.fancy_title}}</a>
          </p>
          <p v-if="item.notification_type === 5">
            <b>{{item.data.display_username}}</b>
            赞了你在
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
            中的回复
          </p>
          <p v-if="item.notification_type === 6">
            <b>{{item.data.display_username}}</b>
            给你发送了消息
            <a>{{item.fancy_title}}</a>
          </p>
          <p v-if="item.notification_type === 9">
            <b>{{item.data.display_username}}</b>
            评论了
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 12">
            <b>{{item.data.username}}</b>设置了{{item.data.badge_name}}
          </p>
          <!-- for custom resolve plugin -->
          <p v-if="item.notification_type === 14 && item.data.message === 'solved.accepted_notification'">
            <b>{{item.data.display_username}}</b>
            接受了你在
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
            中的回复
          </p>
        </div>
        <div class="item-right">
          <span>{{formatDate(item.created_at)}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'Notification',
  computed: {
    ...mapGetters(['allNotifications']),
  },
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  methods: {
    iconName(type) {
      if (type === 2) {
        return 'reply'
      } else if (type === 5) {
        return ['far', 'heart']
      } else if (type === 6) {
        return ['far', 'envelope']
      } else if (type === 9) {
        return ['far', 'comment']
      } else if (type === 12) {
        return ['far', 'heart']
      } else if (type === 14) {
        return ['far', 'check-circle']
      }
    },
    formatDate(d) {
      return moment(d).fromNow()
    },
    redirect(item) {
      this.$router.push({
        path: `/topic/${item.topic_id}#${item.post_number - 1}`,
      })
    },
  },
  mounted() {
    this.$scrollTo('body', 300)
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 30px;
}
.list-item {
  display: flex;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  transition: all .3s;
}
.list-item.read {
  opacity: 0.55;
}
.list-item:hover {
  background: rgb(231, 237, 243);
  opacity: 1;
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
  flex: 14;
}
.item-main h3 {
  color: #667d99;
  font-size: 16px;
  font-weight: bold;
}
.item-main p {
  color: #787878;
}
.item-right {
  flex: 3;
  text-align: right;
}
</style>
