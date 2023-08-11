import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author without URL or number of likes by default', () => {
  const blog = {
    id: 1,
    title: 'Example Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
    user: {
      name: 'John Doe',
    },
  }

  const mockHandler = jest.fn()
  const { container } = render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={mockHandler}/>)

  const titleElement = container.querySelector('.blogTitle')
  expect(titleElement).toHaveTextContent('Example Blog')

  const authorElement = container.querySelector('.blogAuthor')
  expect(authorElement).toHaveTextContent('John Doe')

  const viewButton = screen.getByText('view')
  expect(viewButton).toBeDefined()

  const togglable = container.querySelector('.showWhenVisible')
  expect(togglable).toHaveStyle('display: none')

  const nullURL = screen.queryByText('https://example.com')
  expect(nullURL).toBeNull()

  const nullLikes = screen.queryByText('likes: 10')
  expect(nullLikes).toBeNull()
})

test('blog URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {
  const blog = {
    id: 1,
    title: 'Example Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
    user: {
      name: 'John Doe',
    },
  }

  const mockHandler = jest.fn()

  const { container } = render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const togglable = container.querySelector('.hideWhenVisible')
  expect(togglable).toHaveStyle('display: none')

  const urlElement = screen.queryByText('https://example.com')
  expect(urlElement).toBeDefined()

  const likesElement = screen.queryByText('likes: 10')
  expect(likesElement).toBeDefined()
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    id: 1,
    title: 'Example Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 10,
    user: {
      name: 'John Doe',
    },
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} deleteBlog={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})