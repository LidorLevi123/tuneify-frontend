<template>
    <section class="track-search-container">
        <div>
            <h1>Let's find something for your playlist</h1>
            <div class="track-search-input">
                <span class="df ai" v-icon="`sSearch`"></span>
                <input type="text" v-model="filterBy.txt" @input="onSetFilterBy" placeholder="Search for songs or episodes">
                <div v-if="filterBy.txt">
                    <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
                </div>
            </div>
        </div>
        <button v-icon="`bClose`">Close</button>
    </section>
</template>

<script>
export default {
    name: 'TrackSearch',

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
    }
}
</script>