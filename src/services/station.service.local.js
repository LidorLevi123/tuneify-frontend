import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { spotifyService } from './spotify.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'stationDB'

export const stationService = {
    query,
    getById,
    save,
    remove,
    getEmptyStation,
    getStations,
    getStationTracks
}

async function query(filterBy = { name: '' }) {
    var stations = await storageService.query(STORAGE_KEY)
    return stations
}

async function getById(stationId) {
    let station = await storageService.get(STORAGE_KEY, stationId)
    station = JSON.parse(JSON.stringify(station))
    station.tracks = await stationService.getStationTracks(station)
    return station
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
        // station.owner = userService.getLoggedinUser()
        station.owner = 'Guest'
        savedStation = await storageService.post(STORAGE_KEY, station)
    }
    return savedStation
}

async function getStations() {
    let stations = utilService.loadFromStorage(STORAGE_KEY)
    if(stations) return stations

    stations = await spotifyService.getSpotifyItems('categoryStations', '0JQ5DAqbMKFDXXwE9BDJAr')
    utilService.saveToStorage(STORAGE_KEY, stations)
    return stations
}

async function getStationTracks(station) {
  if(station.owner) return
  const tracks = await spotifyService.getSpotifyItems('tracks', station._id)
  return tracks
}

function getEmptyStation() {
    return {
        _id: '',
        name: '',
        description: '',
        imgUrl: '',
        owner: '',
        trackList: [
            {
                _id: 111,
                title: "track1",
                YTid: "hbkkJctZSLY",
            },
            {
                _id: 222,
                title: "track2",
                YTid: "T4zgG3TlcZc",
            },
            {
                _id: 333,
                title: "track3",
                YTid: "kXeSRsH3ibw",
            },
            {
                _id: 444,
                title: "track4",
                YTid: "a-JlV44nqJ0",
            },
        ]
    }
}

function _createStations(amount) {
    let stations = utilService.loadFromStorage(STORAGE_KEY)
    if (!stations || !stations.length) {
        stations = []
        for (let i = 0; i < amount; i++) {
            stations.push(_createStation())
        }

        utilService.saveToStorage(STORAGE_KEY, stations)
    }
}

function _createStation() {
    const station = getEmptyStation()

    station._id = utilService.makeId()
    station.name = utilService.makeLorem(2)
    station.description = utilService.makeLorem(3)
    station.imgUrl = 'https://picsum.photos/170'

    return station
}

// Initial data
// ;(async ()=>{
//     const station = _getDemoStation()
//     await storageService.post(STORAGE_KEY, station)
// })()