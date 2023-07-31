import { stationService } from '../services/station.service.local'
// import { stationService } from '../services/station.service'

export const stationStore = {
    state: {
        stations: [], // For now we hold all stations here until wo move to backend
        stationsForHome: [],
        currStation: null,
        currTrackIdx: -1,
        isCurrTrackPlaying: null,
    },
    getters: {
        libraryStations({ stations }) { return stations.filter(station => station.owner) },
        stationsForHome({ stationsForHome }) { return stationsForHome },
        currStation({ currStation }) { return currStation },
        currTrackIdx({ currTrackIdx }) { return currTrackIdx },
        isCurrTrackPlaying({ isCurrTrackPlaying }) { return isCurrTrackPlaying },
        likedTracks({ stations }) {
            const likedSongsStation = stations?.find(station => station._id === 'liked101')
            return likedSongsStation?.tracks
        }
    },
    mutations: {
        loadStations(state, { stations }) {
            state.stations = stations
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
        setIsPlaying(state, { isPlaying }) {
            state.isCurrTrackPlaying = isPlaying
        },
        addStation({ stations }, { stationToSave }) {
            const station = stations.filter(station => station.owner).find(station => station._id === stationToSave._id)
            if (station) return
            stations.push(stationToSave)
        },
        updateStation({ stations }, { stationToSave }) {
            const idx = stations.findIndex(station => station._id === stationToSave._id)
            stations.splice(idx, 1, stationToSave)
        },
        removeStation({ stations }, { stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            stations.splice(idx, 1)
        },
        updateTrack({ currStation, currTrackIdx }, { youtubeId }) {
            currStation.tracks[currTrackIdx].youtubeId = youtubeId
        },
        addTrack({ stations }, { trackToSave, stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            stations[idx].tracks.push(trackToSave)
        },
        removeTrack({ stations, currStation }, { trackId, stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            const trackIdx = stations[idx].tracks.findIndex(track => track.id === trackId)
            stations[idx].tracks.splice(trackIdx, 1)

            if (stations[idx]._id === 'liked101' && currStation._id === 'liked101') {
                this.commit({ type: 'setCurrStation', station: stations[idx] })
            }
        }
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
        async loadStations({ commit }) {
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
                if (!station.owner) commit({ type: 'addStation', stationToSave: station })
            } catch (err) {
                console.log('Could not set current station', err)
                throw new Error('Could not set current station')
            }
        },
        async saveStation({ commit, state }, { stationToSave }) {
            stationToSave = JSON.parse(JSON.stringify(stationToSave))

            let type = stationToSave._id ? 'updateStation' : 'addStation'
            if(stationToSave._id === state.currStation._id) {
                stationToSave.owner = 'Tunify'
            }

            try {
                const station = await stationService.save(stationToSave)
                commit({ type, stationToSave: station })
                if(station._id !== state.currStation._id) {
                    commit({ type: 'setCurrStation', station: { ...station } })
                }
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
        async addTrack({ commit, state }, { trackToSave, stationId }) {
            const station = state.stations.find(station => station._id === stationId)
            const isTrackExist = station.tracks.some(track => track.id === trackToSave.id)
            if (isTrackExist) return

            try {
                trackToSave = JSON.parse(JSON.stringify(trackToSave))
                await stationService.saveTrack(trackToSave, stationId)
                commit({ type: 'addTrack', trackToSave, stationId })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not add track')
            }
        },
        async removeTrack({ commit, state }, { track, stationId }) {
            const station = state.stations.find(station => station._id === stationId)
            const isTrackExist = station.tracks.some(currTrack => currTrack.id === track.id)
            if (!isTrackExist) return

            try {
                await stationService.removeTrack(track, stationId)
                commit({ type: 'removeTrack', trackId: track.id, stationId })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not remove track')
            }
        },
        async updateTrack({ commit, state }, { youtubeId }) {
            try {
                commit({ type: 'updateTrack', youtubeId })
                await stationService.save(state.currStation)
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not update track')
            }
        }
    }
}