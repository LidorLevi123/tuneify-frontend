<template>
    <ul class="df ai" v-if="users">
        <li v-for="user in users" :key="user._id">
            <UserPreview :user="user" />
        </li>
    </ul>
</template>

<script>
import UserPreview from './UserPreview.vue'

export default {
    name: 'UserList',
    props: {
        users: { type: Array, required: true },
    },

    components: {
        UserPreview,
    },
}
</script>

