<template>
  <div>notification</div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
export default {
  name: 'Notification',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      categories: [],
    }
  },
  components: {
    'fa-icon': FontAwesomeIcon,
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
