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
        library: []
    },
    getters: {
        stations({ stations }) { return stations },
        library({ library }) { return library }
    },
    mutations: {
        setStations(state, { stations }) {
            state.stations = stations
        },
        addStation(state, { station }) {
            state.library.unshift(station)
            console.log(state.library);
        },
        updateStation(state, { station }) {
            const idx = state.stations.findIndex(c => c._id === station._id)
            state.stations.splice(idx, 1, station)
        },
        removeStation(state, { stationId }) {
            state.stations = state.stations.filter(station => station._id !== stationId)
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
        async addStation({ commit }, { stationId }) {

            if(!stationId) {
                const station = stationService.getEmptyStation()
                commit({ type: 'addStation', station })
                return
            }
            try {
                const station = await stationService.get(stationId)
                commit({ type: 'addStation', station })
            } catch (err) {
                console.log('stationStore: Error in addStation', err)
                throw new Error('Could not add station')
            }
        },
    }
}