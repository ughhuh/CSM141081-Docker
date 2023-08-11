import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders name, status and buttons by default', () => {
    const todo = {
        _id: 'TodoID',
        text: 'Example Todo',
        done: false,
      }
    
    const mockHandler = jest.fn()
    render(<Todo todo={todo} deleteTodo={mockHandler} completeTodo={mockHandler}/>)

    const textElement = screen.queryByText('Example Todo')
    expect(textElement).toBeDefined()

    const doneElement = screen.queryByText('This todo is not done')
    expect(doneElement).toBeDefined()

    const completeElement = screen.queryByText('Set as done')
    expect(completeElement).toBeDefined()

    const deleteElement = screen.queryByText('Delete')
    expect(deleteElement).toBeDefined()

})
  