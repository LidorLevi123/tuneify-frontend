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
    getAccessToken,
    getAllStations,
    removeStationsByName,
    getArtistData
}

window.cs = stationService // for console usage

async function query(userId) {
    const filterBy = { userId }
    const stations = await httpService.get(BASE_URL, filterBy)
    return stations
}

async function getAllStations() {
    return await httpService.get('station/getall')
}

async function getById(spotifyId) {
    try {
        let dbStation = await httpService.get(BASE_URL + spotifyId)
        let spotifyStation

        if (!dbStation) {
            console.log('fetching from Spotify')
            spotifyStation = await spotifyService.getSpotifyItems({ type: 'station', id: spotifyId })
            dbStation = await httpService.post(BASE_URL, spotifyStation)
            return dbStation
        } else {
            if (dbStation.owner.fullname !== 'Tuneify') return dbStation

            spotifyStation = await spotifyService.getSpotifyItems({ type: 'station', id: dbStation.spotifyId })

            if (_stationsDifferent(spotifyStation, dbStation)) {
                console.log('changed - updating from Spotify')
                spotifyStation._id = dbStation._id
                save(spotifyStation)

                return spotifyStation
            } else {
                console.log('station unchanged - fetching from DB')
                return dbStation
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

function _stationsDifferent(spotify, db) {
    return spotify.tracks.some((track, i) => db.tracks[i].id !== track.id)
}


async function remove(stationId) {
    const station = await httpService.delete('station/byid/' + stationId)
    return station
}
async function removeStationsByName(term) {
    return await httpService.delete('station/byname/' + term)
}

async function save(station) {
    if (station.name.includes('Search results')) return
    if (station._id) return await httpService.put(BASE_URL + station._id, station)
    else return await httpService.post(BASE_URL, station)
}

async function getSearchRes(query) {
    const { tracks, stations } = await spotifyService.getSpotifyItems({ type: 'search', query })
    return {
        name: `Search results for: ${query}`,
        isEmpty: false,
        tracks: tracks,
        stations: stations
    }

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
        { id: 'toplists', name: 'Top Lists' },
        { id: 'featured', name: 'Featured Playlists' },
        { id: '0JQ5DAqbMKFLVaM30PMBm4', name: 'Summer' },
        { id: '0JQ5DAqbMKFAXlCG6QvYQ4', name: 'Workout' },
        { id: '0JQ5DAqbMKFzHmL4tf05da', name: 'Mood' },
        { id: '0JQ5DAqbMKFQIL0AXnG5AK', name: 'Trending' },
        { id: '0JQ5DAqbMKFAQy4HL4XU2D', name: 'Travel' },
        { id: '0JQ5DAqbMKFRKBHIxJ5hMm', name: 'Tastemakers' },
        { id: '0JQ5DAqbMKFIVNxQgRNSg0', name: 'Decades' },
        { id: '0JQ5DAqbMKFEC4WFtoNRpw', name: 'Pop' },
        { id: '0JQ5DAqbMKFPrEiAOxgac3', name: 'Classical' },
        { id: '0JQ5DAqbMKFCfObibaOZbv', name: 'Gaming' },
    ]

    const stationPromises = categories.map(async (category) => {
        try {
            if (category.id === 'featured') {
                const featured = await spotifyService.getSpotifyItems({ type: 'featured' });
                return featured.map((item) => ({ ...item, category: category.name, categoryId: category.id }))
            } else {
                const stations = await spotifyService.getSpotifyItems({ type: 'categoryStations', id: category.id })
                return stations.map((station) => ({ ...station, category: category.name, categoryId: category.id }))
            }
        } catch (error) {
            console.error(`Error fetching data for category ${category.name}: ${error.message}`)
            return []
        }
    })

    try {
        const results = await Promise.all(stationPromises)
        const filteredResults = results.filter(stationsArray => stationsArray.length > 8)
        _cleanDescriptions(filteredResults)
        return filteredResults
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`)
        throw new Error('Failed to fetch station data')
    }
}

// cleans descriptions from <a> tags
function _cleanDescriptions(arr) {
    arr.forEach(item => {
        if (Array.isArray(item)) _cleanDescriptions(item)
        else if (typeof item === 'object') item.description = item.description.replace(/<a\b[^>]*>.*?<\/a>/gi, '')
    })
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

async function getArtistData(id) {
    return await spotifyService.getSpotifyItems({ type: 'artist', id })
}