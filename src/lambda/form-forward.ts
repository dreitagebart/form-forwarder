import { Handler, Context, Callback, APIGatewayEvent } from "aws-lambda"
import mailer from "nodemailer"

interface HelloResponse {
  statusCode: number
  body: any
}

export async function handler(event: any, context: Context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  try {
    console.log("process.env.STRATO_HOST", process.env.STRATO_HOST)
    console.log("process.env.STRATO_PORT", process.env.STRATO_PORT)
    console.log("process.env.STRATO_USER", process.env.STRATO_USER)
    console.log("process.env.STRATO_PASS", process.env.STRATO_PASS)
    const body = JSON.parse(event.body)

    console.log("body", body)

    let transporter = mailer.createTransport({
      host: process.env.STRATO_HOST,
      port: process.env.STRATO_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.STRATO_USER, // generated ethereal user
        pass: process.env.STRATO_PASS
      }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Musikkapelle Markelsheim 👻" <info@musikkapelle-markelsheim.de>', // sender address
      to: "stefan.buechold@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: body.message, // plain text body
      html: body.message // html body
    })

    console.log("Message sent: %s", info.messageId)

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: `message sent  with id ${info.messageId}` })
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
