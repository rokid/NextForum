<template>
  <div class="container">
    <ul>
      <li class="tag-box" v-for="item in allTags">
        <router-link :to="`/category/tag?id=${item.id}`" :style="`border-color:${randomColor()}`">
          <span>{{item.text}}({{item.count}})</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TagList',
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(
      ['allTags']
    ),
  },
  methods: {
    ...mapActions(['getTags']),
    randomColor() {
      const letters = '4789ABCDE'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)]
      }
      return color
    },
  },
  async mounted() {
    const tags = await this.getTags()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 22px;
}
.tag-box {
  display: inline-block;
  width: 23%;
  margin: 7px 1%;
}
.tag-box a {
  display: block;
  background: #fcfcfc;
  box-sizing: border-box;
  border-width: 2px;
  border-style: solid;
  border-radius: 4px;
  font-weight: bold;
  width: 100%;
  color: #454545;
  text-align: center;
  padding: 15px 0;
  opacity: 0.5;
  transition: all .3s;
}
.tag-box a:hover {
  opacity: 1;
}
</style>
