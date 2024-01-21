from flask import Flask
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from flask_security import SQLAlchemyUserDatastore, Security
from application.security import datastore
from application.worker import celery_init_app
import flask_excel as excel
from application.instances import cache
from celery.schedules import crontab
from application.tasks import daily_reminder, monthly_report

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    # datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    return app, datastore


app, datastore = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=22, minute=24),
        daily_reminder.s('sunil6@gmail.com', 'Daily Reminder')
        )
    
@celery_app.on_after_configure.connect
def send_email_1(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=22, minute=18, day_of_month=17),
        monthly_report.s('sunil6@gmail.com', 'Monthly Report')
        )
    


if __name__ == '__main__':
    app.run(debug=True)
