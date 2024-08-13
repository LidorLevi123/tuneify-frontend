<template>
    <section class="search-history-container">
        <div class="search-history-page">
            <header>
                <h1 style="color: white">Recent searches</h1>
                <button @click="clearRecentSearches">Clear recent searches</button>
            </header>
            <StationList :stations="searchHistory" :isSearchHistory="true" />
        </div>
    </section>
</template>

<script>
import StationList from '../cmps/StationList.vue'
import { eventBus } from '../services/event-bus.service'
import historyTracker from '../services/history.service'

export default {
    name: 'SearchHistory',

    data() {
        return {
            searchHistory: JSON.parse(localStorage.getItem('searchHistory')) || [],
        }
    },
    mounted() {
        historyTracker.push(this.$route.fullPath)
        eventBus.on('removeFromSearchHistory', this.removeFromSearchHistory)
    },
    methods: {
        clearRecentSearches() {
            localStorage.setItem('searchHistory', JSON.stringify([]))
            this.searchHistory = []
            this.$router.push('/search')
        },

        removeFromSearchHistory(spotifyId) {
            const idx = this.searchHistory.findIndex(s => s.spotifyId === spotifyId)
            this.searchHistory.splice(idx, 1)
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory))
            if (!this.searchHistory.length) this.$router.push('/search')
        }
    },

    components: {
        StationList
    }
}
</script>