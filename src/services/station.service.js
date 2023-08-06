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
    getSearchRes,
    saveTrack,
    removeTrack,
    getCategoryStations,
    getStationsForHome,
}

window.cs = stationService // for console usage

async function query(userId) {
    const filterBy = { userId }
    const stations = await httpService.get(BASE_URL, filterBy)
    return stations
}

async function getById(stationId) {
    let station = await httpService.get(BASE_URL + stationId)
    
    if (!station) {
        station = await spotifyService.getSpotifyItems({ type: 'station', id: stationId })
        station = await httpService.post(BASE_URL, station)
    }
    return station
}

async function remove(stationId) {
    const station = await httpService.delete(BASE_URL + stationId)
    return station
}

async function save(station) {
    if (station._id) {
        return await httpService.put(BASE_URL + station._id, station)
    }
    return await httpService.post(BASE_URL, station)
}

async function getSearchRes(query) {
    const res = await spotifyService.getSpotifyItems({ type: 'search', query })
    return res
}

async function saveTrack(track, stationId) {
    const station = await httpService.get(BASE_URL + stationId)
    track.addedAt = new Date().toISOString().slice(0, 10)
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
    const stations = await spotifyService.getSpotifyItems({ type: 'categoryStations', id: categoryId} )
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
    await spotifyService.getAccessToken()
    
    for (let i = 0; i < categories.length; i++) {
        let stations = await spotifyService.getSpotifyItems({type: 'categoryStations', id: categories[i].id} )
        stations = stations?.map(station => ({ ...station, category: categories[i].name }))
        res.push(...stations)
    }
    
    return res
}

function getEmptyStation() {
    return {
        name: '',
        description: '',
        imgUrl: '',
        tracks: [],
        isEmpty: true
    }
}
