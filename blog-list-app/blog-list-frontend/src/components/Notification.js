import styled from 'styled-components'

const Notification = ({ message, statusCode }) => {
  if (message === null) {
    return null
  }

  const NotificationSuccess = styled.div`
    background-color: #58cc02;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    width: 50%;
    `

  const NotificationError = styled.div`
    background-color: #ff4b4b;
    color: white;
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    border-style: solid;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    width: 50%;
    `

  if (statusCode === 0) {
    return (
      <NotificationSuccess id='success'>
        {message}
      </NotificationSuccess>
    )
  }
  else if (statusCode === 1) {
    return (
      <NotificationError id='error'>
        {message}
      </NotificationError>
    )
  }
}

export default Notification