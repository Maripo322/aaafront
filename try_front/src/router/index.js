import { createRouter, createWebHistory } from 'vue-router'
import QuizView from '../views/QuizView.vue'
import StatsView from '../views/StatsView.vue'

const routes = [
  {
    path: '/',
    name: 'quiz',
    component: QuizView
  },
  {
    path: '/stats',
    name: 'stats',
    component: StatsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router