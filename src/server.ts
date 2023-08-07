import app from './app'
import { startDatabase } from './database'

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT, async () => {
    await startDatabase()
    console.log(`Server is running on port ${PORT}.`)
})
