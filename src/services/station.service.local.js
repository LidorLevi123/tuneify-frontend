import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'stationDB'

export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
}

_createStations(3)

async function query(filterBy = { name: '' }) {
  var stations = await storageService.query(STORAGE_KEY)

  // console.log(stations)
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
    // station.owner = userService.getLoggedinUser()
    station.owner = 'Guest'
    savedStation = await storageService.post(STORAGE_KEY, station)
  }
  return savedStation
}

function getEmptyStation() {
  return {
    _id: '',
    name: '',
    description: '',
    imgUrl: '',
    owner: ''
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
  station.name = utilService.makeLorem(2),
  station.description = utilService.makeLorem(3),
  station.imgUrl = 'https://picsum.photos/170'

  return station
}


// Initial data
// ;(async ()=>{
//     await storageService.post(STORAGE_KEY, station)
// })()