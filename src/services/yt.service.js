
export const ytService = {
    queryYT
}

async function queryYT(term) {
    // const API_KEY = 'AIzaSyCy-U5zlHg4WobQ9TIYb_Y3d7uMvFqFv9A'
    // const API_KEY = 'AIzaSyAFo_70utuVUzF4r0LOkUY-Ic3D_r42q4Y'
    // const API_KEY = 'AIzaSyBK8Ic74OFOgiOBsNLq1IdL-KiohmWxSWc'
    // const API_KEY = 'AIzaSyDs5x70KoJf284KXR-EZbtFcZD4p0tOdvQ'
    // const API_KEY = 'AIzaSyCp8KMTEjR9frWUGpSnc8Cw5cLVe7wRRDM'
    const API_KEY = 'AIzaSyBSmi6bWbWDWTLM0c2Vnd38PhNqNG7Y7H0'
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${API_KEY}&q=${term}`

    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.items[0].id.videoId

    } catch (error) {
        console.error('Error fetching data:', error)
    }
}