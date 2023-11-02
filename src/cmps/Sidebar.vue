<template>
    <section class="sidebar-list-container" v-if="user" :style="{ width: sidebarWidth }">
        <section class="sidebar-top">
            <button class="collapse" @click="collapseSidebar">
                <span v-if="!sidebarCollapsed" v-icon="'collapse'"></span>
                <span v-else v-icon="'collapsed'"></span>
                <div v-if="!sidebarCollapsed">Your Library</div>
            </button>
            <button v-icon="'createList'" @click="addStation()" title="Create playlist" class="add-station"
                v-if="!sidebarCollapsed"></button>
        </section>
        <section class="filter-btns" v-if="!sidebarCollapsed">
            <button v-show="filterBy" @click="this.filterBy = null" v-icon="'close'" class="unfilter btn"></button>
            <button v-show="playlistsBtn" @click="setFilterBy('')" class="filter btn"
                :class="{ active: this.filterBy === 'playlists' || this.filterBy === 'Tuneify' || this.filterBy === this.user?.fullname }">Playlists</button>
            <button v-show="byTuneifyBtn" @click="setFilterBy('Tuneify')" class="filter btn"
                :class="{ active: this.filterBy === 'Tuneify', transform: this.filterBy === 'Tuneify' }">By Tuneify</button>
            <button v-show="byYouBtn" @click="setFilterBy(this.user?.fullname)" class="filter btn"
                :class="{ active: this.filterBy === this.user?.fullname, transform: this.filterBy === this.user?.fullname }">By
                You</button>
            <button v-show="albumsBtn" @click="setFilterBy('albums')" class="filter btn"
                :class="{ active: this.filterBy === 'albums' }">Albums</button>
        </section>
        <section class="filter-sort" v-if="!sidebarCollapsed">
            <div v-if="!searchOpen" @click.stop="toggleSearch">
                <button v-icon="'sSearch'" title="Search in library" class="station-search-btn"></button>
            </div>
            <section v-else class="search-container" v-clickOutside="toggleSearch">
                <span class="df ai" v-icon="`sSearch`"></span>
                <input ref="searchInput" class="station-search-input" type="text" v-model="query"
                    placeholder="Search in Your Library">
                <span v-if="query" class="df ai" v-icon="'close'" @click.stop="this.query = ''"></span>
            </section>
            <section @click="toggleSortMenu" class="sort-container">
                <span class="sort-btn">{{ sortedBy }}
                    <ul v-if="sortMenuOpen" v-clickOutside="toggleSortMenu" class="clean-list sort-menu">
                        <li class="sort-menu-header">sort by</li>
                        <li class="sort-option" :class="{ active: sortedBy === 'Alphabetical' }"
                            @click.stop="filterSortLibrary('Alphabetical')">
                            <span>Alphabetical</span>
                            <span v-show="sortedBy === 'Alphabetical'" class="vee-icon" v-icon="`vee`"></span>
                        </li>
                        <li class="sort-option" :class="{ active: sortedBy === 'Creator' }"
                            @click.stop="filterSortLibrary('Creator')">
                            <span>Creator</span>
                            <span v-show="sortedBy === 'Creator'" class="vee-icon" v-icon="`vee`"></span>
                        </li>
                        <li class="sort-option" :class="{ active: sortedBy === 'Custom Order' }"
                            @click.stop="filterSortLibrary('Custom Order')">Custom Order <span
                                v-show="sortedBy === 'Custom Order'" class="vee-icon" v-icon="`vee`"></span></li>
                        <hr>
                        <li class="sort-menu-header">View as</li>
                        <li class="sort-option" :class="{ active: libraryView === 'compact' }"
                            @click.stop="setLibraryView('compact')">
                            <div>
                                <span class="view-option-icon" :class="{ active: libraryView === 'compact' }"
                                    v-icon="`compact`"></span>
                                <span>Compact</span>
                            </div>
                            <span v-show="libraryView === 'compact'" class="vee-icon" v-icon="`vee`"></span>
                        </li>
                        <li class="sort-option" :class="{ active: libraryView === 'list' }"
                            @click.stop="setLibraryView('list')">
                            <div>
                                <span class="view-option-icon" :class="{ active: libraryView === 'list' }"
                                    v-icon="`list`"></span>
                                <span>List</span>
                            </div>
                            <span v-show="libraryView === 'list'" class="vee-icon" v-icon="`vee`"></span>
                        </li>
                    </ul>
                </span>
                <span class="view-option-icon" v-icon="this.libraryView"></span>
            </section>
        </section>
        <section v-if="!libraryStations.length && this.query" class="no-results-msg">
            <h1>Couldn't find "{{ query }}"</h1>
            <h2>Try searching again using a different spelling or keyword.</h2>
        </section>
        <LibraryStationList v-else @station-remove="removeStation" :libraryStations="libraryStations" />
    </section>
</template>

