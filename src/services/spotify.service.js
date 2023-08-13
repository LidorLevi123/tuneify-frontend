import axios from 'axios'
import { httpService } from '../services/http.service'

export const spotifyService = {
    getSpotifyItems,
    getAccessToken
}
let gAccessToken = null
getAccessToken()

async function getAccessToken() {
    gAccessToken = await httpService.get('spotify/')
}



async function getSpotifyItems(req) {
    const { type, id, query } = req

    const endpoints = _getEndpoints(id, query)

    try {
        // Make a GET request to the Spotify API endpoint
        const response = await axios.get(endpoints[type], {
            headers: {
                Authorization: `Bearer ${gAccessToken}`,
            },
        })

        // Clean and return the data from response
        let cleanData = await _cleanResponseData(response.data, type)
        return cleanData

    } catch (error) {
        console.error(
            'Error retrieving data:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}



function _getEndpoints(id, query) {
    return {
        categoryStations: `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=il&limit=9`,
        station: `https://api.spotify.com/v1/playlists/${id}`,
        tracks: `https://api.spotify.com/v1/playlists/${id}/tracks`,
        search: `https://api.spotify.com/v1/search?q=${query}&type=track,playlist`
    }
}

async function _cleanResponseData(data, type) {
    let cleanData

    switch (type) {
        case 'categoryStations':
            cleanData = _cleanCategoryStationsData(data)
            break
        case 'tracks':
            cleanData = _cleanStationTracksData(data)
            break
        case 'station':
            cleanData = await _cleanStationData(data)
            break
        case 'search':
            cleanData = await _cleanSearchData(data)
            break
    }
    return cleanData
}

async function _cleanStationData(data) {
    const station = {
        spotifyId: data.id,
        name: data.name,
        imgUrl: data.images[0].url,
        description: data.description,
        owner: { fullname: 'Tuneify' },
        tracks: await getSpotifyItems({ type: 'tracks', id: data.id }),
    }
    return station
}

function _cleanCategoryStationsData(data) {
    return data.playlists.items.map(item => ({
        spotifyId: item.id ? item.id : '0',
        name: item.name,
        imgUrl: item.images[0].url,
        description: item.description,
    }))
}

function _cleanStationTracksData(data) {
    return data.items.map(item => {
        return {
            addedAt: item.added_at,
            id: item.track.id,
            title: item.track.name,
            artists: _cleanArtists(item.track.artists),
            imgUrl: item.track.album.images[0].url,
            formalDuration: item.track.duration_ms,
            album: item.track.album.name,
            youtubeId: ''
        }
    })
}

async function _cleanSearchData(data) {
    const tracks = data.tracks.items.map(track => ({
        id: track.id,
        title: track.name,
        artists: _cleanArtists(track.artists),
        imgUrl: track.album.images[0].url,
        formalDuration: track.duration_ms,
        album: track.album.name,
        youtubeId: ''
    }))

    return { tracks }
}

function _cleanArtists(artists) {
    return artists.map((artist) => artist.name)
}

function _getRandomDate() {
    const startYear = 2021
    const endYear = 2023
    const maxMonth = 7 // July

    const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear
    const randomMonth = Math.floor(Math.random() * (maxMonth + 1)) + 1 // Adding 1 because months are zero-based
    const randomDay = Math.floor(Math.random() * 31) + 1 // Assume maximum of 31 days in a month

    const randomDate = new Date(Date.UTC(randomYear, randomMonth - 1, randomDay, 0, 0, 0))

    return randomDate.toISOString()
}