<template>
    <section class="station-details" v-if="station">
        <section class="img-photo">
            <section class="img">
                <img :src="station.imgUrl" alt="">
            </section>
            <section class="station-info">
                <span>Playlist</span>
                <h1>{{ station?.name }}</h1>
                <p class="description">{{ station?.description }}</p>
            </section>
        </section>
        <section class="details-player">
            <button class="details-play"><svg role="img" height="28" width="28" aria-hidden="true" viewBox="0 0 24 24"
                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg></button>
            <button class="details-like"><svg role="img" height="32" width="32" aria-hidden="true" viewBox="0 0 24 24"
                    data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq">
                    <path
                        d="M8.667 1.912a6.257 6.257 0 0 0-7.462 7.677c.24.906.683 1.747 1.295 2.457l7.955 9.482a2.015 2.015 0 0 0 3.09 0l7.956-9.482a6.188 6.188 0 0 0 1.382-5.234l-.49.097.49-.099a6.303 6.303 0 0 0-5.162-4.98h-.002a6.24 6.24 0 0 0-5.295 1.65.623.623 0 0 1-.848 0 6.257 6.257 0 0 0-2.91-1.568z"
                        fill="#1ed760">
                    </path>
                </svg></button>
        </section>
        <TrackList :tracks="station.tracks"/>
        <StationEdit />
        </section>
    </template>

<script>
import { stationService } from '../services/station.service.local'

import StationEdit from '../cmps/StationEdit.vue'
import TrackList from '../cmps/TrackList.vue'

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
            if (!stationId)
                return;
            try {
                this.station = await stationService.getById(stationId)
            }
            catch {
                console.log("Cannot load station")
                this.$router.push("/")
            }
        },
    },
    watch: {
        station() {
            this.loadStation()
        }
    },
    components: { 
        StationEdit,
        TrackList
    }
}
</script>