<script>
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { stationService } from '../services/station.service'
import LibraryStationList from './LibraryStationList.vue'
import { eventBus } from '../services/event-bus.service'
export default {
    name: 'Sidebar',
    data() {
        return {
            libraryStations: null,
            query: '',
            sortedBy: 'Custom Order',
            filterBy: null,
            sortMenuOpen: false,
            searchOpen: false,
            searchBtn: true,
        }
    },

    created() {
        this.duplicateStationsToLibrary()
        eventBus.on('duplicateStationsToLibrary', this.duplicateStationsToLibrary)
        eventBus.on('loadLibrary', this.filterSortLibrary)
        eventBus.on('add-station', this.addStation)
    },
    unmounted() {
        eventBus.off('duplicateStationsToLibrary', this.duplicateStationsToLibrary)
        eventBus.off('loadLibrary', this.filterSortLibrary)
        eventBus.off('add-station', this.addStation)
    },

    methods: {
        async duplicateStationsToLibrary() {
            this.libraryStations = [...this.stationsState]
        },
        async addStation(track) {
            try {
                const stationToSave = stationService.getEmptyStation()

                stationToSave.name = track?.title || 'My Playlist #' + this.libraryStations.length

                const station = await this.$store.dispatch({ type: 'saveStation', stationToSave })
                if (track && station) await this.$store.dispatch({ type: 'addTrack', trackToSave: track, stationId: station._id })
                await this.$store.dispatch({ type: 'updateUserStations', stationId: station._id, action: 'add' })
                this.libraryStations.push(station)
                showSuccessMsg('Added to Your Library')
                if (!track) this.$router.push(`/station/${station._id}`)
            } catch (err) {
                console.log('Could not add station', err)
            }
        },
        async removeStation(station) {
            if (station.name === 'Liked Songs') return showErrorMsg('Cannot remove Liked Songs')

            const idx = this.libraryStations.findIndex(item => item._id === station._id)
            if (idx !== -1) this.libraryStations.splice(idx, 1)

            try {
                if (station.owner.fullname !== 'Tuneify') {
                    await this.$store.dispatch({ type: 'removeStation', stationId: station._id })
                }
                await this.$store.dispatch({ type: 'updateUserStations', stationId: station._id, action: 'remove' })
                this.$store.commit({ type: 'setUserStations', station, action: 'remove' })

                this.contextmenuOpen = false
                showSuccessMsg('Removed from Your Library')
            } catch (err) {
                console.log(err.message)
                showErrorMsg('Could not remove station')
            }
        },
        async filterSortLibrary(sortBy = this.sortedBy) {
            try {
                this.libraryStations = await stationService.query(this.user._id)
            } catch (err) {
                showErrorMsg('Could not load library')
                console.log('Could not load library', err)
                throw err
            }

            if (sortBy === 'Alphabetical') {
                if (this.sortOrder === 'asc' || !this.sortOrder) {
                    this.libraryStations.sort((a, b) => a.name.localeCompare(b.name))
                    this.sortOrder = 'desc'
                } else {
                    this.libraryStations.sort((a, b) => b.name.localeCompare(a.name))
                    this.sortOrder = 'asc'
                }
            }
            if (sortBy === 'Creator') {
                if (this.sortOrder === 'asc' || !this.sortOrder) {
                    this.libraryStations.sort((a, b) => a.owner.fullname.localeCompare(b.owner.fullname))
                    this.sortOrder = 'desc'
                } else {
                    this.libraryStations.sort((a, b) => b.owner.fullname.localeCompare(a.owner.fullname))
                    this.sortOrder = 'asc'
                }
            }

            this.libraryStations = this.libraryStations.filter(station => station.name.toLowerCase().includes(this.query.toLowerCase()))
            if (this.filterBy === 'albums') this.libraryStations = this.libraryStations.filter(station => station.isAlbum)
            else if (this.filterBy === 'playlists') this.libraryStations = this.libraryStations.filter(station => !station.isAlbum)
            else if (this.filterBy) this.libraryStations = this.libraryStations.filter((station) => station.owner.fullname === this.filterBy)

            this.sortedBy = sortBy
        },
        collapseSidebar() {
            this.$store.commit('setSidebarCollapsed', true)
            this.setLibraryView('list')
        },
        searchLibrary() {
            this.$store.dispatch({ type: 'searchLibrary', query: this.query })
        },
        toggleSortMenu() {
            this.sortMenuOpen = !this.sortMenuOpen
        },
        toggleSearch() {
            if (this.query) return
            this.searchOpen = !this.searchOpen
            if (this.searchOpen) this.$nextTick(() => this.$refs.searchInput.focus())
        },
        setLibraryView(view) {
            this.$store.commit('setLibraryView', view)
        },
        setFilterBy(f) {
            if (f === 'albums') return this.filterBy = this.filterBy === 'albums' ? '' : 'albums'
            this.filterBy = (this.filterBy === f) ? 'playlists' : f
        },

    },

    computed: {
        sidebarCollapsed() {
            return this.$store.getters.sidebarCollapsed
        },
        libraryView() {
            return this.$store.getters.libraryView
        },
        sidebarWidth() {
            if (this.sidebarCollapsed) return 'auto'
        },
        user() {
            return this.$store.getters.loggedinUser
        },
        stationsState() {
            return this.$store.getters.libraryStations
        },
        albumsBtn() {
            return !(this.filterBy === 'Tuneify' || this.filterBy === 'playlists' || this.filterBy === this.user?.fullname)
        },
        byTuneifyBtn() {
            return this.filterBy === 'Tuneify' || this.filterBy === 'playlists'
        },
        byYouBtn() {
            return this.filterBy === 'playlists' || this.filterBy === this.user.fullname
        },
        playlistsBtn() {
            return this.filterBy !== 'albums'
        },

    },
    watch: {
        query: function () {
            this.filterSortLibrary()
        },
        filterBy: function () {
            this.filterSortLibrary()
        },
    },

    components: { LibraryStationList }
}
</script>