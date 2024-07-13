import { httpService } from "./http.service"
export const lyricsService = {
    getLyrics
}

async function getLyrics(term) {
    try {
        const lyrics = await httpService.get('lyrics/', {term})
        return lyrics
    }
    catch (error) {
        console.log(error)
        throw new Error
    }
}