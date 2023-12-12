import { httpService } from './http.service'

export const ytService = {
    queryYT
}

async function queryYT(term, trackId) {
    try {
        const { youtubeId, currApiKeyIdx } = await httpService.get('youtube/', { term, trackId })
        if (currApiKeyIdx === 'From DB') console.log(`got response from DB`)
        else console.log(`got response using api key ${currApiKeyIdx}`)
        return youtubeId
    }
    catch (error) {
        console.log(error)
        throw new Error
    }

}



