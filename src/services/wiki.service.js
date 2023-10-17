import { httpService } from "./http.service"

export const wikiService = {
    getArtistData
}

async function getArtistData(term) {
    try {
        const artistData = await httpService.get('wiki/', term)
        return artistData && !artistData.includes('may refer to:') ? artistData : ''
    }
    catch (error) {
        console.log(error)
        throw new Error
    }
}
