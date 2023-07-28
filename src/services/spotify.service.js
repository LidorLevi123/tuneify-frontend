import config from "../../config.js"
import axios from "axios"

let gAccessToken = await getAccessToken(config.clientId, config.clientSecret)

export const spotifyService = {
    getSpotifyItems
}

async function getSpotifyItems(reqType, id) {
    // console.log('gAccessToken:', gAccessToken)
    const endpoints = {
        categoryStations: `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=il`,
        station: `https://api.spotify.com/v1/playlists/${id}`,
        tracks: `https://api.spotify.com/v1/playlists/${id}/tracks`,
    }
    try {
        // Make a GET request to the Spotify API endpoint
        const response = await axios.get(endpoints[reqType], {
            headers: {
                Authorization: `Bearer ${gAccessToken}`,
            },
        })
        // Return the playlist data from the response
        let cleanData
        switch (reqType) {
            case 'categoryStations':
                cleanData = _cleanCategoryStationsData(response.data)
                break
            case 'tracks':
                cleanData = _cleanStationsTracksData(response.data)
                break
            // case 'station':
            //   cleanData = _cleanStationsData(response.data)
            //   break
        }
        return cleanData
    } catch (error) {
        console.error(
            'Error retrieving data:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

async function getAccessToken(clientId, clientSecret) {
    try {
        // Encode client credentials (Client ID and Client Secret)
        const credentials = `${clientId}:${clientSecret}`
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
        return accessToken
    } catch (error) {
        console.error(
            'Error retrieving access token:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

function _cleanCategoryStationsData(data) {
    return data.playlists.items.map(item => {
        return {
            _id: item.id,
            name: item.name,
            imgUrl: item.images[0].url,
            description: item.description,
        }
    })
}

function _cleanStationsTracksData(data) {
    // const test = getSpotifyItems('tracks', '37i9dQZF1DXcF6B6QPhFDv')
    // console.log(test)
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



function _cleanArtists(artists) {
    return artists.map((artist) => artist.name)
}