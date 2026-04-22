# Email Verification Setup Guide

## Overview
The application now sends verification emails to users during registration. This guide explains how to configure email sending for different email providers.

## Email Configuration

### Option 1: Gmail (Recommended for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down and click "2-Step Verification"
3. Follow the prompts to enable 2FA

#### Step 2: Create App Password
1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password

#### Step 3: Update application.properties
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
spring.mail.from=noreply@spendwise.com
app.frontend.url=http://localhost:3000
```

**Important**: Never commit your actual email credentials to version control. Use environment variables instead:
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

Then in properties:
```properties
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

---

### Option 2: Outlook/Office365

```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.from=noreply@spendwise.com
app.frontend.url=http://localhost:3000
```

---

### Option 3: SendGrid (Production Recommended)

#### Step 1: Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com)
2. Navigate to "API Keys" in settings
3. Create a new API key and copy it

#### Step 2: Update application.properties
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=SG.your-sendgrid-api-key
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=noreply@spendwise.com
app.frontend.url=http://localhost:3000
```

---

### Option 4: AWS SES (Amazon Simple Email Service)

#### Step 1: Set up AWS SES
1. Go to [AWS SES Console](https://console.aws.amazon.com/ses)
2. Verify your email address
3. Create SMTP credentials
4. Note: Verify the sender email address

#### Step 2: Update application.properties
```properties
spring.mail.host=email-smtp.YOUR-REGION.amazonaws.com
spring.mail.port=587
spring.mail.username=your-smtp-username
spring.mail.password=your-smtp-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.from=verified-email@yourdomain.com
app.frontend.url=http://localhost:3000
```

---

## Email Flow Diagram

```
User Registration
       ↓
   Validation
       ↓
   Create User (with verification token)
       ↓
   Send Verification Email ← EmailService
       ↓
User Receives Email with Link (email contains token)
       ↓
User Clicks Verification Link
       ↓
Frontend: /verify-email?token=xxx
       ↓
Backend: POST /api/auth/verify-email (validates token)
       ↓
User Email Verified ✓
       ↓
Send Welcome Email
       ↓
User Can Now Login
```

---

## Email Templates

### 1. Verification Email
- Sent immediately after registration
- Contains verification link valid for 24 hours
- Button to verify email
- Alternative link text for copy-paste

### 2. Welcome Email
- Sent after email verification
- Explains app features
- Encourages user to log in
- Shows what they can do

### 3. Password Reset Email (Future)
- Reset link valid for 1 hour
- Clear security warning
- Instructions to change password

---

## Testing Email Configuration

### Method 1: Using Gmail App Password (Development)
```
Username: your-email@gmail.com
Password: [16-character app password]
Email: your-email@gmail.com
```

### Method 2: Using MailHog (Local Testing - No Real Email)
```properties
spring.mail.host=localhost
spring.mail.port=1025
spring.mail.username=
spring.mail.password=
```

Then run MailHog:
```bash
# Download and run MailHog (assumes Go installed)
go get github.com/mailhog/MailHog
mailhog
```

Access UI at: http://localhost:8025

---

## Troubleshooting

### Issue: "Authentication failed"
- **Cause**: Wrong credentials or app password
- **Solution**: 
  - Verify credentials are correct
  - For Gmail, ensure 2FA is enabled
  - Try a new app password

### Issue: "Connection refused"
- **Cause**: Wrong SMTP server or port
- **Solution**:
  - Double-check SMTP host and port
  - Verify provider settings
  - Check firewall/network issues

### Issue: "Email not received"
- **Cause**: Email sent but marked as spam or didn't arrive
- **Solution**:
  - Check spam folder
  - Verify recipient email is correct
  - Check application logs for errors

### Issue: "TLS negotiation failed"
- **Cause**: STARTTLS not properly enabled
- **Solution**:
  - Ensure `starttls.enable=true` in properties
  - Verify port is 587 (not 465)

### Issue: "Email fields in database are NULL"
- **Cause**: Database schema not updated
- **Solution**:
  - Run migrations to add email columns
  - Ensure User model has email fields

### Issue: "Verification token is invalid"
- **Cause**: Token was lost or user clicked old link
- **Solution**:
  - Ask user to register again
  - Implement resend verification option (future enhancement)

---

## Security Best Practices

1. **Never Hardcode Credentials**
   - Use environment variables
   - Use Spring Cloud Config
   - Use AWS Secrets Manager

2. **Use App Passwords**
   - Don't use primary account password
   - Gmail: Use 16-character app password
   - Change periodically

3. **HTTPS Only**
   - Ensure email links use HTTPS in production
   - Update `app.frontend.url` for production

4. **Token Expiration**
   - Verification tokens expire after 24 hours
   - Reset tokens expire after 1 hour
   - Implement token refresh mechanism

5. **Rate Limiting**
   - Implement rate limiting on email sending
   - Prevent email spam/abuse (future feature)

6. **Log Sensitive Data Carefully**
   - Don't log email addresses to console in production
   - Use proper logging configuration

---

## Database Schema

```sql
-- Users table should have:
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255);
```

---

## Production Deployment Checklist

- [ ] Email credentials stored in environment variables
- [ ] SSL certificate installed
- [ ] `app.frontend.url` updated to production URL
- [ ] Email provider verified and account active
- [ ] Sender email address verified with provider
- [ ] Email templates tested with real data
- [ ] Database migrations applied
- [ ] Logging configured (no credential exposure)
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] User documentation created

---

## Email Service Methods

### 1. `sendVerificationEmail(String toEmail, String firstName, String token)`
Sends verification email with link to verify account.

**Example:**
```java
emailService.sendVerificationEmail("john@example.com", "John", "uuid-token");
```

### 2. `sendWelcomeEmail(String toEmail, String firstName, String lastName)`
Sends welcome email after verification.

**Example:**
```java
emailService.sendWelcomeEmail("john@example.com", "John", "Doe");
```

### 3. `sendPasswordResetEmail(String toEmail, String firstName, String token)` (Ready for implementation)
Sends password reset email.

**Example:**
```java
emailService.sendPasswordResetEmail("john@example.com", "John", "reset-token");
```

---

## Frontend Email Verification Flow

The VerifyEmail component handles:
1. Extracting token from URL query parameter
2. Calling backend verification endpoint
3. Displaying success/error message
4. Auto-redirecting to login on success

**URL Format:**
```
http://localhost:3000/verify-email?token=abc123def456
```

---

## Next Steps

1. **Configure Email Provider**: Choose a provider and set up credentials
2. **Update application.properties**: Add email configuration
3. **Test Registration**: Register a new account and check for verification email
4. **Verify Email**: Click link in email to verify
5. **Login**: Use verified account to login

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review application logs
3. Verify email provider settings
4. Test email connectivity
5. Contact email provider support

---

## Configuration File Location

`Backend/src/main/resources/application.properties`

---

## Key Files Modified

- `service/EmailService.java` - Email sending service
- `service/UserService.java` - Updated to call EmailService
- `controller/AuthController.java` - Email verification endpoint
- `components/VerifyEmail.js` - Frontend verification page
- `App.js` - Added verification route
- `application.properties` - Email configuration

---

**Last Updated**: April 22, 2026
**Version**: 1.0
