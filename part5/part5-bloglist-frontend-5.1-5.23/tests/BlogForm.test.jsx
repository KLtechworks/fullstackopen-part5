// 5.16: Blog List Tests, step 4
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../src/components/BlogForm'  

test('form calls createBlog handler with correct details when submitted', async () => {
  const mockCreateBlog = vi.fn()   

  render(<BlogForm createBlog={mockCreateBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByRole('textbox', { name: 'title:' })
  const authorInput = screen.getByRole('textbox', { name: 'author:' })
  const urlInput = screen.getByRole('textbox', { name: 'url:'})

  await user.type(titleInput, 'Testing 5.16 Blog')
  await user.type(authorInput, 'Davey')
  await user.type(urlInput, 'https://fullstack.com')
 
  const createButton = screen.getByRole('button', { name: 'create' })  

  await user.click(createButton)

  expect(mockCreateBlog).toHaveBeenCalledTimes(1)

  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Testing 5.16 Blog',
    author: 'Davey',
    url: 'https://fullstack.com'
  })
})