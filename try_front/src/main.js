import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

axios.defaults.baseURL = 'https://silver-space-disco-g4r4w6j99rg7fwgrw-8000.app.github.dev/' 

// Получаем tg_id один раз и сохраняем
const tg = window.Telegram.WebApp
if (tg.initDataUnsafe?.user?.id) {
  localStorage.setItem('tg_id', tg.initDataUnsafe.user.id)
}

app.use(router)
app.mount('#app')
