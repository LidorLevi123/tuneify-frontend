<template>
    <section class="category-page">
        <div class="new-layout">
            <header>
                <h1>{{ categoryName }}</h1>
            </header>
            <StationList v-if="categoryStations" :stations="categoryStations" />
        </div>
    </section>
</template>

<script>
import { stationService } from '../services/station.service';
import StationList from '../cmps/StationList.vue'
import historyTracker from '../services/history.service';

export default {
    name: 'CategoryPage',
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
        },
        stationsForHome() {
            return this.$store.getters.stationsForHome
        },
        currMarket() {
            return this.$store.getters.currMarket
        }
    },

    created() {
        this.loadCategoryStations()
        historyTracker.push(this.$route.fullPath)
    },

    methods: {
        async loadCategoryStations() {
            if (this.categoryId === 'featured') {
                this.categoryStations = this.stationsForHome[1]
            } else {
                try {
                    const stations = await stationService.getCategoryStations(this.categoryId, this.currMarket)
                    this.categoryStations = stations
                } catch (err) {
                    console.log('Could not load category stations')
                }
            }
        }
    },

    components: {
        StationList
    },

}
</script>
