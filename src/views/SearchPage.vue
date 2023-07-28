<template>
  <section class="search-page">
    <section class="search-header">
      <button class="nav-btn" title="Go back"><span class="material-symbols-outlined">chevron_left</span></button>
      <button class="nav-btn" title="Go forward"><span class="material-symbols-outlined">chevron_right</span></button>
      <div class="search-input-container">
        <span class="material-symbols-outlined">search</span>
        <input type="text" v-model="filterBy.txt" @input="onSetFilterBy" placeholder="What do you want to listen to?">
        <div v-if="filterBy.txt">
          <span class="material-symbols-outlined search-clear" @click="onClearFilter"> close </span>
        </div>
      </div>
    </section>
    <h2>Browse all</h2>
    <CategoryList :categories="categories" />
  </section>
</template>
  
<script>
import CategoryList from '../cmps/CategoryList.vue';
import categoriesJson from '../data/categories.json' assert {type: 'json'};

export default {
  name: 'SearchPage',
  data() {
    return {
      categories: categoriesJson,
      filterBy: {
        txt: '',
      }
    };
  },
  methods: {
    onSetFilterBy() {
      console.log(this.filterBy);
      this.$emit('filter', this.filterBy);
    },
    onClearFilter() {
      this.filterBy.txt = '';
    }
  },
  components: { CategoryList }
}
</script>
  