<template>
  <div>
    <h1>Статистика</h1>
    <p>Изучено слов: {{ stats.learnedCount }}</p>
    <p>В повторении: {{ stats.repeatCount }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      stats: {
        learnedCount: 0,
        repeatCount: 0
      },
      tg_id: null
    }
  },
  async mounted() {
    this.tg_id = localStorage.getItem('tg_id')
    if (!this.tg_id) {
      console.error('tg_id не найден')
      return
    }

    try {
      const response = await axios.get(`/api/stats/${this.tg_id}`)
      this.stats = response.data
    } catch (error) {
      console.error('Ошибка при загрузке статистики:', error)
    }
  }
}
</script>
