// 提交测验答案云函数
// URL化路径: /submit-quiz
'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  let body = event.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch(e) {}
  }
  const { token, answers } = body || event
  // answers: [{ questionId: 1, userAnswer: 0 }, ...]

  if (!answers || !Array.isArray(answers)) {
    return { code: 400, msg: '请提交答案数据' }
  }

  // 获取用户身份
  let user_id = null
  if (token) {
    try {
      const tokenRes = await db.collection('user_tokens').where({ token }).get()
      if (tokenRes.data.length > 0) user_id = tokenRes.data[0].user_id
    } catch(e) {}
  }

  // 查询所有涉及的题目
  const questionIds = answers.map(a => a.questionId)
  const questionsRes = await db.collection('quiz_questions').where({ _id: db.command.in(questionIds) }).get()
  const questionsMap = {}
  questionsRes.data.forEach(q => { questionsMap[q._id] = q })

  // 如果数据库没数据，使用预设答案
  const PRESET_ANSWERS = {
    1: 0, 2: 1, 3: 2, 4: 1, 5: 0
  }

  let correctCount = 0
  const results = []

  answers.forEach(a => {
    const q = questionsMap[a.questionId]
    const correctAnswer = q ? q.answer : PRESET_ANSWERS[a.questionId]
    const isCorrect = a.userAnswer === correctAnswer
    if (isCorrect) correctCount++

    results.push({
      questionId: a.questionId,
      userAnswer: a.userAnswer,
      correctAnswer,
      isCorrect
    })

    // 记录到数据库
    if (user_id) {
      db.collection('quiz_records').add({
        user_id,
        question_id: a.questionId,
        user_answer: a.userAnswer,
        is_correct: isCorrect,
        answered_at: Date.now()
      }).catch(() => {}) // 静默失败，不影响主流程
    }
  })

  return {
    code: 0,
    data: {
      total: answers.length,
      correct: correctCount,
      score: Math.round((correctCount / answers.length) * 100),
      results
    }
  }
}
