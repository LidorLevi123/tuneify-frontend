<template>
    <section class="img">

        <img v-if="!this.station.owner._id" crossorigin="anonymous" class="station-img" :src="station.imgUrl" alt=""
            @load="setBackgroundClr" ref="stationImg" :style="{ borderRadius: station.isArtist ? '50%' : 'unset' }" />

        <img v-else-if="this.station.owner._id && this.station.imgUrl" crossorigin="anonymous" class="station-img"
            :src="station.imgUrl" alt="" @load="setBackgroundClr" ref="stationImg" />

        <img v-else-if="this.station.owner._id && this.station.tracks.length && this.station.tracks.length < 4"
            crossorigin="anonymous" class="station-img" :src="station.tracks[0]?.imgUrl[0].url" alt=""
            @load="setBackgroundClr" ref="stationImg" />

        <div v-else-if="this.station.owner._id && this.station.tracks.length >= 4" class="collage-container">
            <img class="s-img" :src="this.station.tracks[0]?.imgUrl[1].url" alt="" crossorigin="anonymous"
                @load="setBackgroundClr" ref="stationImg">
            <img class="s-img" :src="this.station.tracks[1]?.imgUrl[1].url" alt="">
            <img class="s-img" :src="this.station.tracks[2]?.imgUrl[1].url" alt="">
            <img class="s-img" :src="this.station.tracks[3]?.imgUrl[1].url" alt="">
        </div>

        <div v-else class="img-placeholder">
            <span class="note-svg" v-icon="`note2`"></span>
        </div>

    </section>
</template>

<script>
import { utilService } from '../services/util.service.js'
import { eventBus } from '../services/event-bus.service.js'
export default {
    name: 'StationImg',
    props: {
        station: {
            type: Object,
            required: true
        }
    },
    methods: {
        async setBackgroundClr() {
            const elImg = this.$refs.stationImg
            try {
                const avgColor = await utilService.getAvgImgClr(elImg)
                const [darkerColor, darkerDarkerColor] = utilService.generateColors(avgColor)

                this.$emit('backgroundColor', { avgColor, darkerColor, darkerDarkerColor })
                eventBus.emit('backgroundColor', darkerDarkerColor)
            }
            catch (err) {
                console.log(err.message)
            }
        },
    }

}
</script>