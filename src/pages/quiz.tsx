import { navigate } from 'gatsby-link'
import * as React from 'react'
import Footer from '../components/footer'
import Header from '../components/header'
import Question from '../components/question'
import { IQuestion } from '../models/quiz'
import authService from '../services/authService'
import quizService from '../services/quizService'

const Quiz = () => {
  if (!authService.loggedInUser) {
    navigate('/?redirect=quiz')
    return null
  }
  const [loading, setLoading] = React.useState(false)
  const [quizStarted, setQuizStarted] = React.useState(false)
  const [questionIndex, setQuestionIndex] = React.useState(0)
  const [quizAnswers, setQuizAnswers] = React.useState<IQuestion[]>([])
  React.useEffect(() => {
    if (!quizService.currentQuiz) {
      loadQuiz()
    }
  }, [])
  async function loadQuiz() {
    setLoading(true)
    try {
      await quizService.loadQuiz()
    } catch (e) {
      console.error(e)
      console.error('loadQuiz failed')
    }
    setLoading(false)
  }
  const answerQuestion = (a: IQuestion) => {
    if (quizService.answered) {
      return
    }
    const answers = [...quizAnswers]
    answers.push(a)
    const nextQuestion = questionIndex + 1
    if (quizService.currentQuiz.questions[nextQuestion]) {
      setQuizAnswers(answers)
      setQuestionIndex(questionIndex + 1)
    } else {
      submitQuiz(answers)
    }
  }
  async function submitQuiz(answers: IQuestion[]) {
    if (quizService.answered) {
      return
    }
    setLoading(true)
    try {
      await quizService.submitQuiz(answers)
      setQuestionIndex(0)
      setQuizAnswers([])
    } catch (e) {
      console.error(e)
      console.error('submitQuiz failed')
    }
    setLoading(false)
  }
  let imgClass = 'profileImg imgFull'
  if (loading) imgClass += ' imageRotate'
  const currentQuestion = quizService.currentQuiz?.questions && quizService.currentQuiz.questions[questionIndex]
  const usersAnswers = quizService.answered &&
    quizService.currentQuiz?.responses.find(r => r.spotifyId == authService.loggedInUser?.spotifyId)
  const currentResponse = usersAnswers?.answers && usersAnswers?.answers[questionIndex]
  return (
    <>
      <Header />
      <main className="container">
        <section>
          { (!quizStarted || loading) &&
            <img className={imgClass} style={{margin: '0 auto'}} src="/static/question-circle-solid.svg" alt="question mark icon" />
          }
          { !quizStarted &&
            <div className="quizInfo">
              <h1>JAF Spotify "Unwrapped"</h1>
              <br />
              { !loading && !quizService.answered &&
                <>
                  <p>How well do you know your mates?</p>
                  <br/>
                  <p>This quiz is a series of multi-choice questions.</p>
                  <p>You will be presented with a track, this track is one of your friends top 10 tracks. You must correctly guess who's top tracks the song has come from.</p>
                </>
              }
              { !loading && quizService.answered &&
                <>
                  <p>You have answered the current quiz.</p>
                  <p>Click the review button to see how you did.</p>
                </>
              }
              { !loading &&
                <button onClick={e => setQuizStarted(true)} className="startQuiz">
                  {quizService.answered ? "Review" : "Get Started"}
                </button>
              }
            </div>
          }
          { !loading && quizStarted && currentQuestion &&
            <>
              <p className="questionIndex">{questionIndex + 1} / {quizService.currentQuiz.questions.length}</p>
              <Question question={currentQuestion} answer={answerQuestion} response={currentResponse} />
            </>
          }
          { !loading && quizStarted && quizService.currentQuiz && quizService.answered && usersAnswers &&
            <div className="quizReview">
              <div className="reviewNav">
                <button className="reviewNavBtn"
                  disabled={!quizService.currentQuiz.questions[questionIndex - 1]}
                  onClick={e => setQuestionIndex(questionIndex - 1)}>prev</button>
                <button className="reviewNavBtn"
                  disabled={!quizService.currentQuiz.questions[questionIndex + 1]}
                  onClick={e => setQuestionIndex(questionIndex + 1)}>next</button>
              </div>
            </div>
          }
          { !loading && quizService.answered && usersAnswers &&
            <div className="score">
              <p>Your score:</p>
              <p>{usersAnswers.score} / {quizService.currentQuiz.questions.length}</p>
            </div>
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Quiz