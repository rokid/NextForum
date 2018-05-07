<template>
  <div>
    <mavon-editor
      ref="editor"
      :value="initialValue"
      :subfield="false" 
      :toolbars="editorToolbar"
      @imgAdd="addImage" />
    <!-- extend toolbar -->
    <el-popover
      v-model="emojiVisible"
      placement="right"
      trigger="hover"
      @after-enter="renderEmoji">
      <div>
        <p v-if="rendering">正在加载 Emoji 表情...</p>
        <emoji-picker
          v-if="!rendering"
          @select="pickEmoji"
          set="apple"
          :perLine="13"
          :sheetSize="16"
          :native="true"
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
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import { Picker } from 'emoji-mart-vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
  name: 'NewDiscussion',
  props: [
    'initialValue',
    'onPickEmoji',
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
      if (typeof this.$props.onPickEmoji === 'function') {
        this.$props.onPickEmoji(item)
      }
      this.focus()
      this.emojiVisible = false
    },
    renderEmoji() {
      setTimeout(() => {
        this.rendering = false
      }, 1000)
    },
    addImage(filename, image) {
      var data = new FormData()
      data.append('type', 'composer')
      data.append('files', image)

      // const res = await this.$http.request({
      //   url: '/uploads.json',
      //   method: 'post',
      //   data,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      this.$refs.editor.$img2Url(filename, image.name)
    },
  },
  mounted() {
    const editor = this.$refs.editor
    const emoji = this.$refs.emoji
    editor.$refs.toolbar_left.$el.append(emoji)
  },
}
</script>