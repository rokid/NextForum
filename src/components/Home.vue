<template>
  <div class="container">
    <div class="rokid-events">
      <router-link to="/topic/2023" class="rokid-event-link"></router-link>
    </div>
    <el-row class="rokid-row">
      <el-col :span="11" :xs="24" class="rokid-col rokid-excellent">
        <h3>
          <fa-icon class="title-icon" icon="pencil-alt" />
          <span>优质原创</span>
        </h3>
        <ul>
          <li v-for="item in excellentTopics.slice(0, max)">
            <router-link :to="`/topic/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </el-col >
      <el-col :span="11" :xs="24" :offset="1" class="rokid-col rokid-tutorial">
        <h3>
          <fa-icon class="title-icon" icon="book" />
          <span>官方教程</span>
        </h3>
        <ul>
          <li v-for="item in tutorialTopics.slice(0, max)">
            <router-link :to="`/topic/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </el-col>
    </el-row>
    <el-row class="rokid-row">
      <el-col :span="11" :xs="24" class="rokid-col rokid-hot">
        <h3>
          <fa-icon class="title-icon" icon="fire" />
          <span>热点事件</span>
        </h3>
        <ul>
          <li v-for="item in eventTopics.slice(0, max)">
            <router-link :to="`/topic/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="11" :xs="24" :offset="1" class="rokid-col rokid-issues">
        <h3>
          <fa-icon class="title-icon" icon="question-circle" />
          <span>常见问题</span>
        </h3>
        <ul>
          <li v-for="item in issueTopics.slice(0, max)">
            <router-link :to="`/topic/${item.id}`" :title="item.title">{{item.title}}</router-link>
          </li>
        </ul>
      </el-col>
    </el-row>
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
  data() {
    return {
      max: 7,
    };
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
  position: relative;
  background: #eee;
  height: 280px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background-image: url('https://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/banner/0706large.png');
  background-size: 100%;
}
.rokid-events .rokid-event-link {
  display: block;
  width: 100%;
  height: 100%;
}

.rokid-row {
  margin: 30px 0;
}

.rokid-excellent li,
.rokid-latest li,
.rokid-issues li,
.rokid-tutorial li,
.rokid-hot li {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.rokid-col h3 {
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
  margin-left: 5px;
}

.rokid-col li {
  margin: 5px 0;
  list-style: circle inside;
  padding-left: 2px;
}

.rokid-col li a {
  color: #667d99;
  font-size: 14px;
  transition: all .3s;
  overflow: hidden;
}

.rokid-col li a:hover {
  color: #e7672e;
}

@media only screen and (max-width: 768px) {
  .rokid-events {
    background-image: url('https://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/banner/0706mini.png');
    background-size: 100%;
  }
  .container {
    padding: 30px 0 20px 0;
  }
  .rokid-row {
    margin: 0;
  }
  .rokid-col {
    margin: 30px 0 0 0;
  }
  .rokid-col h3 {
    margin-bottom: 3vw;
  }
  .rokid-col h3 span {
    font-size: 5vw;
  }
  .rokid-col li {
    list-style: none;
  }
  .rokid-col li a {
    font-size: 4vw;
  }
  .rokid-col h3 .title-icon {
    height: 5vw;
    width: 5vw;
  }
}

</style>
