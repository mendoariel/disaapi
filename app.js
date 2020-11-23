const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
  
const app = express();

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
    console.log(req);
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Company: ${req.body.company}</li>
            <li>Email: ${req.body.email}</li>
            <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Messages</h3>
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
        to: "mendoariel@gmail.com", // list of receivers
        subject: "Esto es un prueba ", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
        
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        
        res.render('contact', {layout: false, msg: 'Email has been sent'});
    });
  

});






app.listen(3000, () => console.log('Server started...') );