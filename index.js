//

// import { Configuration, OpenAIApi } from 'openai'

const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  organization: '####Enter Organization Key#####',
  apiKey: '####Enter API Key#####',
})

const openai = new OpenAIApi(configuration)
// const response = await openai.listEngines()

//Express Bootstrap
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')

const app = express()
const port = 8080

app.use(bodyParser.json())
app.use(cors())

app.post('/', async (req, res) => {
  const { message, currentModel } = req.body
  // console.log(message)
  const response = await openai.createCompletion({
    model: `${currentModel}`, //'text-davinci-003'
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  })
  // console.log(response.data.choices[0].text)
  res.json({
    // data: response.data,
    message: response.data.choices[0].text,
  })
})

app.get('/models', async (req, res) => {
  const response = await openai.listEngines()
  // console.log(response.data.data)
  res.json({
    models: response.data.data,
  })
})

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}`)
})
