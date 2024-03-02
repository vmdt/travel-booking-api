const path = require('path');
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const config = require('./config');

async function sendMail(template, receiver, locals) {
    try {
        const transport = nodemailer.createTransport({
            host: `${config.HOST_MAIL}`,
            port: `${config.PORT_MAIL}`,
            auth: {
                user: `${config.USER_MAIL}`,
                pass: `${config.USER_MAIL_PASS}`
            }
        });

        const email = new Email({
            message: {
                from: `Travel Website <${config.SENDER_MAIL}>`
            },
            send: true,
            transport,
            views: {
                options: {
                    extension: 'ejs'
                }
            },
            juice: true,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                    relativeTo: path.join(__dirname, '../build')
                }
            }
        });

        await email.send({
            template: path.join(__dirname, '..', 'src/emails', template),
            message: { to: receiver },
            locals
        });

    } catch (error) {
        console.log('Send mail error', error);
    }
}

module.exports = {
    sendMail
}