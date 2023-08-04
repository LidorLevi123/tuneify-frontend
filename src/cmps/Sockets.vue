<template>
    <div>
        <ul>
            <li v-for="message in messages" :key="message.id">{{ message }}</li>
        </ul>
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message...">
        <button @click="sendMessage">Send</button>
    </div>
</template>

<script>
import io from 'socket.io-client'

export default {
    data() {
        return {
            messages: [],
            newMessage: '',
        }
    },
    mounted() {
        // Connect to the server
        this.socket = io('http://localhost:3000')

        // Listen for incoming messages from the server
        this.socket.on('message', (data) => {
            this.messages.push(data)
        })
    },
    methods: {
        sendMessage() {
            // Send a message to the server
            this.socket.emit('message', this.newMessage)

            // Clear the input field
            this.newMessage = ''
        },
    },
}
</script>
