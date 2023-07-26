import { stationService } from '../services/station.service.local'
// import { stationService } from '../services/station.service'

// export function getActionRemoveStation(stationId) {
//     return {
//         type: 'removeStation',
//         stationId
//     }
// }
// export function getActionAddStation(station) {
//     return {
//         type: 'addStation',
//         station
//     }
// }
// export function getActionUpdateStation(station) {
//     return {
//         type: 'updateStation',
//         station
//     }
// }
// export function getActionAddStationMsg(stationId) {
//     return {
//         type: 'addStationMsg',
//         stationId,
//         txt: 'Stam txt'
//     }
// }

export const stationStore = {
    state: {
        stations: [],
    },
    getters: {
        stations({ stations }) { return stations.filter(station => !station.owner) },
        library({ stations }) { return stations.filter(station => station.owner) }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        addStation({ stations }, { stationToSave }) {
            stations.unshift(stationToSave)
        },
        updateStation({ stations }, { station }) {
            const idx = stations.findIndex(s => s._id === station._id)
            stations.splice(idx, 1, station)
        },
        removeStation({ stations }, { stationId }) {
            const idx = stations.findIndex(station => station._id === stationId)
            stations.splice(idx, 1)
        },
        addStationMsg(state, { stationId , msg}) {
            const station = state.stations.find(station => station._id === stationId)
            if (!station.msgs) station.msgs = []
            station.msgs.push(msg)
        },
    },
    actions: {
        async loadStations( { commit }) {
            try {
                const stations = await stationService.query()
                commit({ type: 'setStations', stations })
            } catch (err) {
                console.log('stationStore: Error in loadStations', err)
                throw new Error('Could not load stations')
            }
        },
        async saveStation({ commit }, { stationToSave }) {
            const type = stationToSave._id ? 'updateStation' : 'addStation'
            try {
                const station = await stationService.save(stationToSave)
                commit({ type, stationToSave: station })
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