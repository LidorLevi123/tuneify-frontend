import { httpService } from './http.service'

export const ytService = {
    queryYT
}

async function queryYT(term) {
    try {
        const { youtubeId, currApiKeyIdx } = await httpService.get('youtube/', term)
        console.log(`got response using api key ${currApiKeyIdx}`)
        return youtubeId
    }
    catch (error) {
        console.log(error)
        throw new Error
    }

}



