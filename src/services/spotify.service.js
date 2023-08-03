import config from "../../config.js"
import axios from "axios"

let gAccessToken = ''

await getAccessToken()

async function getAccessToken() {

    try {
        // Encode client credentials (Client ID and Client Secret)
        const credentials = `${config.clientId}:${config.clientSecret}`
        const encodedCredentials = btoa(credentials)
        // Make a POST request to the token endpoint
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${encodedCredentials}`,
                },
            }
        )
        // Extract and return the access token from the response
        const { data } = response
        const accessToken = data.access_token
        const expiresIn = data.expires_in

        gAccessToken = accessToken
    } catch (error) {
        console.error(
            'Error retrieving access token:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const spotifyService = {
    getSpotifyItems
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
        let cleanData = _cleanResponseData(response.data, type)
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
        search: `https://api.spotify.com/v1/search?q=${query}&type=track`
    }
}

function _cleanResponseData(data, type) {
    let cleanData

    switch (type) {
        case 'categoryStations':
            cleanData = _cleanCategoryStationsData(data)
            break
        case 'tracks':
            cleanData = _cleanStationTracksData(data)
            break
        case 'station':
            cleanData = _cleanStationData(data)
            break
        case 'search':
            cleanData = _cleanSearchData(data)
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
        _id: item.id,
        name: item.name,
        imgUrl: item.images[0].url,
        description: item.description,
    }))
}

// const test = getSpotifyItems('tracks', '37i9dQZF1DXcF6B6QPhFDv')
// console.log(test)
function _cleanStationTracksData(data) {
    return data.items.map(item => {
        return {
            addedAt: _getRandomDate(),
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

// const res = await getSpotifyItems({ type: 'search', query: 'לחם חביתה' })
// console.log(res)

function _cleanSearchData(data) {
    return data.tracks.items.map(track => {
        return {
            id: track.id,
            title: track.name,
            artists: _cleanArtists(track.artists),
            imgUrl: track.album.images[0].url,
            formalDuration: track.duration_ms,
            album: track.album.name,
        }
    })
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