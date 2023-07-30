import { stationService } from '../services/station.service.local'
// import { stationService } from '../services/station.service'

export const stationStore = {
    state: {
        stations: [], // For now we hold all stations here until wo move to backend
        stationsForHome: [],
        currStation: null,
        currTrackIdx: -1
    },
    getters: {
        libraryStations({ stations }) { return stations.filter(station => station.owner) },
        stationsForHome({ stationsForHome }) { return stationsForHome },
        currStation({ currStation }) { return currStation },
        currTrackIdx({ currTrackIdx }) { return currTrackIdx }
    },
    mutations: {
        loadStations(state, { stations }) {
            state.stations = stations
            console.log(state.stations);
        },
        setStationsForHome(state, { stations }) {
            state.stationsForHome = stations
        },
        setCurrStation(state, { station }) {
            state.currStation = station
        },
        setCurrTrackIdx(state, { trackIdx }) {
            state.currTrackIdx = trackIdx
        },
        addStation({ stations }, { stationToSave }) {
            stations.unshift(stationToSave)
        },
        updateStation({ stations }, { stationToSave }) {
            const idx = stations.findIndex(station => station._id === stationToSave._id)
            stations.splice(idx, 1, stationToSave)
        },
        updateTrack({ currStation, currTrackIdx }, { youtubeId }) {
            currStation.tracks[currTrackIdx].youtubeId = youtubeId
        },
        removeStation({ stations }, { stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            stations.splice(idx, 1)
        },
    },
    actions: {
        async getStationsForHome({ commit }) {
            try {
                // For now we display only workout stations at homepage
                const stations = await stationService.getCategoryStations('0JQ5DAqbMKFAXlCG6QvYQ4')
                commit({ type: 'setStationsForHome', stations })
            } catch (err) {
                console.log('stationStore: Error in getStationsForHome', err)
                throw new Error('Could not load stations for home page')
            }
        },
        async loadStations( { commit }) {
            try {
                const stations = await stationService.query()
                commit({ type: 'loadStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadStations', err)
                throw new Error('Could not load stations')
            }
        },
        async setCurrStation({ commit }, { stationId }) {
            try {
                const station = await stationService.getById(stationId)
                commit({ type: 'setCurrStation', station })
            } catch (err) {
                console.log('Could not set current station', err)
                throw new Error('Could not set current station')
            }
        },
        async saveStation({ commit }, { stationToSave }) {
            const type = stationToSave._id ? 'updateStation' : 'addStation'
            try {
                const station = await stationService.save(stationToSave)
                commit({ type, stationToSave: station })
                if(station.name === 'Liked Songs') return station
                commit({ type: 'setCurrStation', station: { ...station } })
                return station
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not save station')
            }
        },
        async removeStation({ commit }, payload) {
            try {
                await stationService.remove(payload.stationId)
                commit(payload)
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not remove station')
            }
        },
        async updateTrack({ commit, state }, { youtubeId }) {
            try {
                commit({ type: 'updateTrack', youtubeId })
                await stationService.save(state.currStation)
                console.log(state.currStation)
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not save station')
            }
        }
    }
}

// In TrackPreview => computed of currTrackIdx
// track-playing: currTrackIdx === this.track