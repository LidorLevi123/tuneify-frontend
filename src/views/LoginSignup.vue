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
          <input type="text" v-model="signupCred.fullname" placeholder="Your full name" />
          <input type="text" v-model="signupCred.username" placeholder="Username" />
          <input type="password" v-model="signupCred.password" placeholder="Password" />
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
      msg: '',
      loginCred: { username: '', password: '' },
      signupCred: { username: '', password: '', fullname: '' },
    }
  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username) {
        this.msg = 'Please enter username/password'
        return
      }
      try {
        const user = await this.$store.dispatch({ type: "login", userCred: this.loginCred })
        await this.$store.dispatch({ type: 'loadUserStations', userId: user._id })
        this.$router.push('/')
      } catch (err) {
        console.log(err.message)
        this.msg = 'Failed to login'
      }
    },
    doLogout() {
      this.$store.dispatch({ type: 'logout' })
    },
    async doSignup() {
      if (!this.signupCred.fullname || !this.signupCred.password || !this.signupCred.username) {
        this.msg = 'Please fill up the form'
        return
      }
      const user = await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
      await this.$store.dispatch({ type: 'loadUserStations', userId: user._id })
      this.$router.push('/')
    }
  },
  watch: {
    msg() {
      showErrorMsg(this.msg)
    }
  }
}
</script>