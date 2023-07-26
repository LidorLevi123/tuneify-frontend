<template>
    <section class="station-details" v-if="station">
        <pre>{{ station }}</pre>
    </section>
</template>

<script>
import { stationService } from '../services/station.service.local'

export default {
    data() {
        return {
            station: null
        }
    },

    computed: {
        stationId() {
            return this.$route.params
        }
    },

    created() {
        this.loadStation()
    },

    methods: {
        async loadStation() {
            const { stationId } = this.$route.params
            if (!stationId) return

            try {
                this.station = await stationService.getById(stationId)
            } catch {
                console.log('Cannot load station')
                this.$router.push('/')
            }
        },
    },
    watch: {
        stationId() {
            this.loadStation()
        }
    },
}
</script>
