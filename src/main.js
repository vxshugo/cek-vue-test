import './assets/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Импортируем настроенный роутер

createApp(App).use(router).mount('#app')
