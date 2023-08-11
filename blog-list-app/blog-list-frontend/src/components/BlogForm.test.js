import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Write blog title here')
  const authorInput = screen.getByPlaceholderText('Write blog author here')
  const urlInput = screen.getByPlaceholderText('Write blog URL here')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Example Blog')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Example Blog')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('https://example.com')
})