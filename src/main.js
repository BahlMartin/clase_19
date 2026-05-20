import ENVIROMENT from './config/enviroment.config.js';
import connectMongoDB from './config/mongodb.config.js';
import express, { response } from 'express'


/* SOLO EN LOCAL Y SI TENES PROBLEMAS DE DNS PARA CONECTARTE A MONGO DB */
import dns from 'dns';
import auth_router from './routes/auth.routes.js'
import mailer_transport from './config/mailer.config.js'
import authMiddleware from './middlewares/auth.middleware.js';
import workspace_router from './routes/workspace.route.js'
if (ENVIROMENT.MODE === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4'])
}

connectMongoDB();

/* 
Crear una API de express
Route:
    /api/auth => Trabaja todo lo relacionado a autentificacion
        POST /register
            body: {name, email, password}
            Validar que el usuario tenga nombre mayor a 2 caracteres
            Validar email
            Validar password con almenos 6 caracteres 
            Crear un usuario en la DB
        



Mas Adelante...
        POST /login
        
RECOMENDACION:
    El controller puede ser asincrono!!
    authRouter.post(
        '/register', 
        async (request, response) => {
            await userRepository.create('pepe')
        }
    )
*/

//creamos la app
const app = express()
//como recibe json en el body 
app.use(express.json())

app.use('/api/auth', auth_router);

const PORT = ENVIROMENT.PORT 
app.listen(PORT, () => {
    console.log("nuestra aplicacion express se esta ejecutando en el puerto " + PORT)
})


/* 
COMO VALIDAR UN MAIL?

el usuario se registra con un x mail
el sistema envia un mail con un link tipo 
    <a href="URL_BACKEND +/api/auth/verify-email?email=${email}">Verificar mail</a>
cuando el usuario da click a ese link estara haciendo un get /api/auth/verify-email?email=${email} desde su navegador
nosotros recibimos la consulta y cambiamos la propiedad de email_verificado a true en la DB

CONSIGNA:
Agregar la propiedad booleana 'email_verificado' sobre el usuario en el modelo de mongoose


en el controller de register, luego de crear el usuario, enviar un mail con el link de verificacion

crear el endpoint 
/api/auth/verify-email

    recibe una querystring llamada email(req.query)
    valida que el email exista en la DB
    valida que no este verificado aun
    cambia el verificado a true
    responde exitosamente

*/

/* 
Un endpoitn donde el cliente deberea enviarnos por header de autorizacion el acces token, en caso de estar presente y ser correcto
le daremos los datos de la cuenta
*/
app.get('/api/profile', 
    /* (request, response, next) =>{
    const random_num = Math.random()
    if (random_num > 0.5) { 
        return response.json({
            message: "mala suerte campeon"
        })
    }
    else {
        return next()
    }
    }, */
    authMiddleware, (request, response) => {
    console.log("la informacion del usuario es: ", request.user.username)
    console.log("se activa el controlador")
    return response.json({
        ok:true,
        status:200,
        message:"estas autenticado"
    })

})

/* 
Ruta: /api/workspace

    controlador: workspaceController
        post() Debe estar con el authMiddleware
            Validar nombre y descripcion (opcional)
            Crear un espacio de trabajo
            Crear una membresia de role tipo 'dueño' a nombre del id del cliente consultante.
            
            body: {
                nombre,
                descripcion
            }
            
*/

app.use('/api/workspace', workspace_router);