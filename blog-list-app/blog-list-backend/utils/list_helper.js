const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const numberOfLikes = blogs.reduce((count, blog) => {
		return count + blog.likes
	}, 0)
	return numberOfLikes
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return null
	}

	const favorite = blogs.reduce((current, next) => {
		return next.likes > current.likes ? next : current
	})

	return favorite
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) { return null }

	const countBlogs = 
        blogs.reduce((blog, {author}) => { 
            blog[author] = blog[author] || 0
            blog[author] += 1
        	return blog
        }, {})

	const [author, count] = Object.entries(countBlogs).reduce((current, next) => current[1] > next[1] ? current : next)
	return { author: author, blogs: count}
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return null
	}

	const countLikes = 
        blogs.reduce((blog, {author, likes}) => {
        	blog[author] = (blog[author] || 0) + likes
        	return blog
        }, {})

	const [author, likes] = Object.entries(countLikes).reduce((current, next) => current[1] > next[1] ? current : next)
	return { author: author, likes: likes}
}
  
module.exports = {
	dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}