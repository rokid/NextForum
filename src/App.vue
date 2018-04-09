<template>
  <div id="app">
    <header id="app-header" :class="scrolled ? 'layup' : ''">
      <div class="inner">
        <img id="header-logo" src="http://s.rokidcdn.com/forum/logo.png" />
        <ul id="header-index">
          <li><router-link to="/">首页</router-link></li>
          <li><a href="/guidance">新手指南</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
        <div id="header-controls">
          <div id="header-search-box">
            <fa-icon icon="search" />
            <input ref="searchInput" 
              placeholder="搜索帖子、问答" v-model="query" @keyup="search" />
          </div>
          <div id="header-user-box">
            <router-link id="header-notification" to="/notifications">
              <el-badge :is-dot="unreadNotifications.length > 0">
                <fa-icon icon="bell" />
              </el-badge>
            </router-link>
            <a id="header-login-btn" :href="loginUrl" v-if="!authorized">登录</a>
            <a id="header-login-btn" v-else :href="profileUrl">{{username}}</a>
          </div>
        </div>
      </div>
    </header>
    <div id="app-contents">
      <div class="inner">
        <sidebar></sidebar>
        <div id="app-main">
          <router-view/>
        </div>
      </div>
    </div>
    <div id="app-footer">
      <div class="inner">
        <img src="https://developer.rokid.com/static/img/logo-developer-bottom.5c6d18f.png" />
        <ul>
          <li><a href="#">文档中心</a></li>
          <li><a href="#">开发者中心</a></li>
          <li><a href="#">GitHub</a></li>
          <li><a href="#">智能家居</a></li>
          <li><a href="#">若琪官网</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Sidebar,
    'fa-icon': FontAwesomeIcon,
  },
  data() {
    return {
      scrolled: false,
      loginUrl: `https://developer-forum.rokid.com/session/sso?return_path=${location.href}`,
      query: null,
    }
  },
  computed: {
    ...mapGetters(['authorized', 'username', 'unreadNotifications']),
    profileUrl() {
      return `https://developer-forum.rokid.com/u/${this.username}/`
    },
  },
  methods: {
    ...mapActions(['login']),
    onscroll() {
      this.scrolled = window.scrollY > 0
    },
    search(event) {
      if (event.keyCode === 13) {
        this.$router.push({
          path: `/search?q=${this.query}`,
        })
        this.query = null
        this.$refs.searchInput.blur()
      }
    },
  },
  mounted() {
    this.$store.dispatch('fetchCsrfToken')
    this.$store.dispatch('loadNotifications')
  },
  beforeMount() {
    window.addEventListener('scroll', this.onscroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onscroll)
  },
}
</script>
<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#app-header {
  position: fixed;
  z-index: 1000;
  background: #fff;
  padding: 8px;
  height: 52px;
  width: 100%;
  border-bottom: 1px solid #d3d3d3;
  transition: all .4s;
}

#app-header.layup {
  box-shadow: 1px 1px 4px #ccc;
}

#app-header .inner {
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

#app-header a {
  margin-bottom: 0;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  font-weight: bold;
  padding: 8px 13px;
  color: #667d99;
  text-decoration: none;
}

#app-header a:hover {
  color: #e7672e;
}

#header-logo {
  max-height: 35px;
  float: left;
}

#header-index, #header-index li, #header-index a {
  display: inline-block;
  transition: .2s;
}

#header-controls {
  float: right;
}

#header-search-box {
  display: inline-block;
  overflow: hidden;
  position: relative;
}

#header-search-box > svg {
  position: absolute;
  left: 12px;
  top: 12px;
}

#header-search-box > input {
  font-size: 13px;
  font-weight: bold;
  background: #e7edf3;
  border: 2px solid transparent;
  border-radius: 5px;
  width: 225px;
  height: 36px;
  color: #667d99;
  line-height: 1.5;
  padding-left: 32px;
  padding-right: 32px;
  transition: all .3s;
}

#header-search-box input:focus {
  width: 300px;
  background: #fff;
  border: 2px solid #e7672e;
}

#header-user-box {
  margin-left: 10px;
  display: inline-block;
}

#header-user-box > a {
  float: left;
}

#header-login-btn {
  float: right;
  cursor: pointer;
}

#app-contents {
  width: 100%;
  padding-top: 52px;
  background: #fff;
}

#app-contents .inner {
  display: flex;
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

#app-main {
  width: 100%;
  min-height: 95vh;
}

#app-footer {
  color: #fff;
  background: #2d3339;
  padding: 20px 0;
}

#app-footer .inner {
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 15px;
  padding-right: 15px;
}

#app-footer img {
  max-height: 35px;
}

#app-footer ul {
  float: right;
}
#app-footer ul > li {
  display: inline-block;
}
#app-footer a {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  line-height: 35px;
  margin: 0 7px;
  transition: all .2s;
}
#app-footer a:hover {
  color: #00b0d5;
}
</style>
