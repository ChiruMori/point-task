export type UserRole = 'admin' | 'normal'

export interface User {
  id: number
  uname: string
  role: UserRole
  point: number
  // pwd: string; // 密码不在这里暴露
  createTime: Date
  updateTime: Date
}

export type TaskFrequency = 'once' | 'daily' | 'workday' | 'weekend' | 'endless'
export type TaskStatus = 'editing' | 'active' | 'completed' | 'expired'
// export type TaskType = # 忘记了类型

export interface Task {
  id: number
  title: string
  desc: string
  freq: TaskFrequency
  status: TaskStatus
  createdBy: number // User ID
  // type: TaskType
  rewardId: number // Reward ID
  deadline: Date | null
  createTime: Date
  updateTime: Date
}

export interface Reward {
  id: number
  fx: string // 奖励计算函数代码
  maxInput: number // 奖励计算函数的最大输入值
  minInput: number // 奖励计算函数的最小输入值
  createTime: Date
  updateTime: Date
}

export interface TaskRecord {
  id: number
  taskId: number
  userId: number
  score: number // 任务完成时的评分（1-5）
  pointsAwarded: number // 实际奖励的积分
  createTime: Date // 视为完成时间
  updateTime: Date
}
