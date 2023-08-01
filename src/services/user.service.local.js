import { storageService } from './async-storage.service'
import { stationService } from './station.service.local'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore
}

window.userService = userService

function getUsers() {
    return storageService.query('user')
}

async function getById(userId) {
    const user = await storageService.get('user', userId)
    return user
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, stationsId }) {
    const user = await storageService.get('user', _id)

    user.stationsId = stationsId

    await storageService.put('user', user)

    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user
}

// async function update({ _id, score }) {
//     const user = await storageService.get('user', _id)
//     user.score = score
//     await storageService.put('user', user)

//     // Handle case in which admin updates other user's details
//     if (getLoggedinUser()._id === user._id) saveLocalUser(user)
//     return user
// }

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
    if (user) {
        return saveLocalUser(user)
    }
}

async function signup(userCred) {
    const users = await getUsers()
    if(users.some(u => u.username === userCred.username)) return

    const station = stationService.getEmptyStation()
    station.name = 'Liked Songs'
    station.imgUrl = 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'
    const likedSongsStation = await stationService.save(station)
    
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.likedId = likedSongsStation._id
    userCred.stationIds = []
    
    const user = await storageService.post('user', userCred)

    likedSongsStation.owner = { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl }
    await stationService.save(likedSongsStation)

    return saveLocalUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

async function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not loggedin')
    user.score = user.score + by || by
    await update(user)
    return user.score
}

function saveLocalUser(user) {
    user =
    {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        stationIds: user.stationIds,
        likedId: user.likedId
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
    return user
}

// Initial data
// ;(async ()=>{
    // await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
    // await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
    // setTimeout(()=> {
    //     userService.signup({fullname: 'Guest', username: 'guest', password:'123' })
    // },200)
// })()