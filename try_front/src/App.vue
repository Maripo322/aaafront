<template>
  <div id="app">
    <div class="status-bar">
      <span :class="{'connected': isConnected, 'disconnected': !isConnected}">
        {{ isConnected ? '🟢 Бэкенд подключен' : '🔴 Нет подключения к API' }}
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isConnected: false
    }
  },
  async mounted() {
    try {
      const res = await axios.get('/')
      this.isConnected = res.status === 200
    } catch (error) {
      this.isConnected = false
      console.error('Ошибка подключения к API:', error)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 20px;
  color: #2c3e50;
  min-height: 100vh;
}

.status-bar {
  margin-bottom: 12px;
  font-weight: bold;
}

.connected {
  color: green;
}

.disconnected {
  color: red;
}
</style>
