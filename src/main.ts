import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
  const boot = document.getElementById('app-boot')
  if (!boot) return
  boot.classList.add('is-hide')
  window.setTimeout(() => boot.remove(), 320)
})
