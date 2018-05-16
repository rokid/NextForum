<template>
  <div id="app">
    <a class="github-link" href="https://github.com/Rokid/NextForum"><img style="position: fixed; z-index: 2300; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" alt="Fork me on GitHub"></a>
    <header id="app-header" :class="scrolled ? 'layup' : ''">
      <div class="inner">
        <fa-icon icon="bars" @click="toggleShowMobMenu" class="mob-menu"></fa-icon>
        <router-link to="/" id="header-logo"></router-link>
        <ul id="header-index">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/topic/1983">新手指南</router-link></li>
          <li><router-link to="/category/faq">FAQ</router-link></li>
        </ul>
        <el-row id="header-controls" type="flex" justify="end">
          <el-col :span="20" id="header-search-box">
            <fa-icon icon="search" />
            <input ref="searchInput" 
              placeholder="搜索帖子、问答" v-model="query" @keyup="search" />
          </el-col>
          <el-col :span="4" id="header-user-box">
            <router-link v-if="authorized" id="header-notification" class="hidden-xs-only" to="/notifications">
              <el-badge :is-dot="unreadNotifications.length > 0">
                <fa-icon icon="bell" />
              </el-badge>
            </router-link>
            <a id="header-login-btn" :href="loginUrl" v-if="!authorized">登录</a>
            <a id="header-login-btn" v-else :href="profileUrl">
              <fa-icon icon="user" />
            </a>
          </el-col>
        </el-row>
      </div>
    </header>
    <div id="app-contents">
      <div class="inner">
        <!-- listen click event -->
        <sidebar :show-mob-menu="isShowMobMenu" @close-mob-menu="toggleShowMobMenu"></sidebar>
        <div id="app-main">
          <router-view/>
        </div>
      </div>
    </div>
    <div id="app-footer">
      <div class="inner">
        <img src="https://developer.rokid.com/static/img/logo-developer-bottom.5c6d18f.png" />
        <ul>
          <li><a target="_blank" href="https://developer.rokid.com/docs">文档中心</a></li>
          <li><a target="_blank" href="https://developer.rokid.com">开发者中心</a></li>
          <li><a target="_blank" href="https://github.com/Rokid">GitHub</a></li>
          <li><a target="_blank" href="https://www.rokid.com/smarthome/">智能家居</a></li>
          <li><a target="_blank" href="https://www.rokid.com">若琪官网</a></li>
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
      isShowMobMenu: false,
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
    toggleShowMobMenu() {
      this.isShowMobMenu = !this.isShowMobMenu;
    }
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
/**
  overwrite for elementUI
*/
.el-dialog__header {
  border-bottom: 1px solid #ccc;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.mob-menu {
  display: none;
}

#app-header {
  position: fixed;
  z-index: 1000;
  background: #fff;
  padding: 8px;
  height: 52px;
  width: 100%;
  border-bottom: 1px solid #d3d3d3;
  font-size: 14px;
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
  background: url(http://s.rokidcdn.com/forum/logo.png);
  background-size: cover;
  height: 35px;
  width: 160px;
  float: left;
}


#header-index, #header-index li, #header-index a {
  display: inline-block;
  transition: .2s;
}

#header-controls {
  float: right;
  width: 45%;
}

#header-search-box {
  display: block;
  overflow: hidden;
  position: relative;
}

#header-search-box > svg {
  position: absolute;
  left: 12px;
  top: 12px;
}

#header-search-box > input {
  font-size: 14px;
  font-weight: bold;
  background: #e7edf3;
  border: 2px solid transparent;
  border-radius: 5px;
  height: 36px;
  width: 100%;
  color: #667d99;
  line-height: 1.5;
  padding-left: 32px;
  transition: all .3s;
}

#header-search-box input:focus {
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

@media only screen and (max-width: 1100px) {
  #app-header .inner {
    width: 100%;
  }
  #header-logo {
    width: 51px;
  }
  #header-index {
    display: none;
  }
  #header-controls {
    width: 75%;
  }
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
  min-height: 75vh;
}

@media only screen and (max-width: 1100px) {
  #app-contents .inner {
    width: 100%;
  }
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

@media only screen and (max-width: 1100px) {
  #app-footer .inner {
    width: 100%;
  }
}

@media only screen and (max-width: 767px) {
  .github-link {
    display: none;
  }
  #header-logo {
    display: none;
  }
  .mob-menu {
    display: block;
    float: left;
    height: 35px;
    width: 20px !important;
  }
  #app-contents .inner {
    padding-bottom: 10px;
    display: block;
  }
}
</style>
