import { stationService } from '../services/station.service.local'
// import { stationService } from '../services/station.service'

export const stationStore = {
    state: {
        stations: [], // For now we hold all stations here until wo move to backend
        currStation: null,
    },
    getters: {
        stations({ stations }) { return stations.filter(station => !station.owner) },
        library({ stations }) { return stations.filter(station => station.owner) },
        currStation({ currStation }) { return currStation }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        setCurrStation(state, { station }) {
            state.currStation = station
        },
        addStation({ stations }, { stationToSave }) {
            stations.unshift(stationToSave)
        },
        updateStation({ stations }, { stationToSave }) {
            const idx = stations.findIndex(s => s._id === stationToSave._id)
            stations.splice(idx, 1, stationToSave)
        },
        removeStation({ stations }, { stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            stations.splice(idx, 1)
        },
    },
    actions: {
        async setStations( { commit }) {
            try {
                const stations = await stationService.getStations()
                commit({ type: 'setStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadStations', err)
                throw new Error('Could not load stations')
            }
        },
        async loadStations( { commit }) {
            try {
                const stations = await stationService.query()
                commit({ type: 'setStations', stations })
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
    }
}