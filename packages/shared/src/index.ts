export type UserRole = 'admin' | 'normal'

export interface User {
  id: number
  uname: string
  role: UserRole
  point: number
  // pwd: string; // 密码不在这里暴露
}
