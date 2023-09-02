import { httpService } from './http.service.js'
import { spotifyService } from './spotify.service.js'


const BASE_URL = 'station/'

export const stationService = {
    query,
    getById,
    save,
    remove,
    saveTrack,
    removeTrack,
    getEmptyStation,
    getSearchRes,
    getCategoryStations,
    getStationsForHome,
    getAccessToken
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
    const resultsStation = getEmptyStation()
    resultsStation.name = `Search results for: ${query}`
    resultsStation.isEmpty = false
    resultsStation.tracks = res.tracks
    return resultsStation
}

async function saveTrack(track, stationId) {
    const station = await httpService.get(BASE_URL + stationId)
    track.addedAt = new Date().toISOString().slice(0, 10)
    station.tracks.push(track)
    await save(station)
}

async function removeTrack(trackId, stationId) {
    const station = await httpService.get(BASE_URL + stationId)
    const idx = station.tracks.findIndex(currTrack => currTrack.id === trackId)
    station.tracks.splice(idx, 1)
    await save(station)
}

async function getCategoryStations(categoryId) {
    const stations = await spotifyService.getSpotifyItems({ type: 'categoryStations', id: categoryId })
    return stations
}

async function getAccessToken() {
    await spotifyService.getAccessToken()
}

async function getStationsForHome() {
    const categories = [
        { id: '0JQ5DAqbMKFRKBHIxJ5hMm', name: 'Tastemakers' },
        { id: '0JQ5DAqbMKFLVaM30PMBm4', name: 'Summer' },
        { id: 'toplists', name: 'Top Lists' },
        { id: '0JQ5DAqbMKFQIL0AXnG5AK', name: 'Trending' },
        { id: '0JQ5DAqbMKFAQy4HL4XU2D', name: 'Travel' },
        { id: '0JQ5DAqbMKFAXlCG6QvYQ4', name: 'Workout' },
        { id: '0JQ5DAqbMKFIVNxQgRNSg0', name: 'Decades' },
        { id: '0JQ5DAqbMKFEC4WFtoNRpw', name: 'Pop' },
        { id: '0JQ5DAqbMKFPrEiAOxgac3', name: 'Classical' },
        { id: '0JQ5DAqbMKFCfObibaOZbv', name: 'Gaming' },
    ]

    try {
        const stationPromises = categories.map(async (category) => {
            const stations = await spotifyService.getSpotifyItems({ type: 'categoryStations', id: category.id })
            return stations.map((station) => ({ ...station, category: category.name, categoryId: category.id }))
        })

        const results = await Promise.all(stationPromises)
        return results
    } catch (error) {
        console.error(error)
        throw new Error('Failed to fetch station data')
    }
}
// getArtistData('1HY2Jd0NmPuamShAr6KMms')

async function getArtistData(artistId) {
    const artist = await spotifyService.getSpotifyItems({ type: 'artist', id: artistId })
    return artist
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
