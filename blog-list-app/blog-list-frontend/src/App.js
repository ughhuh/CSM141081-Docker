import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogsVisible, setBlogsVisible] = useState(false)

  //const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [notificationMessage, setnotificationMessage] = useState(null)
  const [statusCode, setStatusCode] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      if (blogService.setToken) {
        blogService.setToken(user.token)
      } else {
        console.error('blogService.setToken is not defined')
      }
    }
  }, [])

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setStatusCode(0)
        setnotificationMessage(
          `A new blog "${newTitle}" by ${newAuthor} was added!`
        )
        setTimeout(() => {
          setnotificationMessage(null)
          setStatusCode(null)
        }, 5000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setBlogsVisible(false)
  
        // Fetch all blogs again to update the list
        blogService.getAll().then(updatedBlogs => {
          setBlogs(updatedBlogs)
        })
      })
      .catch(error => {
        setStatusCode(1)
        setnotificationMessage(
          `Error: ${error}`
        )
        setTimeout(() => {
          setnotificationMessage(null)
          setStatusCode(null)
        }, 5000)
      })
  }

  const likeBlog = (id, updatedLikes) => {
    const blog = { ...blogs.find((blog) => blog.id === id), likes: updatedLikes }
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    blogService
      .update(id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs((blogs) =>
          blogs.map((blog) => (blog.id === id ? returnedBlog : blog))
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const deleteBlog = (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      const id = blog.id
      blogService
        .deleteEntry(id, user.token)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== id))
        })
        .catch((error) => {
          console.log('Error occurred while deleting a blog', error)
        })
    }
  }

  const blogForm = () => {
    return (
      <Togglable buttonOpen='new blog' buttonClose='cancel'>
        <BlogForm
          createBlog={addBlog}
        />
      </Togglable>
    )
  }

  const blogInfo = () => {
    blogs.sort((a, b) => b.likes - a.likes)
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} user={user} blog={blog} updateBlog={likeBlog} deleteBlog={deleteBlog}/>
        )}
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
      if (blogService.setToken) {
        blogService.setToken(user.token)
      } else {
        console.error('blogService.setToken is not defined')
      }
    } catch (error) {
      setStatusCode(1)
      setnotificationMessage('Wrong username or password!')
      setTimeout(() => {
        setnotificationMessage(null)
        setStatusCode(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')

    setUser(null)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
        username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
        password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  const blogList = (user) => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button id='logout-button' onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogInfo()}
    </div>
  )

  return (
    <div>
      <Notification message={notificationMessage} statusCode={statusCode} />
      {user === null ? loginForm() : blogList(user) }
    </div>
  )
}

export default App