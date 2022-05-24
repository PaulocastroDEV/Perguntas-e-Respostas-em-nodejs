/* Criação de rota e puxando a biblioteca express e escolhendo a porta para rodar a aplicação*/

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta")
//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


/*Utilizar o EJS como View Engine*/ //assim eu ativo o html no projeto, mas tenho que criar uma pasta chamada views, e colocar os arquivos como .ejs//

app.set('view engine','ejs');

/*Utilizar arquivos estaticos*/
app.use(express.static('public'));



app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//rotas//
app.get("/",(req,res) => {
    Pergunta.findAll({raw: true, order:[
        ['id','DESC'] // ASC = Crescente || DESC = Descrescemte
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas: perguntas
        });
    });
    //select * all from perguntas//
    
});
    app.get("/perguntar",(req,res) => {
        res.render("perguntar",{
        
        })
});
/*Para receber os dados do formulário */
/*Capturar dados de um formulário */

/* instalar a biblioteca npm install body-parser --save
*/
app.post("/salvarpergunta",(req,res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    /* Create pega os dados para o banco de dado */
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });

});
app.get("/pergunta/:id",(req,res)=> {
    var id= req.params.id;
    Pergunta.findOne({
        where:{id: id}
    }).then(pergunta =>{
        if(pergunta != undefined){ //checar se a pergunta foi encontrada

            Resposta.findAll({
                where:{perguntaId: pergunta.id},
                order:[
                    ['id','DESC']
                ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ //não foi encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) =>{
    var corpo = req.body.corpo;
    var perguntaId=req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId)
    })
});

app.listen(8080,() =>{
    console.log("App Rodando!")
});