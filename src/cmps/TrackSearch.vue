<template>
    <section class="track-search-container">
        <section class="track-search" v-if="modalOpen">
            <div>
                <h1>Let's find something for your playlist</h1>
                <div class="track-search-input">
                    <span class="df ai" v-icon="`sSearch`"></span>
                    <input type="text" v-model="filterBy.txt" @input="onSetFilterBy"
                        placeholder="Search for songs or episodes">
                    <div v-if="filterBy.txt">
                        <span class="df ai" v-icon="'close'" @click="onClearFilter"></span>
                    </div>
                </div>
            </div>
            <button @click="toggleModal" class="close-btn" v-icon="`bClose`"></button>
        </section>
        <button v-if="!modalOpen" @click="toggleModal" class="find-btn">Find more</button>
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
            modalOpen: true
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
        toggleModal() {
            this.modalOpen = !this.modalOpen
        }
    }
}
</script>