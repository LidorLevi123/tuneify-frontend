<template>
	<section :class="msg.type" v-if="msg.txt" class="user-msg">
		{{ msg.txt }}
	</section>
</template>
 
<script>
import { eventBus } from '../services/event-bus.service.js'

export default {
	data() {
		return {
			msg: { txt: '', type: 'success' },
		}
	},
	created() {
		eventBus.on('show-msg', this.showMsg)
	},
	methods: {
		showMsg(msg) {
			this.msg = msg
			setTimeout(() => (this.msg.txt = ''), this.msg.timeout || 5000)
		},
	},
}
</script>
















