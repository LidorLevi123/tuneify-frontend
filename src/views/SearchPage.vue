<template>
  <section class="categories-container">
    <div>
      <h2>Browse all</h2>
      <CategoryList :categories="categories" />
    </div>
  </section>
</template>

<script>
import CategoryList from '../cmps/CategoryList.vue'
import { utilService } from '../services/util.service.js'
import historyTracker from '../services/history.service'

// get categories to here please

export default {
  name: 'SearchPage',
  data() {
    return {
      categories: utilService.getCategoriesJson(),
      filterBy: {
        txt: '',
      }
    };
  },
  created() {
    historyTracker.push(this.$route.fullPath)
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
