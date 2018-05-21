// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueAffix from 'vue-affix'
import VueScrollTo from 'vue-scrollto'
import VueInfiniteScroll from 'vue-infinite-scroll'
import * as VueCheckView from 'vue-check-view'
import MavonEditor from 'mavon-editor'
import * as ElementUI from 'element-ui'
import popover from 'element-ui/packages/popover/src/directive'

import axios from 'axios'
import moment from 'moment'
import fontawesome from '@fortawesome/fontawesome'
import faRegular from '@fortawesome/fontawesome-free-regular'
import faSolid from '@fortawesome/fontawesome-free-solid'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'mavon-editor/dist/css/index.css'
import '@/styles/normalize.css'
import '@/styles/post.css'
import '@/styles/editor.css'

import App from './App'
import router from './router'
import store from './store'

fontawesome.library.add(faRegular)
fontawesome.library.add(faSolid)
moment.locale('zh-CN')

var httpOpts = {
  baseURL: 'https://developer-forum.rokid.com/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
  withCredentials: true,
}

Vue.config.productionTip = false

function createHttp(opts) {
  var _http = axios.create(opts)
  _http.interceptors.response.use((response) => {
    var username = response.headers['x-discourse-username']
    if (username)
      store.dispatch('login', { username })
    return response
  })
  return _http
}

Vue.http = Vue.prototype.$http = createHttp(httpOpts)
Vue.registerWithCsrfToken = function(token) {
  Vue.http = Vue.prototype.$http = createHttp({
    ...httpOpts,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': token,
    }
  })
}

Vue.use(VueCookie)
Vue.use(VueAffix)
Vue.use(VueScrollTo)
Vue.use(VueInfiniteScroll)
Vue.use(VueCheckView)
Vue.use(MavonEditor)
Vue.use(ElementUI)
Vue.directive('popover', popover)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


postCreditsScene();

function postCreditsScene(){
  // console.clear()
  console.info('你想干嘛？想跟我们一起play？请@大发');
  var charLogo = '\n ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄    ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄  \n▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ \n▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌ ▐░▌  ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌\n▐░▌       ▐░▌▐░▌       ▐░▌▐░▌▐░▌       ▐░▌     ▐░▌       ▐░▌\n▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░▌░▌        ▐░▌     ▐░▌       ▐░▌\n▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░▌         ▐░▌     ▐░▌       ▐░▌\n▐░█▀▀▀▀█░█▀▀ ▐░▌       ▐░▌▐░▌░▌        ▐░▌     ▐░▌       ▐░▌\n▐░▌     ▐░▌  ▐░▌       ▐░▌▐░▌▐░▌       ▐░▌     ▐░▌       ▐░▌\n▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▐░▌  ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌\n▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ \n ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀    ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀  \n\n';
  console.log(charLogo)
  initShell();
  console.log(window.help)
}

function initShell() {
  var menu = {
    'help': function(){
      return `--------------------------------------------------------------
 -------------       cshell 一秒钟从入门到精通        ------------
 --------------------------------------------------------------
 提示：按回车可以自动补全哦，请在Chrome下体验☺️
 help - 查看所有可用命令的用法
 bug - 反馈bug或帮助我们修复bug
 fork - 查看论坛的GitHub地址
 rokid() - 你自己看看就知道了，别忘了括号
 misa() - 你们这帮土人！输入命令看看不就知道了
 whos - 看看这里都有谁？听说他们很喜欢和你玩哦
 who.is.$name - 如果你想了解更多他们的信息，请把 $name 替换成相应的人名
 $name - 你也可以直接输入中文人名了解哦
 about - 关于我们
 cshell - 这是什么东西？
 更多彩蛋等你发现
`
    },
    'bug': function(){
      return `你发现bug了？可以@大发向我们提交bug，或者fork me on github
 输入 dafa 了解大发，输入 fork 获取GitHub地址`;
    },
    'fork': function(){
      return `点击链接查看文档：https://github.com/Rokid/NextForum`
    },
    'whos': function(){
      return `dafa - 颜值担当
 sudo - bug担当
 yorkie - niubility担当
 misa - 你们这帮土人`
    },
    'about': function(){
      return `其实没什么，既然你诚心诚意的输入命令了，那我们就大发慈悲的告诉你：我们是 - welcome to the jungle ! 快来和我们一起玩！`
    },
    'cshell': function(){
      return `Console Shell，我叫它 cshell。哈哈，胡扯的，其实就是一个小idea而已，如果你感兴趣，欢迎 @sudo 跟我一起脑洞`
    }
  }
  for (let command in menu) {
    if (menu.hasOwnProperty(command)) {
      window[command] = menu[command]();
    }
  }
  var names = {
    'dafa': '大发是谁？一个集美貌和才华于一身的女子，你试试在评论中 @大发',
    'sudo': '英文名叫 sudo，一个集帅气和才华都没有的男子，根本不像写代码的，是写bug的',
    'yorkie': 'yorkie === niubility，不会读这个单词？跟我念：牛逼力踢！',
    'misa': '一言不合随手就写个OS。misa口头禅：你们这帮土人。 tip: 输入 misa() 会有惊喜哦！'
  };
  window['dafa'] = names.dafa;
  window['sudo'] = names.sudo;
  window['yorkie'] = names.yorkie;
  window['ceo'] = names.misa;
  window['大发'] = names.dafa;
  window['晓飞'] = names.sudo;
  window['亚中'] = names.yorkie;
  window.who = {}
  who.is = {
    '大发': names.dafa,
    '晓飞': names.sudo,
    '亚中': names.yorkie,
    'dafa': names.dafa,
    'sudo': names.sudo,
    'yorkie': names.yorkie,
    'misa': names.misa,
    'ceo': names.misa
  }

  window.rokid = function(){
    console.log("%cRokid"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:100px");
    console.log('Rokid官网：https://www.rokid.com');
  }
  window.misa = function(){
    console.log('%c', "line-height:200px;padding:100px;background:url(https://rokidweb.oss-cn-hangzhou.aliyuncs.com/skills/%E6%B0%91%E8%B0%A3%E6%AD%8C%E6%9B%B2/misa.png);background-size: 202px;");
  }
}
