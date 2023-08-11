const supertest = require("supertest")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

describe("when there is initially one user at db", () => {
	beforeEach(async () => {
		await User.deleteMany({})
    
		const passwordHash = await bcrypt.hash("sekret", 10)
		const user = new User({ username: "root", passwordHash })
    
		await user.save()
	})
  
	test("creation succeeds with a fresh username", async () => {
		const usersAtStart = await helper.usersInDb()
  
		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		}
  
		await api
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/)
  
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})
  
	test("creation fails with proper statuscode and message if username already taken", async () => {
		const usersAtStart = await helper.usersInDb()
  
		const newUser = {
			username: "root",
			name: "Superuser",
			password: "salainen",
		}
  
		const result = await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/)
  
		expect(result.body.error).toContain("expected `username` to be unique")
  
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
	describe("Invalid users are not created", () => {
		test("User without username is not created and operation returns a 400 code", async () => {
			const usersAtStart = await helper.usersInDb()

			const noUsernameUser = {
				name: "noUsernameUser",
				password: "salainen",
			}

			const result = await api
				.post("/api/users")
				.send(noUsernameUser)
				.expect(400)
				.expect("Content-Type", /application\/json/)
  
			expect(result.body.error).toContain("Username or password is missing!")
  
			const usersAtEnd = await helper.usersInDb()
			expect(usersAtEnd).toHaveLength(usersAtStart.length)
		})
		test("User without password is not created and operation returns a 400 code", async () => {
			const usersAtStart = await helper.usersInDb()

			const noPasswordUser = {
				username: "root",
				name: "noPasswordUser"
			}

			const result = await api
				.post("/api/users")
				.send(noPasswordUser)
				.expect(400)
				.expect("Content-Type", /application\/json/)
  
			expect(result.body.error).toContain("Username or password is missing!")
  
			const usersAtEnd = await helper.usersInDb()
			expect(usersAtEnd).toHaveLength(usersAtStart.length)
		})
		test("User with username.length < 3 is not created and operation returns a 400 code", async () => {
			const usersAtStart = await helper.usersInDb()

			const shortUsernameUser = {
				username: "r",
				name: "shortUsernameUser",
				password: "hiufsnfhewjk",
			}

			const result = await api
				.post("/api/users")
				.send(shortUsernameUser)
				.expect(400)
				.expect("Content-Type", /application\/json/)
  
			const usersAtEnd = await helper.usersInDb()
			expect(usersAtEnd).toHaveLength(usersAtStart.length)
		})
		test("User with password.length < 3 is not created and operation returns a 400 code", async () => {
			const usersAtStart = await helper.usersInDb()

			const shortPasswordUser = {
				username: "root",
				name: "shortPasswordUser",
				password: "sa",
			}

			const result = await api
				.post("/api/users")
				.send(shortPasswordUser)
				.expect(400)
				.expect("Content-Type", /application\/json/)
  
			expect(result.body.error).toContain("The password is too short!")
  
			const usersAtEnd = await helper.usersInDb()
			expect(usersAtEnd).toHaveLength(usersAtStart.length)
		})
	})
})
  
afterAll(async () => {
	await mongoose.connection.close()
})