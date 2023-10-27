import { httpService } from '../services/http.service'

export const spotifyService = {
    getSpotifyItems,
}

async function getSpotifyItems(req) {
    return await httpService.get('spotify/', req)
}