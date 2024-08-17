import { httpService } from './http.service'

export const ytService = {
    queryYT
}

async function queryYT(term, track) {
    const { id, artists, title , imgUrl, albumId } = track

    try {
        const { youtubeId, currApiKeyIdx } = await httpService.get('youtube/', { term, id, artists, title, imgUrl, albumId })
        
        if (currApiKeyIdx === 'From DB') console.log(`got response from DB`)
        else console.log(`got response using api key ${currApiKeyIdx}`)
        return youtubeId
    }
    catch (error) {
        console.log(error)
        throw new Error
    }

}



