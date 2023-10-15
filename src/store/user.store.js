// import { userService } from '../services/user.service.local'
import { userService } from '../services/user.service'

export const userStore = {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: [],
        isLoading: false
    },
    getters: {
        users({ users }) { return users },
        loggedinUser({ loggedinUser }) { return loggedinUser },
        usersExcludeMe({ users, loggedinUser }) {
            return users.filter(u => u._id !== loggedinUser._id)
        },
        usersIsLoading({ isLoading }) {
            return isLoading
        }
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            state.loggedinUser = (user) ? { ...user } : null
        },
        setUsers(state, { users }) {
            state.users = users
        },
        setUser(state, { user }) {
            const idx = state.users.findIndex(u => u._id === user._id)
            state.users.splice(idx, 1, user)
        },
        setIsLoading(state, { isLoading }) {
            state.isLoading = isLoading
        },
        removeUser(state, { userId }) {
            state.users = state.users.filter(user => user._id !== userId)
        },
    },
    actions: {
        async login({ commit }, { userCred }) {
            try {
                const user = await userService.login(userCred)
                commit({ type: 'setLoggedinUser', user })
                return user
            } catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async signup({ commit }, { userCred }) {
            try {
                const user = await userService.signup(userCred)
                if (!user) return
                commit({ type: 'setLoggedinUser', user })
                return user
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }
        },
        async logout({ commit }) {
            try {
                await userService.logout()
                commit({ type: 'setLoggedinUser', user: null })
            } catch (err) {
                console.log('userStore: Error in logout', err)
                throw err
            }
        },
        async loadUsers({ commit }) {
            commit({ type: 'setIsLoading', isLoading: true })
            try {
                const users = await userService.getUsers()
                commit({ type: 'setUsers', users })
                commit({ type: 'setIsLoading', isLoading: false })
            } catch (err) {
                console.log('userStore: Error in loadUsers', err)
                throw err
            }
        },
        async removeUser({ commit }, { userId }) {
            try {
                await userService.remove(userId)
                commit({ type: 'removeUser', userId })
            } catch (err) {
                console.log('userStore: Error in removeUser', err)
                throw err
            }
        },
        async updateUser({ commit, state }, { user }) {
            try {
                user = await userService.update(user)
                commit({ type: 'setUser', user })
                if (state.loggedinUser._id === user._id) {
                    commit({ type: 'setLoggedinUser', user })
                }
            } catch (err) {
                console.log('userStore: Error in updateUser', err)
                throw err
            }
        },
        async updateUserStations({ commit, state }, { stationId, action }) {
            const id = state.loggedinUser.stationIds.find(id => id === stationId)
            if (id) return
            try {
                const user = await userService.updateUserStations(state.loggedinUser, stationId, action)
                commit({ type: 'setUser', user })
                commit({ type: 'setLoggedinUser', user })
            } catch (err) {
                console.log('userStore: Error in updateUserStations', err)
                throw err
            }
        },
    }
}