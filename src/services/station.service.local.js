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
  spotifyService.getSpotifyItems('categoryStations', '0JQ5DAqbMKFEC4WFtoNRpw')
  spotifyService.getSpotifyItems('tracks', '37i9dQZF1DX45grRWk2ghU')
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

function _getDemoStation() {
    return {
        "name": "Mood Booster",
        "_id": "37i9dQZF1DX3rxVfibe1L0",
        "imgUrl": "https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95",
        "description": "Get happy with today's dose of feel-good songs!",
        "songs": [
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Flowers",
            "artist": "Miley Cyrus",
            "album": "Flowers",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273f429549123dbe8552764ba1d"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Calm Down (with Selena Gomez)",
            "artist": "Rema",
            "album": "Calm Down (with Selena Gomez)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273a3a7f38ea2033aa501afd4cf"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "I'm Good (Blue)",
            "artist": "David Guetta",
            "album": "I'm Good (Blue)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273933c036cd61cd40d3f17a9c4"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "I Ain't Worried",
            "artist": "OneRepublic",
            "album": "I Ain’t Worried (Music From The Motion Picture \"Top Gun: Maverick\")",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273ec96e006b8bdfc582610ec13"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Until I Found You (with Em Beihold) - Em Beihold Version",
            "artist": "Stephen Sanchez",
            "album": "Until I Found You (Em Beihold Version)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2732bf0876d42b90a8852ad6244"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "As It Was",
            "artist": "Harry Styles",
            "album": "As It Was",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Heat Waves",
            "artist": "Glass Animals",
            "album": "Dreamland",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273712701c5e263efc8726b1464"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Dandelions",
            "artist": "Ruth B.",
            "album": "Safe Haven",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27397e971f3e53475091dc8d707"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "SNAP",
            "artist": "Rosa Linn",
            "album": "SNAP",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731391b1fdb63da53e5b112224"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Nonsense",
            "artist": "Sabrina Carpenter",
            "album": "emails i can't send",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273700f7bf79c9f063ad0362bdf"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Watermelon Sugar",
            "artist": "Harry Styles",
            "album": "Fine Line",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27377fdcfda6535601aff081b6a"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Fast Car",
            "artist": "Luke Combs",
            "album": "Gettin' Old",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273ca650d3a95022e0490434ba1"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Made You Look",
            "artist": "Meghan Trainor",
            "album": "Takin' It Back",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731a4f1ada93881da4ca8060ff"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Sunroof",
            "artist": "Nicky Youre",
            "album": "Sunroof",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2730ed2184bf3fb4466d623a874"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Lavender Haze",
            "artist": "Taylor Swift",
            "album": "Midnights",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "If We Ever Broke Up",
            "artist": "Mae Stephens",
            "album": "If We Ever Broke Up",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273918207ec2316cec13a0e036f"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Shivers",
            "artist": "Ed Sheeran",
            "album": "=",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273ef24c3fdbf856340d55cfeb2"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "I Like You (A Happier Song) (with Doja Cat)",
            "artist": "Post Malone",
            "album": "Twelve Carat Toothache",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27334362676667a4322838ccc97"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Where Are You Now",
            "artist": "Lost Frequencies",
            "album": "Where Are You Now",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2738d7a7f1855b04104ba59c18b"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Bones",
            "artist": "Imagine Dragons",
            "album": "Mercury - Acts 1 & 2",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273fc915b69600dce2991a61f13"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "STAY (with Justin Bieber)",
            "artist": "The Kid LAROI",
            "album": "STAY (with Justin Bieber)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27341e31d6ea1d493dd77933ee5"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Cold Heart - PNAU Remix",
            "artist": "Elton John",
            "album": "Cold Heart (PNAU Remix)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2739f5cce8304c42d3a5463fd23"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Satellite",
            "artist": "Harry Styles",
            "album": "Harry's House",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2732e8ed79e177ff6011076f5f0"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Leave Before You Love Me (with Jonas Brothers)",
            "artist": "Marshmello",
            "album": "Leave Before You Love Me",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273ae40468931087f78919b86ce"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "THATS WHAT I WANT",
            "artist": "Lil Nas X",
            "album": "MONTERO",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273be82673b5f79d9658ec0a9fd"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Unstoppable",
            "artist": "Sia",
            "album": "This Is Acting (Deluxe Version)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273754b2fddebe7039fdb912837"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "My Universe",
            "artist": "Coldplay",
            "album": "My Universe",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273f60a9b7e2abafc38da31f575"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Green Green Grass",
            "artist": "George Ezra",
            "album": "Gold Rush Kid",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273ca576b6bbd56385e1120640e"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Save Your Tears (with Ariana Grande) (Remix)",
            "artist": "The Weeknd",
            "album": "Save Your Tears (Remix)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273c6af5ffa661a365b77df6ef6"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Numb",
            "artist": "Marshmello",
            "album": "Numb",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2732ff34dbc50313f8cea7b5db5"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Left and Right (Feat. Jung Kook of BTS)",
            "artist": "Charlie Puth",
            "album": "Left and Right (Feat. Jung Kook of BTS)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731c069c836dc6cd5b34c310fe"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "TRUSTFALL",
            "artist": "P!nk",
            "album": "TRUSTFALL",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27302f93e92bdd5b3793eb688c0"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Sunshine",
            "artist": "OneRepublic",
            "album": "Sunshine",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2733b248f42fb53c64faf1d748e"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Electric Love",
            "artist": "BØRNS",
            "album": "Dopamine",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273cc2cf912462d8ae4ef856434"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Celestial",
            "artist": "Ed Sheeran",
            "album": "Celestial",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273c18194a4022ec44507f7b248"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "About Damn Time",
            "artist": "Lizzo",
            "album": "About Damn Time",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273b817e721691aff3d67f26c04"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Waffle House",
            "artist": "Jonas Brothers",
            "album": "Waffle House",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273fd375ba0daa6b88d6fd671f4"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Meltdown",
            "artist": "Niall Horan",
            "album": "Meltdown",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2734d3210e1208ed3f39b42f3bc"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Bam Bam (feat. Ed Sheeran)",
            "artist": "Camila Cabello",
            "album": "Bam Bam (feat. Ed Sheeran)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273364ef5f9057092741f667fea"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "I'm Not Here To Make Friends",
            "artist": "Sam Smith",
            "album": "Gloria",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273fc3ff54493fcc890bcaa036c"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Light Switch",
            "artist": "Charlie Puth",
            "album": "CHARLIE",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27335d2e0ed94a934f2cc46fa49"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Hold Me Closer",
            "artist": "Elton John",
            "album": "Hold Me Closer",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2735d872e7b0c1ba964541f07e8"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Beautiful Mistakes (feat. Megan Thee Stallion)",
            "artist": "Maroon 5",
            "album": "JORDI (Deluxe)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27386a8ab515de4b7aef28cd631"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "2 Be Loved (Am I Ready)",
            "artist": "Lizzo",
            "album": "Special",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273fe3b1b9cb7183a94e1aafd43"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Dance The Night (From Barbie The Album)",
            "artist": "Dua Lipa",
            "album": "Dance The Night (From Barbie The Album)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2737dd3ba455ee3390cb55b0192"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Better Days (NEIKED x Mae Muller x Polo G)",
            "artist": "NEIKED",
            "album": "Better Days (NEIKED x Mae Muller x Polo G)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2736b742298f7f36717855c4caf"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "When I’m Gone (with Katy Perry)",
            "artist": "Alesso",
            "album": "When I’m Gone (with Katy Perry)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27337940571b0be91d69b5fd0d6"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "My Stupid Heart",
            "artist": "Walk off the Earth",
            "album": "My Stupid Heart",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273e7394926d34dc63fa76102a0"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Make You Mine",
            "artist": "PUBLIC",
            "album": "Make You Mine",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2730d0621554b1c6c9dbf3556be"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "That’s Not How This Works (feat. Dan + Shay)",
            "artist": "Charlie Puth",
            "album": "That’s Not How This Works (feat. Dan + Shay)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273cb3ff5d5083ab1a2aac42234"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Numb Little Bug",
            "artist": "Em Beihold",
            "album": "Numb Little Bug",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273dc0353a5801934f9a4bac01d"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Someone To You",
            "artist": "BANNERS",
            "album": "Where The Shadow Ends",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273f1bff89049561177b7cccebb"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Never Gonna Not Dance Again",
            "artist": "P!nk",
            "album": "Never Gonna Not Dance Again",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273a342edc8d90ae68d99333bab"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Coast (feat. Anderson .Paak)",
            "artist": "Hailee Steinfeld",
            "album": "Coast",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273f5397a412658c978232a1c10"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "AOK",
            "artist": "Tai Verdes",
            "album": "TV",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273818630bbc67e834cb9a6bd31"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Levitating (feat. DaBaby)",
            "artist": "Dua Lipa",
            "album": "Levitating (feat. DaBaby)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27349caa4fc6f962057ba65576a"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Put Your Records On",
            "artist": "Ritt Momney",
            "album": "Put Your Records On",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273d52d8eb3be188231e120dbbd"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Victoria's Secret",
            "artist": "Jax",
            "album": "Victoria’s Secret",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2736210b54a43fa2cf5711b880c"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Woke Up in Love",
            "artist": "Kygo",
            "album": "Woke Up in Love",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731d31a4969ceaaaa91c52e025"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Fly Away",
            "artist": "Tones And I",
            "album": "Welcome To The Madhouse",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2735d82973c30d736b1152a6e36"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "NO BAD DAYS (feat. Collett)",
            "artist": "Macklemore",
            "album": "BEN",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273033b871ae27b16ddd8139806"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Anyone",
            "artist": "Justin Bieber",
            "album": "Anyone",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2734b02db5cefb177ff97346cf2"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Can I Get It",
            "artist": "Adele",
            "album": "30",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273c6b577e4c4a6d326354a89f7"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Butterflies",
            "artist": "MAX",
            "album": "Butterflies",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731b7c878bdc17d023295df222"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "World's Smallest Violin",
            "artist": "AJR",
            "album": "OK ORCHESTRA",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273fc9511f26808c1eee73b414d"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Lil Bit",
            "artist": "Nelly",
            "album": "Lil Bit",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27395a25a5b79a59eba1c8f93ee"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "RUNAWAY",
            "artist": "OneRepublic",
            "album": "RUNAWAY",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27386a9ec959dd68d0fbd61882b"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "You",
            "artist": "Dan + Shay",
            "album": "Good Things",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2735d847661ee74db6591c4a30b"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "favorite kind of high",
            "artist": "Kelly Clarkson",
            "album": "favorite kind of high",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2732f63588acbe0714e01f785c9"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Wonder Woman",
            "artist": "John Legend",
            "album": "LEGEND",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273d9ed57269dbc991a30657494"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "I Feel Like Dancing",
            "artist": "Jason Mraz",
            "album": "I Feel Like Dancing",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27329b295928ac5b93649a9763f"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Clarity",
            "artist": "Vance Joy",
            "album": "Clarity",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273eabdc32582cf9a4a7d2f6a63"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Wave of You",
            "artist": "Surfaces",
            "album": "Wave of You",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2730011e7236c7e36e6f934248c"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Love Again",
            "artist": "Dua Lipa",
            "album": "Future Nostalgia",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273d4daf28d55fe4197ede848be"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "CUFF IT",
            "artist": "Beyoncé",
            "album": "RENAISSANCE",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b27323c76f2aed00e5aa618bad0a"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Joy",
            "artist": "Andy Grammer",
            "album": "Joy",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b2736f5b1adac0159e46d2313c2c"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Little Bit of Love",
            "artist": "Tom Grennan",
            "album": "Little Bit of Love (Acoustic)",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273678c6bf0f996ee771fb7e6da"
          },
          {
            "addedAt": "2023-05-26T04:00:00Z",
            "title": "Big Energy",
            "artist": "Latto",
            "album": "Big Energy",
            "imgUrl": "https://i.scdn.co/image/ab67616d0000b273493a07675d372a00929b2407"
          }
        ]
      }
}