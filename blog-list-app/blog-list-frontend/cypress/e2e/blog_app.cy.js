describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('blogs')
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('#error').should('contain.text', 'Wrong username or password!')
      cy.get('#error').should('have.css', 'background-color', 'rgb(255, 75, 75)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('blogs')
      cy.contains('Matti Luukkainen logged in')
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('input[placeholder*="Write blog title here"]').type('Example Blog')
      cy.get('input[placeholder*="Write blog author here"]').type('John Doe')
      cy.get('input[placeholder*="Write blog URL here"]').type('https://example.com')
      cy.get('#create-button').click()

      cy.contains('Example Blog', { timeout: 10000 })
      cy.contains('John Doe', { timeout: 10000 })
    })

    it('User can like a blog', function() {
      cy.contains('new blog').click()
      cy.get('input[placeholder*="Write blog title here"]').type('Example Blog')
      cy.get('input[placeholder*="Write blog author here"]').type('John Doe')
      cy.get('input[placeholder*="Write blog URL here"]').type('https://example.com')
      cy.get('#create-button').click()

      cy.contains('Example Blog')
        .parent()
        .contains('view')
        .click()

      cy.contains('likes: 0')

      cy.contains('Example Blog')
        .parent()
        .contains('like')
        .click()

      cy.contains('likes: 1')
    })

    it('blogs are ordered according to likes', function() {
      cy.contains('new blog').click()
      cy.get('input[placeholder*="Write blog title here"]').type('Example Blog')
      cy.get('input[placeholder*="Write blog author here"]').type('John Doe')
      cy.get('input[placeholder*="Write blog URL here"]').type('https://example.com')
      cy.get('#create-button').click()

      cy.contains('Example Blog')
        .parent()
        .contains('view')
        .click()

      cy.contains('Example Blog')
        .parent()
        .contains('like')
        .click()

      cy.contains('likes: 1')

      cy.contains('new blog').click()
      cy.get('input[placeholder*="Write blog title here"]').type('Example Vlog')
      cy.get('input[placeholder*="Write blog author here"]').type('Jane Doe')
      cy.get('input[placeholder*="Write blog URL here"]').type('https://examples.com')
      cy.get('#create-button').click()

      cy.contains('Example Vlog')
        .parent()
        .contains('view')
        .click()

      cy.contains('Example Vlog')
        .parent()
        .contains('like')
        .click()

      cy.contains('Example Vlog')
        .parent()
        .contains('like')
        .click()

      cy.contains('likes: 2')

      cy.get('.blog').eq(0).should('contain', 'Example Vlog')
      cy.get('.blog').eq(1).should('contain', 'Example Blog')
    })

    describe('Delete a blog', function() {
      beforeEach(function() {
        cy.contains('new blog').click()
        cy.get('input[placeholder*="Write blog title here"]').type('Example Blog')
        cy.get('input[placeholder*="Write blog author here"]').type('John Doe')
        cy.get('input[placeholder*="Write blog URL here"]').type('https://example.com')
        cy.get('#create-button').click()

        cy.get('#logout-button').click()

        const user = {
          name: 'Robert C. Martin',
          username: 'uncle-bob',
          password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
      })

      it(' only the creator can see the delete button of a blog', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
        cy.contains('blogs')
        cy.contains('Matti Luukkainen logged in')

        cy.contains('Example Blog')
          .parent()
          .contains('view')
          .click()

        cy.contains('Example Blog')
          .parent()
          .contains('delete')
      })

      it('user who created a blog can delete it', function() {
        cy.contains('log in').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
        cy.contains('blogs')
        cy.contains('Matti Luukkainen logged in')

        cy.contains('Example Blog')
          .parent()
          .contains('view')
          .click()

        cy.contains('Example Blog')
          .parent()
          .contains('delete')
          .click()

        cy.contains('Example Blog').should('not.exist')
      })

      it('unauthorized user cannot see the delete button of a blog', function() {
        cy.contains('log in').click()
        cy.get('#username').type('uncle-bob')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()
        cy.contains('blogs')
        cy.contains('Robert C. Martin logged in')

        cy.contains('Example Blog')
          .parent()
          .contains('view')
          .click()

        cy.contains('Example Blog')
          .parent()
          .contains('delete').should('not.exist')
      })
    })
  })
})