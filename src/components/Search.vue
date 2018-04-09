<template>
  <div>search</div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'Search',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      topics: [],
    }
  },
  components: {
    'fa-icon': FontAwesomeIcon,
  },
  watch: {
    $route(to, from) {
      
    },
  },
  async mounted() {
    const response = await this.$http.get('/search/query?term=' + this.$route.query.q)
    this.topics = response.data.topics
    console.log(response.data)
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
