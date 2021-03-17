const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));

//RUTAS
const userRouter = require('./routes/UserRoutes');
app.use('/usuario', userRouter);
const emailRouter = require('./routes/EmailRouter');
app.use('/correo', emailRouter);
const roleRouter = require('./routes/RoleRoutes');
app.use('/permiso', roleRouter);
const userRoleRouter = require('./routes/UserRoleRoutes');
app.use('/usuario_permiso', userRoleRouter);
const councilRouter = require('./routes/CouncilRouter');
app.use('/consejo', councilRouter);
const attendantRouter = require('./routes/AttendantRouter');
app.use('/convocado', attendantRouter);
const discussionRouter = require('./routes/DiscussionRouter');
app.use('/punto', discussionRouter);
const councilTypeRouter = require('./routes/CouncilTypeRouter');
app.use('/tipo_consejo', councilTypeRouter);
const attendantTypeRouter = require('./routes/AttendantTypeRouter');
app.use('/tipo_convocado', attendantTypeRouter);
const discussionTypeRouter = require('./routes/DiscussionTypeRouter');
app.use('/tipo_punto', discussionTypeRouter);
const votingRouter = require('./routes/VotingRouter');
app.use('/votacion', votingRouter);

//RUTAS DE REACT
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
