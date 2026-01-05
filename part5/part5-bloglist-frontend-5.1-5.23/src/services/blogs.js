// 5.1: Blog List Frontend, step 1
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async() => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch {
    return []
  }
}

// 5.3: Blog List Frontend, step 3
const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.post(baseUrl, newBlog, config)
    return response.data
  } catch (error) {
    console.error('Create blog failed:', error)
    throw error
  }
}

// 5.8: Blog List Frontend, step 8
const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

//
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, remove }