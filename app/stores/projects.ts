import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProjectGroups, createProjectGroup, type ProjectGroup } from '~/utils/api'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<ProjectGroup[]>([])
  const isLoading = ref(false)

  const fetchProjects = async () => {
    isLoading.value = true
    try {
      const res: any = await getProjectGroups()
      projects.value = res.data.list || []
    } catch (error) {
      console.error('Fetch projects failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async (params: { name: string, description?: string, color?: string }) => {
    isLoading.value = true
    try {
      const res: any = await createProjectGroup(params)
      if (res.data?.id) {
        await fetchProjects() // Refresh list
        return res.data
      }
    } catch (error) {
      console.error('Create project failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProject = async (id: number, params: Partial<ProjectGroup>) => {
    isLoading.value = true
    try {
      await updateProjectGroup({ id, ...params })
      await fetchProjects()
    } catch (error) {
      console.error('Update project failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteProject = async (id: number) => {
    isLoading.value = true
    try {
      await deleteProjectGroup(id)
      await fetchProjects()
    } catch (error) {
      console.error('Delete project failed:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    isLoading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }
})
