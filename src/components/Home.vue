<template>
  <div class="container">
    <div class="rokid-events">
      <img src="https://www.rokid.com/img/alien_hero.jpg" />
    </div>
    <div class="rokid-row">
      <div class="rokid-col rokid-excellent">
        <h3>
          <fa-icon class="title-icon" icon="pencil-alt" />
          <span>优质原创</span>
        </h3>
        <ul>
          <li v-for="item in excellentTopics.slice(0, 5)">
            <router-link :to="`/t/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
      <div class="rokid-col rokid-tutorial">
        <h3>
          <fa-icon class="title-icon" icon="book" />
          <span>官方教程</span>
        </h3>
        <ul>
          <li v-for="item in tutorialTopics.slice(0, 5)">
            <router-link :to="`/t/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="rokid-row">
      <div class="rokid-col rokid-hot">
        <h3>
          <fa-icon class="title-icon" icon="fire" />
          <span>热点事件</span>
        </h3>
        <ul>
          <li v-for="item in eventTopics.slice(0, 5)">
            <router-link :to="`/t/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
      <div class="rokid-col rokid-issues">
        <h3>
          <fa-icon class="title-icon" icon="question-circle" />
          <span>常见问题</span>
        </h3>
        <ul>
          <li v-for="item in issueTopics.slice(0, 5)">
            <router-link :to="`/t/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'excellentTopics',
      'tutorialTopics',
      'issueTopics',
      'eventTopics',
    ]),
  },
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  mounted() {
    this.$store.dispatch('pollAllTopics')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 20px;
  padding-top: 30px;
}
.rokid-events {
  background: #eee;
  height: 280px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}
.rokid-events img {
  position: absolute;
  bottom: -150px;
  width: 100%;
}
.rokid-row {
  display: flex;
  margin: 30px 0;
}

.rokid-excellent, .rokid-hot {
  flex: 10;
}
.rokid-tutorial, .rokid-issues {
  flex: 5;
}
.rokid-tutorial li, .rokid-issues li {
  width: 220px;
}

.rokid-latest li,
.rokid-issues li,
.rokid-tutorial li,
.rokid-hot li {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.rokid-col h3 {
  display: flex;
  margin-bottom: 10px;
  color: #667d99;
}
.rokid-col h3 .title-icon {
  margin-right: 8px;
  height: 15px;
  color: inherit;
}
.rokid-col h3 span {
  font-size: 15px;
  line-height: 16px;
}
.rokid-col ul {
  min-height: 100px;
}
.rokid-col li {
  margin: 5px 0;
}

.rokid-col li a {
  color: #667d99;
  transition: all .3s;
  overflow: hidden;
}

.rokid-col li a:hover {
  color: #e7672e;
}

</style>
