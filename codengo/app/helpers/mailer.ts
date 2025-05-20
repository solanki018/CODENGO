import nodemailer from 'nodemailer';
import User from '../models/userModel';
import bcrypt from 'bcryptjs';

export const sendEmail = async ({email,emailType,userId}:any) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        if(emailType === 'verification') {
            await User.findByIdAndUpdate(userId, 
                { verifytoken : hashedToken , verifyTokenExpiry : Date.now() + 3600000 },);
        } else if(emailType === 'reset') {
            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken : hashedToken , forgotPasswordExpiry : Date.now() + 3600000 },);
        }
        
        // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "b831d21510e758", //ye yha nhi hona chahiye
    pass: "3e1af7b5e975ed" //ye yha nhi hona chahiye
  }
});

        const mailOptions = {
            from: "sourabhsolanki1694@gmail.com",
            to: email,
            subject: emailType === 'verification' ? 'Verify your email' : "Reset your password",
            html : `<p>Click <a href="${process.env.DOMAIN}/api/auth/${emailType}/${hashedToken}">here</a> to ${emailType === 'verification' ? 'verify your email' : "reset your password"}</p>`,
        };

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}