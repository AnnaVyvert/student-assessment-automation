const express = require('express'),
  app = express(),
  cors = require('./middleware/cors.middleware'),
  group_router = require('./routes/group.routes'),
  student_router = require('./routes/student.routes'),
  subject_router = require('./routes/subject.routes'),
  result_list_router = require('./routes/result_list.routes')
const PORT = process.env.PORT || 8080

app.use(cors)
app.use(express.json())
app.use('/api', group_router)
app.use('/api', student_router)
app.use('/api', subject_router)
app.use('/api', result_list_router)

app.listen(PORT, () => console.log(`server launched on ${PORT}`))
