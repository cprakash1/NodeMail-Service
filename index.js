const express = require('express');
const app = express();
const path=require('path');
const bodyParser=require('body-parser');
const ejsMate=require('ejs-mate');
const morgan = require('morgan');
const nodeMailer=require('nodemailer');
const { error } = require('console');

app.set('view engine', 'ejs');
app.engine('ejs',ejsMate);
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/',function(req,res){
    res.render('index',msg="");
});
app.post('/',function(req,res){
    console.log(req.body);
    const output=`<h1>Mail Regarding Job Application<h1><ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone :${req.body.phone}</li>
    <li>Company: ${req.body.company}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>`

    //creating reusable transporter using default smtp transport
    let transporter=nodeMailer.createTransport({
        host:'smtp.gmail.com',
        hostname: "smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user: 'SENDER EMAIL',
            pass: 'APP PASSWORD' //app password
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    let mailerOption={
        from:'RECIEVEREMAIL',
        to:'SENDEREMAIL',
        subject:'TEXT',
        text:'DEFAULT PALIN TEXT TO SHOW TO RECIEVER SIDE IF HTML NOT SUPPOTABE',
        html:output// HTML TEXT
    };
    transporter.sendMail(mailerOption,(error,info)=>{
        if(error){
            console.log(error);
            return res.send(error);
        }
        console.log(`MESSAGE SENT ${info.messageId}`);
        // console.log('Preview URL: %s', nodeMailer.getTestMessageUrl(info)); // ONLY IF WE SEND MAIL THROUGH ETHERAL

      return res.send('contact');
    })
    // res.send('index');
});
app.listen(3000,console.log("HI"));