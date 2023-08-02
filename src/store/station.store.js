import { userService } from '../services/user.service.local'
import { stationService } from '../services/station.service.local'

export const stationStore = {
    state: {
        stations: [], // For now we hold all stations here until wo move to backend
        stationsForHome: [],
        currStation: null,
        currTrackIdx: -1,
        isCurrTrackPlaying: null,
    },
    getters: {
        libraryStations({ stations }) { 
            const user = userService.getLoggedinUser()
            
            return stations.filter(station => 
                station.owner._id === user?._id
            ) 
        },
        stationsForHome({ stationsForHome }) { return stationsForHome },
        currStation({ currStation }) { return currStation },
        currTrackIdx({ currTrackIdx }) { return currTrackIdx },
        isCurrTrackPlaying({ isCurrTrackPlaying }) { return isCurrTrackPlaying },
        likedTracks({ stations }) {
            const likedSongsStation = stations?.find(station => station._id === userService.getLoggedinUser()?.likedId)
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

            // if (stations[idx]._id === 'liked101' && currStation._id === 'liked101') {
            //     this.commit({ type: 'setCurrStation', station: stations[idx] })
            // }
        }
    },
    actions: {
        async getStationsForHome({ commit }) {
            try {
                const stations = await stationService.getStationsForHome()
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
                commit({ type: 'setCurrTrackIdx', trackIdx: 0 })
                if (!station.owner) commit({ type: 'addStation', stationToSave: station })
            } catch (err) {
                console.log('Could not set current station', err)
                throw new Error('Could not set current station')
            }
        },
        async saveStation({ commit }, { stationToSave }) {
            let type = stationToSave._id ? 'updateStation' : 'addStation'
            // if(stationToSave.owner === 'Tuneify') type = 'addStation'

            if(stationToSave.isEmpty) type = 'addStation'

            try {
                const station = await stationService.save(stationToSave)
                commit({ type, stationToSave: station })
                // commit({ type: 'setCurrStation', station: { ...station } })
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
                await stationService.saveTrack(trackToSave, stationId)
                commit({ type: 'addTrack', trackToSave, stationId })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not add track')
            }
        },
        async removeTrack({ commit, state }, { trackId, stationId }) {
            const station = state.stations.find(station => station._id === stationId)
            const isTrackExist = station.tracks.some(currTrack => currTrack.id === trackId)
            if (!isTrackExist) return

            try {
                await stationService.removeTrack(trackId, stationId)
                commit({ type: 'removeTrack', trackId, stationId })
                commit({ type: 'setCurrStation', station })
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