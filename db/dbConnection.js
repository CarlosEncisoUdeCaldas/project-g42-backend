const username = 'CarlosEnciso';
const pass = 'Carlos2022' ;
const dataBase = 'BdProjectG42';
const stringConnection = `mongodb+srv://${username}:${pass}@udecaldas2022ciclo4a.u06ei1r.mongodb.net/${dataBase}?retryWrites=true&w=majority`

module.exports = stringConnection;