import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
// 5.4: Blog List Frontend, step 4
import Notification from './components/Notification'
// 5.5 Blog List Frontend, step 5
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useRef } from 'react'

const App = () => {
  // 5.1: Blog List Frontend, step 1
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // 5.3: Blog List Frontend, step 3
  // const [newTitle, setNewTitle] = useState('')
  // const [newAuthor, setNewAuthor] = useState('')
  // const [newUrl, setNewUrl] = useState('')

  // 5.4: Blog List Frontend, step 4
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('')
  // 5.5 Blog List Frontend, step 5
  const togglableRef = useRef()

  // 5.1: Blog List Frontend, step 1
  // useEffect(() => {
  //   if (user) {
  //     blogService.getAll().then(blogs => {
  //       setBlogs(blogs)
  //     })
  //   }
  // }, [user])

  // 5.2: Blog List Frontend, step 2
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      // blogService.getAll().then(blogs => setBlogs(blogs))
      blogService.getAll().then(blogs =>
        setBlogs(blogs.sort((a, b) => b.likes - a.likes))
      )
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      console.log('Login success, user:', user)

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      // 5.2: Blog List Frontend, step 2
      localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      // const blogs = await blogService.getAll()
      // setBlogs(blogs)

      // 5.10: Blog List Frontend, step 10
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      console.log('Login failed:', exception)
      // 5.4: Blog List Frontend, step 4
      showNotification('wrong username or password', 'error')
    }
  }
  // 5.2: Blog List Frontend, step 2
  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  // 5.3: Blog List Frontend, step 3
  // const handleCreate = async (event) => {
  //   event.preventDefault()

  //   const newBlog = {
  //     title: newTitle,
  //     author: newAuthor,
  //     url: newUrl
  //   }

  //   try {
  //     const createdBlog = await blogService.create(newBlog)
  //     setBlogs(blogs.concat(createdBlog))
  //     setNewTitle('')
  //     setNewAuthor('')
  //     setNewUrl('')
  //     // 5.4: Blog List Frontend, step 4
  //     showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
  //   } catch (error) {
  //     // 5.4: Blog List Frontend, step 4
  //     showNotification('Failed to add blog', 'error')
  //   }
  // }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      {/* 5.4: Blog List Frontend, step 4 */}
      <Notification message={notification} type={notificationType} />
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
  // 5.4: Blog List Frontend, step 4
  const showNotification = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
      setNotificationType('')
    }, 5000)
  }

  const handleLike = async (blogToLike) => {
    // const updatedBlog = {
    //   ...blogToLike,
    //   likes: blogToLike.likes + 1
    // }
    const updatedBlog = {
      title: blogToLike.title,
      author: blogToLike.author,
      url: blogToLike.url,
      likes: blogToLike.likes + 1,
      user: blogToLike.user._id
    }

    try {
      const returnedBlog = await blogService.update(blogToLike.id, updatedBlog)
      // 5.10: Blog List Frontend, step 10
      const updatedBlogs = blogs.map(blog =>
        blog.id === returnedBlog.id ? returnedBlog : blog
      )
      setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
      showNotification(`You liked "${returnedBlog.title}"`)
    } catch {
      showNotification('Failed to like blog', 'error')
    }
  }

  // 5.11: Blog List Frontend, step 11
  const handleRemove = async (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}?`)) {
      try {
        await blogService.remove(blogToRemove.id)

        setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))

        showNotification(`Blog "${blogToRemove.title}" removed`)
      } catch  {
        showNotification('Failed to remove blog', 'error')
      }
    }
  }

  if (user === null) {
    return (
      <div>
        {loginForm()}
      </div>
    )
  }
  // 5.2: Blog List Frontend, step 2, added logout <button>
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}> logout </button></p>

        <Togglable buttonLabel="create new blog" ref={togglableRef}>
          <BlogForm
            createBlog={async (newBlog) => {
              try {
                const createdBlog = await blogService.create(newBlog)
                // 5.10: Blog List Frontend, step 10
                // setBlogs(blogs.concat(createdBlog))
                setBlogs([...blogs, createdBlog].sort((a, b) => b.likes - a.likes))
                showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
                togglableRef.current.toggleVisibility()
              } catch  {
                showNotification('Failed to add blog', 'error')
              }
            }}
          />
        </Togglable>

        {/* 5.3: Blog List Frontend, step 3 */}
        {/* <div>
              <h2>create new</h2>
              <form onSubmit={handleCreate}>
                <div>
                  title:
                  <input
                    type="text"
                    value={newTitle}
                    onChange={({ target }) => setNewTitle(target.value)}
                  />
                </div>
                <div>
                  author:
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={({ target }) => setNewAuthor(target.value)}
                  />
                </div>
                <div>
                  url:
                  <input
                    type="text"
                    value={newUrl}
                    onChange={({ target }) => setNewUrl(target.value)}
                  />
                </div>
                <button type="submit">create</button>
              </form>
            </div>*/}

        {/* // 5.10: Blog List Frontend, step 10 & // 5.11: Blog List Frontend, step 11 handle remove */}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user} />
        )}
      </div>
    </div>
  )
}

export default App