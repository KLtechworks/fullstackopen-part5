// 5.9: Blog List Frontend, step 9
import { useState } from 'react'
// 5.8: Blog List Frontend, step 8
// import blogService from "../services/blogs"

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)
  // 5.8: Blog List Frontend, step 8
  // const [currentBlog, setCurrentBlog] = useState(blog)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // 5.8: Blog List Frontend, step 8
  // const handleLike = async () => {
  //   console.log('Before like:', currentBlog)

  //   const updatedBlog = {
  //     title: currentBlog.title,
  //     author: currentBlog.author || '',
  //     url: currentBlog.url || '',
  //     likes: (currentBlog.likes || 0) + 1
  //   }

  //   if (currentBlog.user && currentBlog.user._id) {
  //     updatedBlog.user = currentBlog.user._id
  //   } else if (currentBlog.user && typeof currentBlog.user === 'string') {
  //     updatedBlog.user = currentBlog.user
  //   }

  //   // console.log('Sending to backend:', updatedBlog)

  //   try {
  //     const returnedBlog = await blogService.update(currentBlog.id, updatedBlog)
  //     setCurrentBlog(returnedBlog)
  //   } catch (error) {
  //     console.error('Like failed:', error.response?.data || error.message)
  //   }
  // }

  // 5.10: Blog List Frontend, step 10
  const handleLikeClick = () => {
    handleLike(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showRemoveButton = blog.user && user && blog.user.username === user.username

  return (
    // 5.13: Blog List Tests, step 1, added className
    <div style={blogStyle} >
      <div className="blogBasicInfo">
        {/*  5.10: Blog List Frontend, step 10 */}
        {/* {currentBlog.title} {currentBlog.author} */}
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blogDetails">
          {/* <p>{currentBlog.url}</p> */}
          <p>{blog.url}</p>
          <p>
            {/* likes {currentBlog.likes || 0} */}
            likes {blog.likes || 0}
            <button onClick={handleLikeClick}>like</button>
          </p>
          {/* <p>{currentBlog.user?.name}</p> */}
          <p>{blog.user?.name}</p>

          {showRemoveButton && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog