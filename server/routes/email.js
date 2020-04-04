//const nodemailer = require('nodemailer');
const mozlog = require('../log');
const log = mozlog('email');
const fetch = require('node-fetch');
const config = require('../config');
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
//const sgMail = require('@sendgrid/mail');
//const mailjet = require ('node-mailjet')
//                .connect('550e03670f9451153c620b360a8a67cf', 'cea8c840e0710aa530caa6261ea46eec');

module.exports = function(req, res) {
  let sended = false;
  try {
    //const data = JSON.parse(req.body); // see http://crbug.com/490015
    const message = req.body.message;
    log.info('sendemail', message);

    sendEmail(message);
    sended = true;
    return res.send({
      sended: this.sended
    });
  } catch (e) {
    log.info('sendemail', e);
    res.sendStatus(500);
  }

  function sendEmail(message) {
    const verifyUrl = config.email_service;
    log.info('verifyUrl', verifyUrl);

    const content = emailTemaplate(message);
    const body = {
      //contentType: 'text/html charset=UTF-8',
      contentType: 'text/html',
      origin: 'send@grupocarreras.com',
      receivers: [message.to],
      subject: 'Carreras Send tiene un mensaje para usted!',
      body: content,
      appFrom: 'CarrerasSend'
    };
    log.info('body', body);

    fetch(verifyUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => console.log(res.status))
      .catch(err => {
        // handle an error
        console.error(err);
      });
  }

  function sendEmailMailJet(message) {
    const content = emailTemaplate(message);
    return mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'send@grupocarreras.com',
              Name: 'Carreras Send'
            },
            To: [
              {
                Email: message.to
              }
            ],
            Subject: '✔ Carreras Send tiene un mensaje para usted!',
            //"TextPart": "My first Mailjet email",
            HTMLPart: content,
            CustomID: 'CarrerasSend'
          }
        ]
      })
      .then(result => {
        // do something with the send result or ignore
        console.log(result.body);
      })
      .catch(err => {
        // handle an error
        console.log(err.statusCode);
      });
  }

  function emailTemaplate(message) {
    const body = message.body;

    return (
      '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns="http://www.w3.org/1999/xhtml">' +
      '<head>' +
      '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
      '<meta name="viewport" content="width=device-width" />' +
      '</head>' +
      "<body style=\"width: 100% !important; min-width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; color: #222222; font-family: 'Helvetica', 'Arial', sans-serif; font-weight: normal; text-align: left; line-height: 19px; font-size: 14px; margin: 0; padding: 0;\">" +
      '<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#dfdfdf" style="border-left:0px solid #ebeae4;border-right:0px solid #ebeae4">' +
      '<tbody><tr>' +
      '<td style="font-size:12px;color:#666666;text-align:center;font-family:\'Open Sans\',Helvetica,Arial,sans-serif;line-height:20px;vertical-align:top;padding:15px 0px 17px 0px" bgcolor="#dfdfdf">' +
      '<p style="margin:0">' +
      '<strong>Carreras Send</strong>' +
      '</p>' +
      '<p style="margin:0">' +
      'Si no puedes leer correctamente este email, por favor haga ' +
      '<span style="text-decoration:underline;color:#666666!important"><a style="color:#666666!important" href="' +
      message.url +
      '" target="_blank">click aqui</a></span>' +
      '</p>' +
      '</td>' +
      '</tr>' +
      '</tbody></table>' +
      '<table style="border-collapse:collapse;line-height:24px;margin:0;padding:0;width:100%;font-size:17px;color:#373737;background:#f9f9f9" border="0" cellpadding="0" cellspacing="0" width="100%">' +
      '<tbody>' +
      '<tr>' +
      '<td style="border-collapse:collapse" valign="top">' +
      '<table style="border-collapse:collapse" border="0" cellpadding="0" cellspacing="0" width="100%">' +
      '<tbody>' +
      '<tr>' +
      '<td style="border-collapse:collapse;padding:20px 16px 12px" valign="bottom">' +
      '<div style="text-align:center">' +
      '<a href="https://www.grupocarreras.com" style="color:#439fe0;font-weight:bold;text-decoration:none;word-break:break-word" target="_blank">' +
      '<img class="CToWUd" src="http://cdn.grupocarreras.com/images/logo_carreras.png" style="outline:none;text-decoration:none;border:none;width:auto;max-width:100%;min-height:36px">' +
      '</a>' +
      '</div>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="border-collapse:collapse" valign="top">' +
      '<table style="border-collapse:collapse;background:white;border-radius:0.5rem;margin-bottom:1rem" align="center" border="0" cellpadding="32" cellspacing="0">' +
      '<tbody>' +
      '<tr>' +
      '<td style="border-collapse:collapse" valign="top" width="546">' +
      '<div style="max-width:600px;margin:0 auto">' +
      '<div style="background:white;border-radius:0.5rem;margin-bottom:1rem">' +
      '<h2 style="color:#2ab27b;line-height:30px;margin-bottom:12px;margin:0 0 12px">Hola</h2>' +
      '<p style="font-size:17px;line-height:24px;margin:0 0 16px"><b>' +
      message.from +
      '</b> te ha enviado archivos con Carreras Send</p>' +
      '<p style="background-color:#dfdfdf;font-size:16px;line-height:24px;margin:0 0 16px">' +
      '<span style="white-space: pre-wrap;color:#666666;font-weight:normal;text-decoration:none;word-break:break-word" target="_blank">' +
      body +
      '</span></p>' +
      '<div style="text-align:center;margin:2rem 0 1rem">' +
      '<table style="border-collapse:collapse;background:#2ab27b;border-bottom:2px solid #1f8b5f;border-radius:4px;padding:14px 32px;display:inline-block" cellpadding="0" cellspacing="0">' +
      '<tbody>' +
      '<tr>' +
      '<td style="border-collapse:collapse">' +
      '<a href=' +
      message.url +
      ' style="color:white;font-weight:normal;text-decoration:none;word-break:break-word;display:inline-block;letter-spacing:1px;font-size:20px;line-height:26px" align="center" target="_blank">Descarga tus archivos</a>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</div>' +
      '<p style="font-size:0.9rem;line-height:20px;margin:0 auto 1rem;color:#aaa;text-align:center;max-width:100%;word-break:break-word">Link:' +
      '<a href=' +
      message.url +
      ' style="color:#439fe0;font-weight:bold;text-decoration:none;word-break:break-word" target="_blank">' +
      message.url +
      '</a></p>' +
      '<p style="font-size:17px;line-height:24px;margin:0 0 16px">' +
      'Saludos,<br>' +
      '</p>' +
      '</div>' +
      '</div>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</td>' +
      '</tr>' +
      '<tr>' +
      '<td style="border-collapse:collapse">' +
      '<table style="border-collapse:collapse;margin-top:1rem;background:white;color:#989ea6" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">' +
      '<tbody>' +
      '<tr>' +
      '<td style="border-collapse:collapse;padding:16px 8px 24px" align="center" valign="top">' +
      '<div style="max-width:600px;margin:0 auto">' +
      '<p style="font-size:12px;line-height:20px;margin:0 0 16px;margin-top:16px">' +
      'I <span style="color:red">&#10084;</span> ' +
      ' <a href="http://www.grupocarreras.com" style="color:#439fe0;font-weight:bold;text-decoration:none;word-break:break-word" target="_blank">Carreras Grupo Log&iacute;stico S.A.</a>' +
      '<br>' +
      '<a href="#2000056546_" style="color:#989ea6;font-weight:normal;text-decoration:none;word-break:break-word">Calle Messina 2, 50197 Zaragoza, 976 011 126</a>' +
      '</p>' +
      '</div>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      '</table>' +
      '</body>' +
      '</html>'
    );
  }

  /*return (
      '<li class="user" id="user' + id + '">' +
        '<p class="user"><b>' + name + '</b><span> -- ' + username + '</p>' +
        '<address>'+ address.street + " " + address.suite + ", " + address.city +'</address>' +
      '</li>'
    );*/
};

/*
    const content2 = "<p><b>Carreras Send</b> tiene un mensaje para usted!</p><br>" +
    "<p>" + message.body+"</p><br>"  +
    "<p>" + message.url+"</p><br>";

    const content = emailTemaplate(message);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    //sgMail.setApiKey('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');
    const msg = {
      to: message.to,
      from: 'send@grupocarreras.com',
      subject: '✔ Carreras Send tiene un mensaje para usted!',
      //text: 'and easy to do anywhere, even with Node.js',
      html: content,
    };
    sgMail.send(msg);*/

//nodemailer.createTestAccount((err, account) => {
//if (err) {
//    console.error('Failed to create a testing account. ' + err.message);
//    return process.exit(1);
//}

//console.log('Credentials obtained, sending message...');

// Create a SMTP transporter object
/*let transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
              user: account.user,
              pass: account.pass
          }
      });*/

/*let transporter = nodemailer.createTransport({
        host: 'smtp.carreras.sa',
        port: 25,
        //port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "u01185", // generated ethereal user
          pass: "hoz8h45h" // generated ethereal password
        }
      });

      transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });

      // Message object
      let email = {
          from: message.from,
          to: message.to,
          subject: 'Carreras Send ✔',
          //text: content,
          html: content
      };

      transporter.sendMail(email, (err, info) => {
          if (err) {
              console.log('Error occurred. ' + err.message);
              return process.exit(1);
          }

          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });*/
//});

/*let transport = nodemailer.createTransport({
      host: 'smtp.carreras.sa',
      port: 25,
      //port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "u01185", // generated ethereal user
        pass: "hoz8h45h" // generated ethereal password
      }
    });

    transport.verify(function(error, success) {
      if (error) {
        console.log(error);
        log.info('sendemail', error);
      } else {
        console.log("Server is ready to take our messages");
        log.info('sendemail', "Server is ready to take our messages");
      }
    });

    const email2 = {
      from: 'ricardo.guillen@grupocarreras.com', // Sender address
      to: 'ricardo.guillen@grupocarreras.com',         // List of recipients
      subject: 'Design Your Model S | Tesla', // Subject line
      text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    };

    const email = {
      from: 'ricardo.guillen@grupocarreras.com',
      to: 'ricardo.guillen@grupocarreras.com',
      subject: 'Design Your Model S | Tesla',
      html: '<h1>Have the most fun you can in a car!</h1><p>Get your <b>Tesla</b> today!</p>'
    };


    transport.sendMail(email, function(err, info) {
        if (err) {
          console.log(err)
          sended = false;
          log.info('sendemail', error);
        } else {
          console.log(info);
          sended = true;
          log.info('sendemail', info);
        }
    });*/
