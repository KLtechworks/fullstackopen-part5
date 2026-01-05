// 5.13: Blog List Tests, step 1
import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'  
// 5.14: Blog List Tests, step 2
import userEvent from '@testing-library/user-event'

// 5.13: Blog List Tests, step 1
test('renders title and author by default, but not url or likes', () => {
  const blog = {
    title: 'Clean Code: The Good',
    author: 'Daniel Gerlach',
    url: 'https:/cleancode-react.com',
    likes: 5,
    user: { name: 'Mat' }  
  }

  render(<Blog blog={blog} />)
  
  const defaultElement = screen.getByText('Clean Code: The Good Daniel Gerlach')
  expect(defaultElement).toBeDefined()

  const urlElement = screen.queryByText('https://cleancode-react.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 5')
  expect(likesElement).toBeNull()

})

// 5.14: Blog List Tests, step 2
test('url and likes are shown when the view button is clicked', async () => {
  const blog = {
    title: 'Clean Code: The Good',
    author: 'Daniel Gerlach',
    url: 'https://cleancode-react.com',
    likes: 5,
    user: { name: 'Mat' }
  }

  const mockHandleLike = vi.fn()
  const mockHandleRemove = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandleLike} handleRemove={mockHandleRemove} />)

  const viewButton = screen.getByText('view')

  const user = userEvent.setup()
  await user.click(viewButton)

  const urlElement = screen.getByText('https://cleancode-react.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.getByText('likes 5')
  expect(likesElement).toBeDefined()
})

// 5.15: Blog List Tests, step 3
test('like button clicked twice calls handleLike twice', async () => {
  const blog = {
    title: 'Clean Code: The Good',
    author: 'Daniel Gerlach',
    url: 'https://cleancode-react.com',
    likes: 5,
    user: { name: 'Mat' }
  }

  const mockHandleLike = vi.fn()   
  const mockHandleRemove = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandleLike} handleRemove={mockHandleRemove} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandleLike).toHaveBeenCalledTimes(2)
})