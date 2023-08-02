import { httpService } from './http.service.js'
import { userService } from './user.service.js'
import { spotifyService } from './spotify.service.js'
import { utilService } from './util.service.js'

const BASE_URL = 'station/'

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    saveTrack,
    removeTrack,
    getCategoryStations,
    getStationsForHome,
    // addStationMsg
}

window.cs = stationService // for console usage

async function query(filterBy = {}) {
    const stations = await httpService.get(BASE_URL, filterBy)
    return stations
}

async function getById(stationId) {
    // const station = await httpService.get(BASE_URL + stationId)
    // return station
    let station = await httpService.get(BASE_URL + stationId)

    if (!station) {
        station = await spotifyService.getSpotifyItems('station', stationId)
        station = await httpService.post(BASE_URL, station)
    }

    return station
}

async function remove(stationId) {
    const station = await httpService.delete(BASE_URL + stationId)
    return station
}

async function save(station) {
    if(station.isEmpty) {
        return await httpService.post(BASE_URL, station)
    }

    if (station._id) {
        return await httpService.put(BASE_URL + station._id, station)
    }
    return await httpService.post(BASE_URL, station)
}

async function saveTrack(track, stationId) {
    const station = await httpService.get(BASE_URL + stationId)
    station.tracks.push(track)
    await save(station)
}

async function removeTrack(track, stationId) {
    const station = await httpService.get(BASE_URL + stationId)
    const idx = station.tracks.findIndex(currTrack => currTrack.id === track.id)
    station.tracks.splice(idx, 1)
    await save(station)
}

async function getCategoryStations(categoryId) {
    const stations = await spotifyService.getSpotifyItems('categoryStations', categoryId)
    return stations
    // return httpService.get('spotify', categoryId)
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

// async function addStationMsg(stationId, txt) {
//     const savedMsg = await httpService.post(`station/${stationId}/msg`, {txt})
//     return savedMsg
// }

function getEmptyStation() {
    return {
        _id: utilService.makeId(),
        name: '',
        description: '',
        imgUrl: '',
        owner: userService.getLoggedinUser(),
        tracks: [],
        isEmpty: true
    }
}
