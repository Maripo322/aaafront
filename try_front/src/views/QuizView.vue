<template>
  <div>
    <h1>Вопрос дня</h1>

    <!-- Ошибка формата ответа -->
    <div v-if="loadError">
      <p style="color: red;">Ошибка загрузки вопроса: {{ loadError }}</p>
    </div>

    <!-- Когда вопрос загружен -->
    <div v-else-if="word">
      <p><strong>Английское слово:</strong> {{ word.word_eng }}</p>
      <p><strong>Повторение:</strong> {{ word.was_in_repeat ? 'Да' : 'Нет' }}</p>

      <div class="options">
        <button
          v-for="opt in options"
          :key="opt.word_id"
          :disabled="answered"
          @click="submitAnswer(opt)"
        >
          {{ opt.word_rus }}
        </button>
      </div>

      <p v-if="answered">
        <strong>{{ feedback }}</strong>
      </p>
    </div>

    <!-- Пока грузится -->
    <div v-else>
      <p>Загрузка...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      word: null,
      options: [],
      tg_id: null,
      answered: false,
      feedback: '',
      loadError: ''
    }
  },
  async mounted() {
    this.tg_id = localStorage.getItem('tg_id')
    if (!this.tg_id) {
      console.error('tg_id не найден')
      this.loadError = 'tg_id отсутствует'
      return
    }
    this.loadQuiz()
  },
  methods: {
    async loadQuiz() {
      this.answered = false
      this.feedback = ''
      this.loadError = ''
      try {
        const response = await axios.get(`/api/quiz/${this.tg_id}`)
        console.log('Ответ /api/quiz:', response.data)
        // Если пришёл ожидаемый формат
        if (response.data.word && Array.isArray(response.data.options)) {
          this.word = response.data.word
          this.options = response.data.options
        } else {
          // Плохо: бэкенд вернул не то
          this.loadError = 'Неправильный формат ответа от API'
          console.error('Неправильный формат ответа:', response.data)
        }
      } catch (error) {
        console.error('Ошибка при получении задания:', error)
        this.loadError = 'Сетевая ошибка или сервер недоступен'
      }
    },

    async submitAnswer(opt) {
      this.answered = true
      const isCorrect = opt.word_id === this.word.word_id
      this.feedback = isCorrect
        ? 'Правильно! 🎉'
        : `Неправильно 😕. Правильный ответ: ${this.word.word_rus}`

      try {
        await axios.post('/api/answer', {
          tg_id: this.tg_id,
          word_id: this.word.word_id,
          was_in_repeat: this.word.was_in_repeat,
          is_correct: isCorrect
        })
      } catch (error) {
        console.error('Ошибка отправки ответа:', error)
      }

      setTimeout(this.loadQuiz, 2000)
    }
  }
}
</script>

<style scoped>
.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.options button {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.options button:disabled {
  opacity: 0.6;
  cursor: default;
}
</style>
