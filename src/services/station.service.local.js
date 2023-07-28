import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { spotifyService } from './spotify.service.js'
// import { userService } from './user.service.js'

const STORAGE_KEY = 'stationDB'

_createStations()

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    getCategoryStations,
}

async function query(filterBy = { name: '' }) {
    var stations = await storageService.query(STORAGE_KEY)
    return stations
}

async function getById(stationId) {
    let station

    try {
        station = await storageService.get(STORAGE_KEY, stationId)
    } catch (error) {
        station = spotifyService.getSpotifyItems('station', stationId)
        save(station)
    }
    return station
}

async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STORAGE_KEY, station)
    } else {
        // Later, owner is set by the backend
        // station.owner = userService.getLoggedinUser()
        station.owner = 'Guest'
        savedStation = await storageService.post(STORAGE_KEY, station)
    }
    return savedStation
}

async function getCategoryStations(categoryId) {
    const stations = await spotifyService.getSpotifyItems('categoryStations', categoryId)
    return stations
}

function getEmptyStation() {
    return {
        _id: '',
        name: '',
        description: '',
        imgUrl: '',
        owner: '',
        tracks: []
    }
}

function _createStations() {
    let visitedStations = utilService.loadFromStorage(STORAGE_KEY)
    if(visitedStations) return

    visitedStations = []
    utilService.saveToStorage(STORAGE_KEY, visitedStations)
}
// Initial data
// ;(async ()=>{
//     const station = _getDemoStation()
//     await storageService.post(STORAGE_KEY, station)
// })()