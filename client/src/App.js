import { useState, useEffect } from 'react'

import './normal.css'
import './App.css'
import Chatgpt from './images/chatgpt-icon.svg'

function App() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState('text-davinci-003')
  const [chatLog, setChatLog] = useState([
    {
      user: 'gpt',
      message: 'How can I help you today?',
    },
  ])
  useEffect(() => {
    getEngines()
  }, [])
  useEffect(() => {
    setLoading(false)
  }, [models])

  function getEngines() {
    fetch('http://localhost:8080/models')
      .then((res) => res.json())
      .then((data) => {
        const value = data.models
        setModels([...value])
        // console.log(value)
      })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    let chatLogNew = [...chatLog, { user: 'me', message: `${input}` }]
    setChatLog(chatLogNew)

    const response = await fetch('http://localhost:8080/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // message: chatLogNew.map((message) => message.message).join('\n'),
        message: input,
        currentModel,
      }),
    })
    setInput('')
    const data = await response.json()
    setChatLog([...chatLogNew, { user: 'gpt', message: `${data.message}` }])
    // console.log(data.message)
  }

  function clearChat() {
    setChatLog([])
  }
  if (loading) return <h1>Loding...</h1>

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>New Chat
        </div>
        <div className="models">
          <select
            className="select-model"
            onChange={(e) => {
              setCurrentModel(e.target.value)
            }}
          >
            {models &&
              models.map((model, index) => {
                // console.log(model)
                return (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                )
              })}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* <div className="chat-message chatgpt">
            <div className="chat-message-center">
              <div className="avatar chatgpt">
                <img src={Chatgpt} alt="" />
              </div>
              <div className="message">I am an AI</div>
            </div>
          </div> */}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              className="chat-input-textarea"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
              }}
              rows="1"
              placeholder="Type your message here"
            ></input>
          </form>
        </div>
      </section>
    </div>
  )
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === 'gpt' && 'chatgpt'}`}>
      <div className="chat-message-center">
        <div className={`avatar ${message.user === 'gpt' && 'chatgpt'}`}>
          {message.user === 'gpt' && <img src={Chatgpt} alt="" />}
        </div>
        <div className="message">{message.message}</div>
      </div>
    </div>
  )
}

export default App
