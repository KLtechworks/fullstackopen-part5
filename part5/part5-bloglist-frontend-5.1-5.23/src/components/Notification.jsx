// 5.4: Blog List Frontend, step 4
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    background: 'lightgrey',
    border: type === 'error' ? '3px solid red' : '3px solid green'
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification