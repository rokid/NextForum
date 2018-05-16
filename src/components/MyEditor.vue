<template>
  <div>
    <mavon-editor
      ref="editor"
      @change="change"
      :value="initialValue"
      :subfield="false" 
      :toolbars="editorToolbar"
      @imgAdd="addImage" />
    <!-- extend toolbar -->
    <el-popover
      v-if="!isMobile()"
      v-model="emojiVisible"
      placement="right"
      trigger="hover"
      @after-enter="renderEmoji">
      <div>
        <p v-if="rendering">正在加载 Emoji 表情...</p>
        <emoji-picker
          v-if="true"
          @select="pickEmoji"
          :set="emojiConf.set"
          :perLine="13"
          :sheetSize="emojiConf.sheetSize"
          :emojiSize="emojiConf.emojiSize"
          :native="false"
          :showPreview="false"
          :showSearch="false"
          :showSkinTones="false"
          :showCategories="false"
          :i18n="emojiCN" />
      </div>
      <button slot="reference" ref="emoji" type="button" class="op-icon" title="表情">
        <fa-icon icon="smile"></fa-icon>
      </button>
    </el-popover>
    <el-upload v-on:submit.prevent
      class="upload-attach"
      name="filessss"
      :data="uploadPara"
      :show-file-list="false"
      :http-request="handleUploadFile"
      :on-success="onUploadFileSuccess"
      :on-error="onUploadFileError"
      action="/uploads.json">
      <span slot="trigger" style="display: none" ref="upload"></span>
      <button @click="triggerupload" ref="uploadFile" type="button" class="op-icon proxy-upload-trigger" title="添加附件">
        <fa-icon icon="cloud-upload-alt"></fa-icon>
      </button>
    </el-upload>
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import { Picker } from 'emoji-mart-vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'NewDiscussion',
  props: [
    'initialValue'
  ],
  components: {
    'fa-icon': FontAwesomeIcon,
    'emoji-picker': Picker,
  },
  data() {
    return {
      emojiVisible: false,
      rendering: true,
      emojiCN: {
        categories: {
          recent: '最新使用',
          people: '人物',
          nature: '自然',
          foods: '食物',
          activity: '运动',
          places: '景色',
          objects: '物品',
          symbols: '标志',
          flags: '旗帜',
        }
      },
      emojiConf: {
        set: 'apple',
        sheetSize: 32,
        emojiSize: 24
      },
      uploadPara: {
        type: 'composer'
      }
    }
  },
  computed: {
    ...mapGetters([
      'editorToolbar',
    ]),
    value() {
      return this.$refs.editor.d_value || ''
    },
  },
  methods: {
    focus() {
      this.$refs.editor.textAreaFocus()
    },
    pickEmoji(item) {
      // if (typeof this.$props.onPickEmoji === 'function') {
      //   this.$props.onPickEmoji(item)
      // }
      // this.focus()
      let editor = this.$refs.editor;
      editor.insertText(editor.getTextareaDom(), {
        prefix: item.native,
        subfix: '',
        str: ''
      })
      // this.emojiVisible = false
    },
    change(value, render) {
      this.$emit('change', value, render)
    },
    renderEmoji() {
      setTimeout(() => {
        this.rendering = false
      }, 0)
    },
    async addImage(pos, image) {
      var data = new FormData()
      data.append('type', 'composer')
      data.append('file', image)

      var res = await this.$http.request({
        url: '/uploads.json',
        method: 'post',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      this.$refs.editor.$img2Url(pos, 'https://developer-forum.rokid.com' + res.data.url)
    },
    handleUploadFile(context) {
      var data = new FormData()
      data.append('type', 'composer')
      data.append('file', context.file)

      this.$http.request({
        url: '/uploads.json',
        method: 'post',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then((res) => {
        context.onSuccess(res)
      }).catch((error) => {
        context.onError(error)
      })
    },
    onUploadFileSuccess(res, file, fileList) {
      let editor = this.$refs.editor;
      editor.insertText(editor.getTextareaDom(), {
        prefix: '[' + res.data.original_filename + '](https://developer-forum.rokid.com' + res.data.url + ')',
        subfix: '',
        str: ''
      })
    },
    onUploadFileError(error) {
      this.$alert(error.response.data.errors.join(''), '上传错误')
    },
    triggerupload(event){
      this.uploadElem.click()
    },
    isMobile() {

      /**
      *  作者：tony
      *  链接：https://www.zhihu.com/question/21357506/answer/190898690
      *  来源：知乎
      *  著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
      */
      var u = navigator.userAgent
      var ua = {
        trident: u.indexOf('Trident') > -1, //IE内核  
        presto: u.indexOf('Presto') > -1,   //opera内核  
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端  
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端  
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器  
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器  
        iPad: u.indexOf('iPad') > -1, //是否iPad    
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
        qq: u.match(/\sQQ/i) == " qq" //是否QQ  
      }
      if (ua.mobile || ua.ios || ua.android || ua.iPhone || ua.iPad) {
        return true
      }
      return false
    }
  },
  mounted() {
    var editor = this.$refs.editor
    // proxy for trigger uoload action
    var uploadProxy = this.$refs.uploadFile
    // the true upload button
    this.uploadElem = this.$refs.upload
    editor.$refs.toolbar_left.$el.append(uploadProxy)
    var emoji
    if (!this.isMobile()) {
      emoji = this.$refs.emoji
      editor.$refs.toolbar_left.$el.append(emoji)
      // preload emoji.png
      let img = new Image()
      img.onload = () => {
  
      }
      img.src = 'https://unpkg.com/emoji-datasource-' +
        this.emojiConf.set + '@4.0.2/img/apple/sheets/' +
        this.emojiConf.sheetSize + '.png'
    }
  },
}
</script>