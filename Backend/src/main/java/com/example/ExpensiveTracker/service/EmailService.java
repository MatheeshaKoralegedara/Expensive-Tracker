package com.example.ExpensiveTracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@spendwise.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Send email verification email
     */
    public void sendVerificationEmail(String toEmail, String firstName, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken;
            String htmlContent = buildVerificationEmailHtml(firstName, verificationLink);

            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject("Verify Your SpendWise Account Email");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    /**
     * Send welcome email after email verification
     */
    public void sendWelcomeEmail(String toEmail, String firstName, String lastName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String htmlContent = buildWelcomeEmailHtml(firstName, lastName);

            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject("Welcome to SpendWise!");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String firstName, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            String htmlContent = buildPasswordResetEmailHtml(firstName, resetLink);

            helper.setTo(toEmail);
            helper.setFrom(fromEmail);
            helper.setSubject("Reset Your SpendWise Password");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    /**
     * Build HTML content for verification email
     */
    private String buildVerificationEmailHtml(String firstName, String verificationLink) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <style>" +
            "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }" +
            "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
            "        .header { background: linear-gradient(135deg, #6c63ff, #38ef7d); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }" +
            "        .header h1 { margin: 0; font-size: 28px; }" +
            "        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }" +
            "        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #6c63ff, #38ef7d); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }" +
            "        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }" +
            "        .warning { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px; color: #856404; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'>" +
            "            <h1>✨ SpendWise</h1>" +
            "        </div>" +
            "        <div class='content'>" +
            "            <p>Hi <strong>" + firstName + "</strong>,</p>" +
            "            <p>Welcome to SpendWise! We're excited to have you on board.</p>" +
            "            <p>To get started and secure your account, please verify your email address by clicking the button below:</p>" +
            "            <div style='text-align: center;'>" +
            "                <a href='" + verificationLink + "' class='button'>Verify Email Address</a>" +
            "            </div>" +
            "            <p>Or copy and paste this link in your browser:</p>" +
            "            <p style='word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px;'>" + verificationLink + "</p>" +
            "            <div class='warning'>" +
            "                <strong>Important:</strong> This link will expire in 24 hours. If you didn't create this account, please ignore this email." +
            "            </div>" +
            "            <p>If you have any questions, feel free to reach out to our support team.</p>" +
            "            <p>Best regards,<br>The SpendWise Team</p>" +
            "        </div>" +
            "        <div class='footer'>" +
            "            <p>&copy; 2026 SpendWise. All rights reserved.</p>" +
            "            <p>This is an automated message, please do not reply to this email.</p>" +
            "        </div>" +
            "    </div>" +
            "</body>" +
            "</html>";
    }

    /**
     * Build HTML content for welcome email
     */
    private String buildWelcomeEmailHtml(String firstName, String lastName) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <style>" +
            "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }" +
            "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
            "        .header { background: linear-gradient(135deg, #6c63ff, #38ef7d); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }" +
            "        .header h1 { margin: 0; font-size: 28px; }" +
            "        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }" +
            "        .feature { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #38ef7d; border-radius: 5px; }" +
            "        .feature h3 { margin-top: 0; color: #6c63ff; }" +
            "        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'>" +
            "            <h1>✨ Welcome to SpendWise!</h1>" +
            "        </div>" +
            "        <div class='content'>" +
            "            <p>Hi <strong>" + firstName + " " + lastName + "</strong>,</p>" +
            "            <p>Your email has been verified successfully! Your SpendWise account is now fully activated.</p>" +
            "            <p>Here's what you can do with SpendWise:</p>" +
            "            <div class='feature'>" +
            "                <h3>💰 Track Expenses</h3>" +
            "                <p>Record and categorize all your expenses with ease.</p>" +
            "            </div>" +
            "            <div class='feature'>" +
            "                <h3>📊 View Insights</h3>" +
            "                <p>Get detailed reports and analytics of your spending patterns.</p>" +
            "            </div>" +
            "            <div class='feature'>" +
            "                <h3>🎯 Set Budgets</h3>" +
            "                <p>Create budgets and stay in control of your finances.</p>" +
            "            </div>" +
            "            <p style='margin-top: 25px;'>You can now log in and start managing your finances. Happy tracking!</p>" +
            "            <p>Best regards,<br>The SpendWise Team</p>" +
            "        </div>" +
            "        <div class='footer'>" +
            "            <p>&copy; 2026 SpendWise. All rights reserved.</p>" +
            "            <p>This is an automated message, please do not reply to this email.</p>" +
            "        </div>" +
            "    </div>" +
            "</body>" +
            "</html>";
    }

    /**
     * Build HTML content for password reset email
     */
    private String buildPasswordResetEmailHtml(String firstName, String resetLink) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
            "    <style>" +
            "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }" +
            "        .container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
            "        .header { background: linear-gradient(135deg, #6c63ff, #38ef7d); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }" +
            "        .header h1 { margin: 0; font-size: 28px; }" +
            "        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }" +
            "        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #6c63ff, #38ef7d); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }" +
            "        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }" +
            "        .warning { background: #fff3cd; padding: 10px; border-radius: 5px; margin: 15px 0; font-size: 12px; color: #856404; }" +
            "    </style>" +
            "</head>" +
            "<body>" +
            "    <div class='container'>" +
            "        <div class='header'>" +
            "            <h1>🔐 Reset Password</h1>" +
            "        </div>" +
            "        <div class='content'>" +
            "            <p>Hi <strong>" + firstName + "</strong>,</p>" +
            "            <p>We received a request to reset your SpendWise password. Click the button below to create a new password:</p>" +
            "            <div style='text-align: center;'>" +
            "                <a href='" + resetLink + "' class='button'>Reset Password</a>" +
            "            </div>" +
            "            <p>Or copy and paste this link in your browser:</p>" +
            "            <p style='word-break: break-all; background: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px;'>" + resetLink + "</p>" +
            "            <div class='warning'>" +
            "                <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this, your account may be compromised. Please change your password immediately or contact support." +
            "            </div>" +
            "            <p>Best regards,<br>The SpendWise Team</p>" +
            "        </div>" +
            "        <div class='footer'>" +
            "            <p>&copy; 2026 SpendWise. All rights reserved.</p>" +
            "            <p>This is an automated message, please do not reply to this email.</p>" +
            "        </div>" +
            "    </div>" +
            "</body>" +
            "</html>";
    }

}
