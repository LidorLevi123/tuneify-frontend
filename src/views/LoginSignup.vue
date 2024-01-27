<template>
  <div class="login-view">
    <header>
      <section class="login-logo">
        <RouterLink class="df" to="/">
          <img src="/favicon.svg" alt="">
          <h2>Tuneify</h2>
        </RouterLink>
      </section>
    </header>
    <section class="form-container">
      <section class="login-form">

        <h1>Log in to Tuneify</h1>

        <form @submit.prevent="doLogin">
          <span>Username</span>
          <input type="text" v-model="loginCred.username" placeholder="User name">
          <span>Password</span>
          <input type="password" v-model="loginCred.password" placeholder="Password">
          <button class="login-btn">Log In</button>
        </form>
        <form @submit.prevent="doSignup">
          <hr>
          <input ref="fullname" type="text" v-model="signupCred.fullname" placeholder="Your full name" />
          <input ref="username" :style="{ outline: usernameOutline }" type="text" v-model="signupCred.username"
            placeholder="Username" />
          <input ref="password" :style="{ outline: passwordOutline }" type="password" v-model="signupCred.password"
            placeholder="Password" />
          <button class="login-btn">Sign up</button>
        </form>
      </section>
    </section>
  </div>
</template>

<script>
import { showErrorMsg } from '../services/event-bus.service'

export default {
  name: 'login-signup',
  data() {
    return {
      loginCred: { username: '', password: '' },
      signupCred: { username: '', password: '', fullname: '' },
    }
  },
  computed: {
    usernameOutline() {
      const username = this.signupCred.username.length
      if (username && (username < 5 || username > 10)) return '2px solid red'
      else if (username) return '2px solid #1ed760'
    },
    passwordOutline() {
      const password = this.signupCred.password.length
      if (password && (password < 6 || password > 10)) return '2px solid red'
      else if (password) return '2px solid #1ed760'
    }

  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username || !this.loginCred.password) return showErrorMsg('Please enter username/password')

      try {
        const user = await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        await this.$store.dispatch({ type: 'loadUserStations', userId: user._id })
        this.$router.push('/')
      } catch (err) {
        console.log(err.message)
        showErrorMsg('Wrong username or password')
      }
    },
    doLogout() {
      this.$store.dispatch({ type: 'logout' })
    },
    async doSignup() {
      const { fullname, password, username } = this.signupCred

      if (!fullname || !password || !username) return showErrorMsg('Please fill up the form')

      if (username.length < 5 || username.length > 10) {
        this.$refs.username.focus()
        return showErrorMsg('Username must be between 5 and 10 characters')
      }

      if (password.length < 6 || password.length > 10) {
        this.$refs.password.focus()
        return showErrorMsg('Password must be between 6 and 10 characters')
      }

      const user = await this.$store.dispatch('signup', { userCred: this.signupCred })
      await this.$store.dispatch('loadUserStations', { userId: user._id })
      this.$router.push('/')
    }
  }
}
</script>