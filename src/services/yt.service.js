
export const ytService = {
    queryYT
}

async function queryYT(trackName, artists) {
    const API_KEY = 'AIzaSyCy-U5zlHg4WobQ9TIYb_Y3d7uMvFqFv9A'
    const SEARCH = trackName + ' ' + artists
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}&q=${SEARCH}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        return data.items[0].id.videoId

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}