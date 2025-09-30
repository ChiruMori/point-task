// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memo = new Map<string, any>()

export const dict = {
  login: '/api/user/login',
  getUser: '/api/user/get',
  listUsers: '/api/user/list',
  listTasks: '/api/task/list',
  getTask: '/api/task/get',
  updateTask: '/api/task/update',
  createTask: '/api/task/create',
  pageRecords: '/api/record/page',
  deleteRecord: '/api/record/delete',
  createRecord: '/api/record/create',
  getReward: '/api/reward/get',
  createReward: '/api/reward/create',
  deleteReward: '/api/reward/delete',
  calculateReward: '/api/reward/calculate',
}

// 导航回调函数，由组件层设置
let navigateToLogin: (() => void) | null = null

export const setNavigateCallback = (callback: () => void) => {
  navigateToLogin = callback
}

export const req = async (url: string, options: RequestInit = {}) => {
  const cacheToken = memo.get('token') || ''
  if (!cacheToken) {
    console.warn('No token registered. Please login first.')
    return null
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-auth-token': cacheToken,
    ...options.headers,
  }

  const res = await (await fetch(url, { ...options, headers })).json()

  if (res && res.errno) {
    console.error('API request failed:', res)
    if (res.errno === 401) {
      memo.delete('token')
      console.warn('Token invalid or expired. Please login again.')
      // 清空 localStorage 中的 token
      localStorage.removeItem('token')
      // 调用导航回调
      console.log('Navigating to login...')
      if (navigateToLogin) {
        navigateToLogin()
      }
    }
  }
  return res
}

export const registerToken = (token: string) => {
  memo.set('token', token)
  console.log('Token registered:', token)
}
