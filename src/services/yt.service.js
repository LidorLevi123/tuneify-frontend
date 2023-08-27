import { httpService } from './http.service'

export const ytService = {
    queryYT
}

async function queryYT(term) {
    try {
        const youtubeId = await httpService.get('youtube/', term)
        return youtubeId
    }
    catch (error) {
        console.log(error)
        throw new Error
    }

}



