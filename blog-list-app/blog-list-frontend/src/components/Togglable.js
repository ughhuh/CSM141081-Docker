import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div className='hideWhenVisible' style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonOpen}</button>
      </div>
      <div className='showWhenVisible' style={showWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonClose}</button>
        {props.children}
      </div>
    </div>
  )
}

export default Togglable