import { stationService } from '../services/station.service'

export const stationStore = {
    state: {
        isLoading: false,
        sidebarCollapsed: false,
        stations: [], // For now we hold all stations here until we move to backend
        stationsForHome: [],
        currStation: null,
        currTrackIdx: -1,
        isCurrTrackPlaying: false,
        searchRes: [],
    },
    getters: {
        sidebarCollapsed({ sidebarCollapsed }) { return sidebarCollapsed },
        isLoading({ isLoading }) { return isLoading },
        libraryStations({ stations }) { return stations },
        stationsForHome({ stationsForHome }) { return stationsForHome },
        currStation({ currStation }) { return currStation },
        currTrackIdx({ currTrackIdx }) { return currTrackIdx },
        currTrack({ currStation, currTrackIdx }) { return currStation?.tracks[currTrackIdx] },
        isCurrTrackPlaying({ isCurrTrackPlaying }) { return isCurrTrackPlaying },
        searchRes({ searchRes }) { return searchRes },
    },
    mutations: {
        setSidebarCollapsed(state) {
            state.sidebarCollapsed = !state.sidebarCollapsed
        },
        setLoading(state, value) {
            state.isLoading = value
        },
        loadStations(state, { stations }) {
            state.stations = stations
        },
        setSearchRes(state, { res }) {
            state.searchRes = res
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
            const station = stations.find(currStation => currStation._id === stationToSave._id)
            if (station) return
            stations.push(stationToSave)
        },
        updateStation({ stations }, { stationToSave }) {
            const idx = stations.findIndex(station => station._id === stationToSave._id)
            if (idx === -1) return
            stations.splice(idx, 1, stationToSave)
        },
        removeStation({ stations }, { stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            if (idx === -1) return
            stations.splice(idx, 1)
        },
        updateTrack({ currStation, currTrackIdx }, { youtubeId, lyrics }) {
            if (youtubeId) currStation.tracks[currTrackIdx].youtubeId = youtubeId
            if (lyrics) currStation.tracks[currTrackIdx].lyrics = lyrics
        },
        addTrack({ stations }, { trackToSave, stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            if (idx === -1) return
            stations[idx].tracks.push(trackToSave)
        },
        removeTrack({ stations }, { trackId, stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            if (idx === -1) return
            const trackIdx = stations[idx].tracks.findIndex(track => track.id === trackId)
            if (trackIdx === -1) return
            stations[idx].tracks.splice(trackIdx, 1)
        }
    },
    actions: {
        async getStationsForHome({ commit }) {
            commit('setLoading', true)
            try {
                const stations = await stationService.getStationsForHome()
                commit({ type: 'setStationsForHome', stations })
            } catch (err) {
                console.log('stationStore: Error in getStationsForHome', err)
                throw new Error('Could not load stations for home page')
            }
            finally {
                commit('setLoading', false)
            }
        },
        async getAccessToken() {
            try {
                await stationService.getAccessToken()
            } catch (err) {
                console.log('Could not get access token', err)
                throw new Error('Could not get access token')
            }
        },
        async loadStations({ commit }, { userId }) {
            try {
                const stations = await stationService.query(userId)
                commit({ type: 'loadStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadStations', err.message)
                throw new Error('Could not load stations')
            }
        },
        async saveStation({ commit }, { stationToSave }) {
            let type = stationToSave._id ? 'updateStation' : 'addStation'
            if (stationToSave.isEmpty) type = 'addStation'

            try {
                const station = await stationService.save(stationToSave)
                commit({ type, stationToSave: station })
                return station
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not save station')
            }
        },
        async getStation({ }, { stationId }) {
            try {
                const station = await stationService.getById(stationId)
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
        async getTracks({ commit }, { query }) {
            if (!query) {
                commit({ type: 'setSearchRes', res: [] })
                return
            }
            try {
                const res = await stationService.getSearchRes(query)
                commit({ type: 'setSearchRes', res: res })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not get tracks')
            }
        },
        async getStations({ commit }, { query }) {
            if (!query) {
                commit({ type: 'setSearchRes', res: [] })
                return
            }
            try {
                const res = await stationService.getSearchRes(query)
                commit({ type: 'setSearchRes', res: res.stations })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not get stations')
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
        async removeTrack({ commit, state }, { trackId, stationId }) {
            const station = state.stations.find(station => station._id === stationId)
            const isTrackExist = station.tracks.some(track => track.id === trackId)
            if (!isTrackExist) return

            try {
                await stationService.removeTrack(trackId, stationId)
                commit({ type: 'removeTrack', trackId, stationId })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not remove track')
            }
        },
        async updateTrack({ commit, state }, { youtubeId, lyrics }) {
            try {
                commit({ type: 'updateTrack', youtubeId, lyrics })
                await stationService.save(state.currStation)
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not update track')
            }
        }
    }
}