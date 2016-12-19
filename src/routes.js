import Index from './components/Index'
import ProbPage from './components/ProbPage'

module.exports = [
  { path: '/',             component: Index },
  { path: '/problem/:num', component: ProbPage }
]