<template>
  <section class="categories-container">
    <div>
      <h2>Browse all</h2>
      <CategoryList :categories="categories" />
    </div>
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
  