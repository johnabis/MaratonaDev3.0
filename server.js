//configurando o servidor
const express = require('express')
const server = express()

//Configurar servidor mostrar
//arquivos extras

server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended: true}))

//Configurar conexão com bando de dados
const Pool = require('pg').Pool
const db = new Pool({
  user:'postgres',
  password: '3333',
  host: 'localhost',
  port: 5433,
  database: 'doe'
})




//configurando template engine
const nunjucks = require('nunjucks')

nunjucks.configure('./', { // ./ raiz do projeto
  express: server,
  noCache: true
})


// // lista de doadores: Vetor ou Array
// const donors = [
//   {
//     name:"Diego Fernandes",
//     blood:"AB+"
//   },
//   {
//     name:"Cleiton Souza",
//     blood:"B+"
//   },
//   {
//     name:"Robson Marques",
//     blood:"A+"
//   },
//   {
//     name:"Mayk Brito",
//     blood:"O+"
//   },
// ]

//configurar apresentação da página
server.get("/", function(req, res){
  db.query("SELECT * FROM donors", function(err, result){
    if (err) return res.send("Erro no banco de dados.")

    const donors = result.rows
    res.render("index.html", {donors})
  })
})


server.post("/", function(req, res){
  //pegar dados do formulário
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood
  
  if (name == "" || email =="" || blood == ""){
    return res.send("Todos os campos são obrigatórios.")
  }

  //coloco valores no array
  // donors.push({
  //   name: name,
  //   blood: blood,
  // })

  //coloco valores no bando de dados
  const query = `
      INSERT INTO donors("name", "email", "blood")
      VALUES($1, $2, $3)`

  const values = [name, email, blood]
  db.query(query, values, function(err){
    if (err) return res.send("Erro no banco de dados")



    return res.redirect("/")
  })

  
})

//ligar servidor na porta 3000
server.listen(3000, function(){
  console.log("Server is running now!")
})