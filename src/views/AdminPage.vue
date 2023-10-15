<template>
    <section class="admin-page">
        <div class="admin-page-header">
            <h1>Admin Page</h1>
            <RouterLink to="/">
                <button class="back-btn">back to app</button>
            </RouterLink>
        </div>
        <div class="user-list">
            <div v-for="user in users" :key="user._id" class="user-item">
                <div class="user-info">
                    <img @click="showUserDetails(user)" :src="user.imgUrl" alt="">
                    <div class="user-name">{{ user.fullname }}</div>
                    <button @click="removeUser(user._id)" class="remove-btn">Remove</button>
                </div>
            </div>
        </div>
        <pre>{{ user }}</pre>
    </section>
</template>

<script>
export default {
    name: 'AdminPage',
    data() {
        return {
            user: null
        }
    },
    created() {
        this.$store.dispatch({ type: 'loadUsers' })
    },
    methods: {
        removeUser(userId) {
            if (confirm('Are you sure?')) this.$store.dispatch({ type: 'removeUser', userId })
        },
        showUserDetails(user) {
            this.user = user
        }
    },
    computed: {
        users() {
            return this.$store.getters.users
        }
    }
}
</script>
