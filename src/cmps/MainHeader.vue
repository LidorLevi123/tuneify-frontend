<template>
    <section class="main-header">
        <button class="nav-btn" title="Go back"><span class="material-symbols-outlined">chevron_left</span></button>
        <button class="nav-btn" title="Go forward"><span class="material-symbols-outlined">chevron_right</span></button>
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
    data() {
        return {
            filterBy: {
                txt: '',
            },
            topOfPage: true
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
}
</script>


