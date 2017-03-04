import Index from './components/Index'
import ProbPage from './components/ProbPage'

export default [
  { path: '/',             component: Index },
  { path: '/problem/:num', component: ProbPage }
]