import React, { useState } from "react"
import styled from "styled-components"
import axios from "axios"
import { useLoading } from "@swyx/hooks"

import logo from "./logo.svg"
import "./App.css"

interface FormState {
  name: string
  mail: string
  message: string
}

const Form = styled.form``

const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 16px;
`

const Input = styled.input`
  font: inherit;
  background: transparent;
  outline: 0;
  border: 1px solid white;
  border-radius: 6px;
  color: #efefef;
  padding: 4px 8px;
`

const Title = styled.div`
  font-weight: bold;
  margin: 8px 0;
`

const Textarea = styled.textarea`
  font: inherit;
  background: transparent;
  outline: 0;
  padding: 4px 8px;
  border: 1px solid white;
  border-radius: 6px;
  color: #efefef;
`

const Label = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const Submit = styled.button.attrs(() => ({ type: "submit" }))`
  font: inherit;
  outline: 0;
  text-transform: uppercase;
  font-size: 18px;
  background: transparent;
  border: 1px solid white;
  border-radius: 6px;
  padding: 4px 8px;
  color: #efefef;
  cursor: pointer;
`

const LambdaDemo: React.FC = () => {
  const [isLoading, load] = useLoading()
  const [form, setForm] = useState<FormState>({
    name: "",
    mail: "",
    message: ""
  })

  const [msg, setMsg] = React.useState(null)

  const sendMail = ({ mail, name, message }: FormState) => {
    load(
      axios
        .post("/.netlify/functions/form-forward", {
          name,
          mail,
          message
        })
        .then(response => response.data)
        .then(json => setMsg(json.msg))
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.mail) return
    if (!form.name) return
    if (!form.message) return

    sendMail(form)
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  return (
    <div>
      <div>{msg}</div>
      <Form onSubmit={handleSubmit}>
        <Group>
          <Label>
            <Title>Name</Title>
            <Input
              value={form.name}
              onChange={handleChange}
              name="name"
              placeholder="Your name"
            ></Input>
          </Label>
        </Group>
        <Group>
          <Label>
            <Title>eMail</Title>
            <Input
              placeholder="mail@example.com"
              value={form.mail}
              onChange={handleChange}
              name="mail"
            ></Input>
          </Label>
        </Group>
        <Group>
          <Label>
            <Title>Message</Title>
            <Textarea
              value={form.message}
              onChange={handleChange}
              name="message"
            ></Textarea>
          </Label>
        </Group>
        <Group>
          <Submit>Submit form</Submit>
        </Group>
      </Form>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <LambdaDemo />
      </header>
    </div>
  )
}

export default App
