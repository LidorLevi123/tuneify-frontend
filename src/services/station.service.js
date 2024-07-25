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
    getArtistData,
    getRecommendations,
    checkForChanges,
    getBackendLog
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

async function getBackendLog() {
    return await httpService.get('log')
}

async function getById(spotifyId, type = 'station') {
    try {
        let dbStation = await httpService.get(BASE_URL + spotifyId)
        if (dbStation) return dbStation
        else {
            let spotifyStation
            console.log('fetching from Spotify')
            if (type === 'artist') spotifyStation = await getArtistData(spotifyId)
            else spotifyStation = await spotifyService.getSpotifyItems({ type: type, id: spotifyId })

            if (spotifyStation) return await httpService.post(BASE_URL, spotifyStation)
        }
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function checkForChanges(station) {
    station.lastUpdate = Date.now()
    save(station)
    try {
        const spotifyStation = await spotifyService.getSpotifyItems({ type: 'station', id: station.spotifyId })
        if (spotifyStation.snapshot_id === station.snapshot_id) return null
        else {
            spotifyStation._id = station._id
            return save(spotifyStation)
        }
    }
    catch (error) {
        console.error('Error fetching data:', error)
    }
}

async function remove(stationId) {
    const station = await httpService.delete('station/byid/' + stationId)
    return station
}

async function removeStationsByName(term) {
    return await httpService.delete('station/byname/' + term)
}

async function save(station) {
    if (station.name.includes('Search results') || station.name.includes('Recommendations')) return
    if (station._id) return await httpService.put(BASE_URL + station._id, station)
    else return await httpService.post(BASE_URL, station)
}

async function getSearchRes(query) {
    const { tracks, stations, albums, artists } = await spotifyService.getSpotifyItems({ type: 'search', query })

    return {
        name: `Search results for: ${query}`,
        isEmpty: false,
        tracks: tracks,
        stations: stations,
        albums: albums,
        artists: artists
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

async function getCategoryStations(categoryId, market) {
    const stations = await spotifyService.getSpotifyItems({ type: 'categoryStations', id: categoryId, market })
    return stations
}

async function getStationsForHome(market) {
    return await httpService.get(`spotify/home/${market}`)
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

async function getArtistData(id, light = false) {
    try {
        const artist = await spotifyService.getSpotifyItems({ type: 'artist', id })
        if (light) return artist

        const artistTopTracks = await spotifyService.getSpotifyItems({ type: 'artistTopTracks', id })
        const artistAlbums = await spotifyService.getSpotifyItems({ type: 'artistAlbums', id })
        const artistRelatedArtists = await spotifyService.getSpotifyItems({ type: 'artistRelatedArtists', id })

        return {
            ...artist,
            tracks: artistTopTracks,
            albums: artistAlbums,
            relatedArtists: artistRelatedArtists
        }
    }
    catch (error) {
        console.error('Error fetching artist data:', error)
    }
}

async function getRecommendations(id) {
    const recommendations = await spotifyService.getSpotifyItems({ type: 'recommendations', id })
    return recommendations
}