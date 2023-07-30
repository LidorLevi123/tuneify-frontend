
export const ytService = {
    queryYT
}

async function queryYT(term) {
    const API_KEY = 'AIzaSyAFo_70utuVUzF4r0LOkUY-Ic3D_r42q4Y'
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}&q=${term}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        return data.items[0].id.videoId

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}