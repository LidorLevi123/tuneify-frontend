import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { spotifyService } from './spotify.service.js'
import { userService } from './user.service.local.js'
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
    getStationsForHome,
    saveTrack,
    removeTrack
}

async function query(filterBy = { name: '' }) {
    const stations = await storageService.query(STORAGE_KEY)
    return stations
}

async function getById(stationId) {

    let station

    try {
        station = await storageService.get(STORAGE_KEY, stationId)
    } catch (error) {
        station = await spotifyService.getSpotifyItems('station', stationId)
        await storageService.post(STORAGE_KEY, station)
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
        console.log(station._id)
        savedStation = await storageService.post(STORAGE_KEY, station)
    }
    return savedStation
}

async function saveTrack(track, stationId) {
    const station = await storageService.get(STORAGE_KEY, stationId)
    station.tracks.push(track)
    await save(station)
}

async function removeTrack(trackId, stationId) {
    const station = await storageService.get(STORAGE_KEY, stationId)
    const idx = station.tracks.findIndex(currTrack => currTrack.id === trackId)
    station.tracks.splice(idx, 1)
    await save(station)
}

async function getCategoryStations(categoryId) {
    const stations = await spotifyService.getSpotifyItems('categoryStations', categoryId)
    return stations
}

async function getStationsForHome() {
    const categories = [
        { id: '0JQ5DAqbMKFEC4WFtoNRpw', name: 'Pop' },
        { id: '0JQ5DAqbMKFAXlCG6QvYQ4', name: 'Workout' },
        { id: '0JQ5DAqbMKFIVNxQgRNSg0', name: 'Decades' },
        { id: '0JQ5DAqbMKFPrEiAOxgac3', name: 'Classical' },
        { id: '0JQ5DAqbMKFRKBHIxJ5hMm', name: 'Tastemakers' },
        { id: '0JQ5DAqbMKFLVaM30PMBm4', name: 'Summer' },
        { id: '0JQ5DAqbMKFCfObibaOZbv', name: 'Gaming' },
        { id: '0JQ5DAqbMKFAQy4HL4XU2D', name: 'Travel' },
    ]

    const res = []

    for (let i = 0; i < categories.length; i++) {
        let stations = await spotifyService.getSpotifyItems('categoryStations', categories[i].id)
        stations = stations.map(station => ({ ...station, category: categories[i].name }))
        res.push(...stations)
    }
    return res
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
    let stations = utilService.loadFromStorage(STORAGE_KEY)
    if (stations) return

    stations = []
    utilService.saveToStorage(STORAGE_KEY, stations)
}

// Initial data
// ;(async ()=>{
//     const station = _getDemoStation()
//     await storageService.post(STORAGE_KEY, station)
// })()