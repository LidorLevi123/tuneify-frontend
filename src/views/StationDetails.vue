<template>
    <section class="station-details" v-if="station">
        <section class="img-photo">
            <section class="img">
                <img class="elImg" src="https://i.scdn.co/image/ab67706f00000003d6233b53b06497fd1d13449e" alt="">
            </section>
            <section class="station-info">
                <span>Playlist</span>
                <h1>{{ station?.name }}</h1>
                <p class="description">{{ station?.description }}</p>
            </section>
        </section>
        <section class="details-player">
            <button class="details-play"><span class="details-play" v-icon="'detailsPlay'"></span></button>
            <button class="details-like"><span v-icon="'like'"></span></button>
        </section>
        <SongList :songs="station.songs" />
        <StationEdit />
    </section>
</template>

<script>
import { utilService } from '../services/util.service'
import { FastAverageColor } from 'fast-average-color'
const fac = new FastAverageColor()
import { stationService } from '../services/station.service.local'

import StationEdit from '../cmps/StationEdit.vue'
import SongList from '../cmps/SongList.vue'

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
    // created() {
    //     this.loadStation()
    //     this.getAverageImageColor();
    // },
    async mounted() {
        await this.loadStation()
        const clr = utilService.getRandomColor()
        document.querySelector('.station-details').style.backgroundImage = `linear-gradient(to bottom, ${clr} 0%, #121212 50%, #121212 100%)`;
        // this.getAverageImageColor()
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
        async getAverageImageColor() {
            const elImg = document.querySelector('.elImg')
            if (!elImg) {
                console.error("Image element not found.")
                return
            }
            // Check if the image has loaded before calling .getColorAsync()
            if (elImg.complete) {
                try {
                    const color = await fac.getColorAsync(elImg)
                    console.log(color.rgb)
                } catch (error) {
                    console.error("Error calculating average image color:", err)
                }
            } else {
                elImg.addEventListener('load', async () => {
                    try {
                        const color = await fac.getColorAsync(elImg)
                        console.log(color.rgb)
                    } catch (err) {
                        console.error("Error calculating average image color:", err)
                    }
                })
            }
        }

    },
    watch: {
        station() {
            this.loadStation()
        }
    },
    components: {
        StationEdit
    }
}
</script>
