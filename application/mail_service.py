from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST ="localhost"
SMTP_PORT = 1025
SENDER_EMAIL = 'sunil6@gmail.com'
SENDER_PASSWORD = '1234'


def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    server = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    server.send_message(msg=msg)
    server.quit()

#send_message('sunil.baratam6@gmail.com', 'test', '<html>Test</html>')

