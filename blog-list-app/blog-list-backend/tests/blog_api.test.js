const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require("../models/blog")
const jwt = require("jsonwebtoken")
const api = supertest(app)

describe("creation of a blog", () => {
	let decodedToken
	let validToken
	beforeEach(async () => {
		const login = { "username": "root", "password": "sekret" }
		
		const loginResponse = await api.post("/api/login").send(login)
		// console.log(loginResponse)
		validToken = loginResponse.body.token.toString()
		decodedToken = jwt.verify(validToken, process.env.SECRET)
		// const user = await User.findById(decodedToken.id)
	})

	test("correct amount of blog posts are returned in the JSON format", async () => {
		const response = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)
		expect(response.headers["content-type"]).toContain("application/json")
		expect(response.body).toHaveLength(0)
	}, 100000)

	test("POST request to the /api/blogs creates a new blog post", async () => {
		const newBlog = {
			title: "TDD harms architecture",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
			likes: 1
		}
  
		const initResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
		const initLength = initResponse.body.length
  
		await api.post("/api/blogs").send(newBlog).set("Authorization", `Bearer ${validToken}`)
  
		const postResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
		const postLength = postResponse.body.length
		const createdBlog = postResponse.body[postLength - 1]
  
		expect(postLength - initLength).toBe(1)
		expect(newBlog).toEqual(expect.objectContaining({
			title: newBlog.title,
			author: newBlog.author,
			url: newBlog.url,
			likes: newBlog.likes
		})
		)
	}, 100000)

	test("unique identifier property of the blog posts is named id", async () => {
		const response = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)

		response.body.forEach((blog) => {
			expect(blog.id).toBeDefined()
		})
	}, 100000)

	test("zero likes if likes is missing", async () => {
		const newBlog = {
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
		}
  
		const initResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
		const initLength = initResponse.body.length
  
		await api.post("/api/blogs").send(newBlog).set("Authorization", `Bearer ${validToken}`)
  
		const postResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
		const postLength = postResponse.body.length
		const createdBlog = postResponse.body[postLength - 1]
  
		expect(postLength - initLength).toBe(1)
		expect(createdBlog.likes).toBe(0)
	}, 100000)

	test("400 title or url are missing", async () => {
		const noTitleBlog = {
			author: "Person Person",
			url: "http://dummylink.html"
		}

		const noUrlBlog = {
			title: "Facts And Feelings",
			author: "Person Person"
		}
    
		const noUrlAndTitleBlog = {}

		const initResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)
		const initLength = initResponse.body.length
  
		await api.post("/api/blogs").send(noTitleBlog).set("Authorization", `Bearer ${decodedToken}`).expect(400)
		await api.post("/api/blogs").send(noUrlBlog).set("Authorization", `Bearer ${decodedToken}`).expect(400)
		await api.post("/api/blogs").send(noUrlAndTitleBlog).set("Authorization", `Bearer ${decodedToken}`).expect(400)
  
		const postResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)
		const postLength = postResponse.body.length
  
		expect(postLength - initLength).toBe(0)
	}, 100000)
})

describe("deletion of a blog", () => {
	let decodedToken
	let validToken
	beforeEach(async () => {
		const login = { "username": "root", "password": "sekret" }
		
		const loginResponse = await api.post("/api/login").send(login)
		//console.log(loginResponse)
		validToken = loginResponse.body.token.toString()
		decodedToken = jwt.verify(validToken, process.env.SECRET)
		// const user = await User.findById(decodedToken.id)
	})
	test("succeeds with status code 204 if id is valid", async () => {
		const initResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
		console.log("ID IS HERE")
		console.log(initResponse.body[0].id)
		const blogToDelete = initResponse.body[0]
      
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${validToken}`)
			.expect(204)
      
		const postResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${validToken}`)
      
		expect(postResponse.body).toHaveLength(initResponse.body.length - 1)
      
		const titles = postResponse.body.map(r => r.title)
      
		expect(titles).not.toContain(blogToDelete.title)
	}, 100000)

	test("returns 400 if id is invalid", async () => {
		const blogToDelete = "----------------"
      
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set("Authorization", `Bearer ${decodedToken}`)
			.expect(400)
	}, 100000)

})


describe("update of a blog", () => {
	let decodedToken
	beforeEach(async () => {
		const login = { "username": "root", "password": "sekret" }
		
		const loginResponse = await api.post("/api/login").send(login)
		// console.log(loginResponse)
		const validToken = loginResponse.body.token.toString()
		decodedToken = jwt.verify(validToken, process.env.SECRET)
		// const user = await User.findById(decodedToken.id)
	})
	test("succeeds if id is valid", async () => {
		const initResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)
		const blogToUpdate = initResponse.body[0]
		const newLikes = { likes: 99 }
      
		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.set("Authorization", `Bearer ${decodedToken}`)
			.send(newLikes)
      
		const postResponse = await api.get("/api/blogs").set("Authorization", `Bearer ${decodedToken}`)
      
		expect(postResponse.body).toHaveLength(initResponse.body.length)
		expect(postResponse.body[0].likes).toBe(99)
	}, 100000)

	test("returns 400 if id is invalid", async () => {
		const invalidId = "------------------"
		const updatedBlog = { likes: 99 }
      
		await api
			.put(`/api/blogs/${invalidId}`)
			.set("Authorization", `Bearer ${decodedToken}`)
			.send(updatedBlog)
			.expect(400)
	}, 100000)
})

afterAll(async () => {
	await mongoose.connection.close()
})