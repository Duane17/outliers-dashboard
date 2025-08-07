export interface Dataset {
  id: string
  name: string
  owner: string
  size: number
  tags: string[]
  columns: Column[]
  smpcReady: boolean
  shared: boolean
}

export interface Column {
  name: string
  type: "string" | "number" | "date" | "boolean"
  nullable: boolean
}

export interface ComputationConfig {
  title: string
  description: string
  selectedDatasets: string[]
  computationType: string
  selectedColumns: string[]
  filters: string[]
  groupBy: string[]
  privacyLevel: "strict" | "balanced" | "fast"
}

export interface ComputationResult {
  summary: {
    recordCount: number
    computedValue: number | string
    executionTime: number
  }
  data: Record<string, any>[]
  charts?: {
    type: string
    title: string
    data: any[]
  }[]
}

export interface Computation {
  id: string
  title: string
  description: string
  status: "queued" | "running" | "completed" | "failed"
  config: ComputationConfig
  createdAt: Date
  completedAt?: Date
  progress?: number
  error?: string
  results?: ComputationResult
}
