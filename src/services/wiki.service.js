import { httpService } from "./http.service"

export const wikiService = {
    getArtistData
}

async function getArtistData(term) {
    try {
        return await httpService.get('wiki/', term)
        // return artistData
    }
    catch (error) {
        console.log(error)
        throw new Error
    }
}
