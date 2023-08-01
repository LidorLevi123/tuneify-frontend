<template>
    <section class="category-page">
        <header>
            <h1>{{ categoryName }}</h1>
        </header>
        <StationList v-if="categoryStations" :stations="categoryStations" />
    </section>
</template>

<script>
// import { stationService } from '../services/station.service.local';
import { stationService } from '../services/station.service';
import StationList from '../cmps/StationList.vue'
import historyTracker from '../services/history.service';

export default {

    data() {
        return {
            categoryStations: null
        }
    },

    computed: {
        categoryId() {
            return this.$route.params.categoryId
        },
        categoryName() {
            return this.$route.params.categoryName
        }
    },

    created() {
        this.loadCategoryStations()
        historyTracker.push(this.$route.fullPath)
    },

    methods: {
        async loadCategoryStations() {
            try {
                const stations = await stationService.getCategoryStations(this.categoryId)
                this.categoryStations = stations
            } catch (err) {
                console.log('Could not load category stations')
            }
        }
    },

    components: {
        StationList
    },

    name: 'CategoryPage',
}
</script>
