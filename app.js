const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
  
const app = express();

app.use(cors())

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');



// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact',  {layout: false} );

});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
        <h2>Nueva consulta desde página de contacto</h2>
        <h3>Detalle</h3>
        <ul>
            <li>Nombre: ${req.body.fullName}</li>
            <li>Email: ${req.body.email}</li>
            <li>Asunto: ${req.body.subject}</li>
        </ul>
        <h3>Consulta:</h3>
        <p>${ req.body.message }</p>
    `;


    
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "mail.disainsumos.com",
      port: 26,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'development@disainsumos.com', // generated ethereal user
        pass: 'casadesara', // generated ethereal password
      },
      tls: {
        rejectUnauthorized:false
      }
    });
  
    let mailOptions = {

        from: '"Nodemailer Contact" <development@disainsumos.com>', // sender address
        to: "dindustriales@hotmail.com", // list of receivers
        subject: "Consulta hecha desde la página de contacto", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
        
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.status(200).send(req.body.name);
        //res.render('contact', {layout: false, msg: 'Email has been sent'});
    });
  

});






app.listen(3000, () => console.log('Server started...') );