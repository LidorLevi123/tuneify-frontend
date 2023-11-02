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

async function getById(spotifyId, type = 'station') {
    try {
        let dbStation = await httpService.get(BASE_URL + spotifyId)
        let spotifyStation

        if (!dbStation) {
            console.log('fetching from Spotify')
            spotifyStation = await spotifyService.getSpotifyItems({ type: type, id: spotifyId })
            dbStation = await httpService.post(BASE_URL, spotifyStation)
            return dbStation
        } else {
            if (dbStation.owner?.fullname !== 'Tuneify') return dbStation

            spotifyStation = await spotifyService.getSpotifyItems({ type: type, id: dbStation.spotifyId })

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
    const { tracks, stations, albums } = await spotifyService.getSpotifyItems({ type: 'search', query })
    return {
        name: `Search results for: ${query}`,
        isEmpty: false,
        tracks: tracks,
        stations: stations,
        albums: albums
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

async function getStationsForHome() {
    return await httpService.get('spotify/home')
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