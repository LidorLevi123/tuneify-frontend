
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    // addStationMsg
}

const gStations = _createStations()
console.log(gStations)

async function query(filterBy = { txt: '', price: 0 }) {
    var stations = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     stations = stations.filter(station => regex.test(station.vendor) || regex.test(station.description))
    // }
    // if (filterBy.price) {
    //     stations = stations.filter(station => station.price <= filterBy.price)
    // }
    return stations
}

function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STORAGE_KEY, station)
    } else {
        // Later, owner is set by the backend
        station.owner = userService.getLoggedinUser()
        savedStation = await storageService.post(STORAGE_KEY, station)
    }
    return savedStation
}

// async function addStationMsg(stationId, txt) {
//     // Later, this is all done by the backend
//     const station = await getById(stationId)
//     if (!station.msgs) station.msgs = []

//     const msg = {
//         id: utilService.makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     station.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, station)

//     return msg
// }

function getEmptyStation() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}

function _createStations() {
    var stations = []

    stations.push(_createStation('s101', 'Funky Monks'))
    stations.push(_createStation('s102', 'Yaron Nitzan'))

    return stations
}

function _createStation(id, name) {
    return {
        "_id": id,
        "name": name,
        "tags": [
          "Funk",
          "Happy"
        ],
        "createdBy": {
          "_id": "u101",
          "fullname": "Puki Ben David",
          "imgUrl": "http://some-photo/"
        },
        "likedByUsers": ['{minimal-user}', '{minimal-user}'],
        "songs": [
          {
            "id": "s1001",
            "title": "The Meters - Cissy Strut",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/4_iC0MyIykM/mqdefault.jpg",
            "addedBy": '{minimal-user}',
            "addedAt": 162521765262
          },
          {
            "id": "mUkfiLjooxs",
            "title": "The JB's - Pass The Peas",
            "url": "youtube/song.mp4",
            "imgUrl": "https://i.ytimg.com/vi/mUkfiLjooxs/mqdefault.jpg",
            "addedBy": {}
          },
        ],
        "msgs": [
          {
            id: 'm101',
            from: '{mini-user}',
            txt: 'Manish?'
          }
        ]
      }
}


// Initial data
// ;(async ()=>{
//     await storageService.post(STORAGE_KEY, gStations)
// })()