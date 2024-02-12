import { stationService } from '../services/station.service'
import Cookies from 'js-cookie'

export const stationStore = {
    state: {
        isRsbOpen: false,
        isLoading: false,
        sidebarCollapsed: false,
        libraryView: { view: 'list', gridMode: '3' },
        stations: [],
        stationsForHome: [],
        currStation: null,
        currTrackIdx: -1,
        isCurrTrackPlaying: false,
        searchRes: [],
        recommendationsStation: null,
        currMarket: 'IL'
    },
    getters: {
        isRsbOpen({ isRsbOpen }) { return isRsbOpen },
        sidebarCollapsed({ sidebarCollapsed }) { return sidebarCollapsed },
        libraryView({ libraryView }) { return libraryView },
        isLoading({ isLoading }) { return isLoading },
        libraryStations({ stations }) { return stations },
        stationsForHome({ stationsForHome }) { return stationsForHome },
        currStation({ currStation }) { return currStation },
        currTrackIdx({ currTrackIdx }) { return currTrackIdx },
        currMarket({ currMarket }) { return currMarket },
        currTrack({ currStation, currTrackIdx }) { return currStation?.tracks[currTrackIdx] },
        isCurrTrackPlaying({ isCurrTrackPlaying }) { return isCurrTrackPlaying },
        searchRes({ searchRes }) { return searchRes },
        recommendationsStation({ recommendationsStation }) { return recommendationsStation }
    },
    mutations: {
        toggleRsb(state) {
            state.isRsbOpen = !state.isRsbOpen
        },
        setSidebarCollapsed(state) {
            state.sidebarCollapsed = !state.sidebarCollapsed
        },
        setLibraryView(state, { view, gridMode }) {
            state.libraryView = { view, gridMode }
            Cookies.set('libraryView', JSON.stringify({ view, gridMode }))
        },
        getlibraryViewFromCookie(state) {
            const libraryViewCookie = Cookies.get('libraryView')
            if (libraryViewCookie) {
                const { view, gridMode } = JSON.parse(libraryViewCookie)
                state.libraryView = { view, gridMode }
            }
        },
        setLoading(state, value) {
            state.isLoading = value
        },
        loadUserStations(state, { stations }) {
            state.stations = stations
        },
        setSearchRes(state, { res }) {
            state.searchRes = res
        },
        setStationsForHome(state, { stations, market }) {
            Cookies.set('currMarket', market.toString())
            state.stationsForHome = stations
        },
        setCurrMarket(state, { market }) {
            state.currMarket = market
        },
        setCurrStation(state, { station }) {
            state.currStation = station
            if (station._id) Cookies.set('currStation', station._id.toString())
        },
        setCurrTrackIdx(state, { trackIdx }) {
            state.currTrackIdx = trackIdx
            Cookies.set('currTrackIdx', trackIdx.toString())
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
        },
        setUserStations(state, { station, action }) {
            if (action === 'add') {
                state.stations.push(station)
            }
            if (action === 'remove') {
                const idx = state.stations.findIndex(currStation => currStation._id === station._id)
                if (idx === -1) return
                state.stations.splice(idx, 1)
            }
        },
        setRecommendations(state, { recommendationsStation }) {
            state.recommendationsStation = recommendationsStation
        }
    },
    actions: {
        async getStationsForHome({ commit }, { market }) {
            commit('setLoading', true)
            try {
                const stations = await stationService.getStationsForHome(market)
                if (stations.length < 6) throw new Error('Could not load stations from api  - trying from DB')
                commit({ type: 'setStationsForHome', stations, market })
            } catch (err) {
                try {
                    console.log('Error in getStationsForHome', err.message)
                    const stationsFromDb = await stationService.getById('65498ef9ce1a330f64be856e')
                    commit({ type: 'setStationsForHome', stations: stationsFromDb.stations })
                }
                catch (err) {
                    console.log('stationStore: Error in getStationsForHome', err.message)
                    throw new Error('Could not load stations for home page')
                }
            }
            finally {
                commit('setLoading', false)
            }
        },
        async loadUserStations({ commit }, { userId }) {
            try {
                const stations = await stationService.query(userId)
                commit({ type: 'loadUserStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadUserStations', err.message)
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
        async getStation({ }, { stationId, stationType }) {
            try {
                const station = await stationService.getById(stationId, stationType)
                return station
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not save station')
            }
        },
        async setLastTrackFromCookie({ commit, dispatch }) {
            const lastTrackIdx = Cookies.get('currTrackIdx')
            if (lastTrackIdx) commit('setCurrTrackIdx', { trackIdx: parseInt(lastTrackIdx) })
            const lastStationId = Cookies.get('currStation')
            if (lastStationId) {
                try {
                    const lastStation = await dispatch('getStation', { stationId: lastStationId })
                    if (lastStation) commit({ type: 'setCurrStation', station: lastStation })
                } catch (error) {
                    console.error(error)
                    throw new Error('Could not get last track')
                }
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
        async getSearchRes({ commit }, { query }) {
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
        async addTrack({ commit, state }, { trackToSave, stationId }) {
            const station = state.stations.find(station => station._id === stationId)
            const isTrackExist = station.tracks.some(track => track.id === trackToSave.id)
            if (isTrackExist) return

            try {
                trackToSave = JSON.parse(JSON.stringify(trackToSave))
                commit({ type: 'addTrack', trackToSave, stationId })
                await stationService.saveTrack(trackToSave, stationId)
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
                commit({ type: 'removeTrack', trackId, stationId })
                await stationService.removeTrack(trackId, stationId)
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
        },
        async getRecommendations({ commit }, { trackIds }) {
            try {
                const recommendations = await stationService.getRecommendations(trackIds)
                const recommendationsStation = {
                    name: 'Recommendations',
                    tracks: recommendations
                }
                commit({ type: 'setRecommendations', recommendationsStation })
            } catch (err) {
                console.log(err.message)
                throw new Error('Could not get recommendations')
            }

        }
    }
}