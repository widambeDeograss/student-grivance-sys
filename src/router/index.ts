import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import Anomnimus from '@/views/Pages/Anomnimus.vue'
import AnomnimusLogin from '@/views/Pages/AnomnymusLogin.vue'
import GrivanceSubmission from '@/views/Pages/GrivanceSubmission.vue'
import UserSubmittingForm from '@/views/Pages/UserSubmittingForm.vue'
import { useAuthStore  } from '@/stores/authStore'
import Users from '@/views/Dashboard/Users.vue'
import DivisionGrivances from '@/views/Dashboard/DivisionGrivances.vue'
import ProblemTypes from '@/views/Dashboard/ProblemTypes.vue'
import AllDivisions from '@/views/Dashboard/AllDivisions.vue'
import AddDivision from '@/views/Dashboard/AddDivision.vue'
import GrivanceDetails from '../views/Dashboard/GrivanceDetails.vue'
import GrivanceDetailUser from '@/views/Pages/GrivanceDetailUser.vue'
import DivisonProblemTypes from '@/views/Dashboard/DivisonProblemTypes.vue'
import Subdivisions from '@/views/Dashboard/Subdivisions.vue'
import SubDivisionGrivances from '@/views/Dashboard/SubDivisionGrivances.vue'
import SubdivisionProblemTypes from '@/views/Dashboard/SubdivisionProblemTypes.vue'
import ProblemTypeStats from '@/views/Dashboard/ProblemTypeStats.vue'
import DivisionStats from '@/views/Dashboard/DivisionStats.vue'

const routes = [
  {
    path: '/',
    name: 'anomnimus',
    component: Anomnimus,
    meta: {
      title: 'Anomnimus Submission'
    }
  },
  {
    path: '/anomnimus/login',
    name: 'AnomnimusLogin',
    component: AnomnimusLogin,
    meta: {
      title: 'Login Submission'
    }
  },
  {
    path: '/grivances',
    name: 'userGrivances',
    component: GrivanceSubmission,
    meta: {
      title: 'User grivances',
      requiresAuth:true
    }
  },
  {
    path: '/grivances/grivance/:id',
    name: 'GrivanceDetailUser',
    component: GrivanceDetailUser,
    meta: {
      title: 'GrivanceDetailUser',
      requiresAuth:true
    }
  },
  {
    path: '/grivances/submission',
    name: 'userGrivancesSubmission',
    component: UserSubmittingForm,
    meta: {
      title: 'User grivances submission form',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboad',
    component: ECommerceView,
    meta: {
      title: 'Admin Dashboard',
      requiresAuth:true
    }
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar',
      requiresAuth:true
    }
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    meta: {
      title: 'Users',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/grivances',
    name: 'DivisionGrivances',
    component: DivisionGrivances,
    meta: {
      title: 'DivisionGrivances',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/sub_division_grivances',
    name: 'SubDivisionGrivances',
    component: SubDivisionGrivances,
    meta: {
      title: 'SubDivisionGrivances',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/grivance/:id',
    name: 'GrivanceDetails',
    component: GrivanceDetails,
    meta: {
      title: 'GrivanceDetails',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/problem_type/:id',
    name: 'ProblemTypeDetails',
    component: ProblemTypeStats,
    meta: {
      title: 'ProblemTypeDetails',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/division/:id',
    name: 'DivisionDetails',
    component: DivisionStats,
    meta: {
      title: 'DivisionDetails',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/problem_types',
    name: 'ProblemTypes',
    component: ProblemTypes,
    meta: {
      title: 'ProblemTypes',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/division_problem_types',
    name: 'DivisionProblemTypes',
    component: DivisonProblemTypes,
    meta: {
      title: 'DivisionProblemTypes',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/sub_division_problem_types',
    name: 'SubDivisionProblemTypes',
    component: SubdivisionProblemTypes,
    meta: {
      title: 'SubDivisionProblemTypes',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/all_divisions',
    name: 'allDivisions',
    component: AllDivisions,
    meta: {
      title: 'allDivisions',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/sub_divisions',
    name: 'allSubdivision',
    component: Subdivisions,
    meta: {
      title: 'allSubdivision',
      requiresAuth:true
    }
  },
  {
    path: '/dashboard/add_division',
    name: 'addDivision',
    component: AddDivision,
    meta: {
      title: 'addDivision',
      requiresAuth:true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile',
      requiresAuth:true
    }
  },
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements',
      requiresAuth:true
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout',
      requiresAuth:true
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables',
      requiresAuth:true
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings',
      requiresAuth:true
    }
  },
  {
    path: '/charts/basic-chart',
    name: 'basicChart',
    component: BasicChartView,
    meta: {
      title: 'Basic Chart',
      requiresAuth:true
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts',
      requiresAuth:true
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons',
      requiresAuth:true
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const auth  = useAuthStore();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated) {
      next('/anomnimus/login')
    }else{
      next()
    }
    
  }else{
    next()
  }
  document.title = `Student Grivance ${to.meta.title}`
  next()
})

export default router
