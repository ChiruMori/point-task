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

// export type TaskFrequency = 'once' | 'daily' | 'workday' | 'weekend' | 'endless'
export type TaskStatus = 'editing' | 'active' | 'ended'
export type TaskType = 'normal' | 'reward' | 'punish'
export type RecordStatus = 'completed' | 'failed'

export interface Task {
  id: number
  title: string
  desc: string
  // 任务周期逻辑过于复杂，暂时去掉，所有任务均视为 endless，人工处理
  // freq: TaskFrequency
  status: TaskStatus
  createdBy: number // User ID
  type: TaskType
  // 业务复杂时，需添加被分派者字段
  rewardId: number // Reward ID
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
  score: number // 任务完成时的评分
  pointsAwarded: number // 实际奖励的积分
  ratio: number // 任务完成时的附加修正比例
  remark: string // 任务完成时的备注
  status: RecordStatus
  createTime: Date // 视为完成时间
  updateTime: Date
}
