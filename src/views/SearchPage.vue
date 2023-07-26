<template>
  <section class="search-page">
    <label for="search">
      <span class="material-symbols-outlined">search</span>
      <input id="search" v-model="filterBy.txt" @input="onSetFilterBy" type="text"
        placeholder="What do you want to listen to?">
      <span class="material-symbols-outlined search-clear" @click="onClearFilter"> close </span>
    </label>
  </section>
</template>
  
<script>

export default {

  name: 'SearchPage',
  data() {
    return {
      filterBy: {
        txt: '',
      }
    }
  },
  methods: {
    onSetFilterBy() {
      this.$emit('filter', this.filterBy)
    },
    onClearFilter() {
      this.filterBy.txt = ''
    }
  }

}
</script>
  