import request from '../utils/request'

// Project/Group Types
export interface ProjectGroup {
  id: number
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

export interface CreateProjectParams {
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
}

// Project/Group API
export const getProjectGroups = () => {
  return request.get('/v1/conversations/groups')
}

export const createProjectGroup = (data: CreateProjectParams) => {
  return request.post('/v1/conversations/groups/create', data)
}

export const updateProjectGroup = (data: Partial<ProjectGroup> & { id: number }) => {
  return request.post('/v1/conversations/groups/update', data)
}

export const deleteProjectGroup = (id: number) => {
  return request.post('/v1/conversations/groups/delete', { id })
}
