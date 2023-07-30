<template>
    <section class="main-header">
        <button class="nav-btn" title="Go back"><span v-icon="`navBack`"></span></button>
        <button class="nav-btn" title="Go forward"><span v-icon="`navNext`"></span></button>
        <button v-if="$route.path.startsWith('/station/')" class="play-btn-header">
            <span v-icon="'play'"></span>
        </button>
        <span v-if="$route.path.startsWith('/station/')" class="station-header">{{ currStation?.name }}</span>
        <div v-if="$route.path === '/search'" class="search-input-container">
            <span class="material-symbols-outlined">search</span>
            <input type="text" v-model="filterBy.txt" @input="onSetFilterBy" placeholder="What do you want to listen to?">
            <div v-if="filterBy.txt">
                <span class="material-symbols-outlined search-clear" @click="onClearFilter"> close </span>
            </div>
        </div>
        <button class="profile-btn" title="Logout"><span v-icon="`profile`"></span></button>
    </section>
</template>

<script>

export default {
    name: 'SearchPage',

    props: {
        davar: { type: Object }
    },

    data() {
        return {
            filterBy: {
                txt: '',
            },
        }
    },
    methods: {
        onSetFilterBy() {
            console.log(this.filterBy)
            this.$emit('filter', this.filterBy)
        },
        onClearFilter() {
            this.filterBy.txt = ''
        },

    },
    computed: {
        currStation() {
            return this.$store.getters.currStation
        }
    }
}
</script>


