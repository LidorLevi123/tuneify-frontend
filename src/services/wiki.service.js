import { httpService } from "./http.service"

export const wikiService = {
    getArtistData
}

async function getArtistData(term) {
    try {
        const artistData = await httpService.get('wiki/', term)
        if (artistData.artistSnippet.includes('may refer to:')) artistData.artistSnippet = ''
        return artistData
    }
    catch (error) {
        console.log(error)
        throw new Error
    }
}
