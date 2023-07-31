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
    createLikedSongs,
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
        // Later, owner is set by the backend
        // station.owner = userService.getLoggedinUser()
        savedStation = await storageService.post(STORAGE_KEY, station)
    }
    return savedStation
}

async function saveTrack(track, stationId) {
    const station = await storageService.get(STORAGE_KEY, stationId)
    station.tracks.push(track)
    await save(station)
}

async function removeTrack(track, stationId) {
    const station = await storageService.get(STORAGE_KEY, stationId)
    const idx = station.tracks.findIndex(currTrack => currTrack.id === track.id)
    station.tracks.splice(idx, 1)
    await save(station)
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

async function createLikedSongs() {

    let station
    try {
        station = await storageService.get(STORAGE_KEY, 'liked101')
    } catch (error) {
        station = getEmptyStation()

        station._id = 'liked101'
        station.name = 'Liked Songs'
        station.imgUrl = 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'
        station.owner = userService.getLoggedinUser()
        
        await storageService.post(STORAGE_KEY, station)
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