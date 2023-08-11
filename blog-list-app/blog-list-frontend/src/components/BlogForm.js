import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
          title:{' '}
        <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} placeholder='Write blog title here'/>
        <br />
          author:{' '}
        <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} placeholder='Write blog author here'/>
        <br />
          url:{' '}
        <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} placeholder='Write blog URL here'/>
        <br />
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm