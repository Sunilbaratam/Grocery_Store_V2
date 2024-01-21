from main import app
from application.security import datastore
from application.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

with app.app_context():
    db.create_all()
    # admin = Role(id='admin', name='Admin', description='Admin Description')
    # db.session.add(admin)
    # manager = Role(id='manager', name='Manager',
    #                description='Manager Description')
    # db.session.add(manager)
    # user = Role(id='user', name='User', description='User Description')
    # db.session.add(user)
    # try:
    #     db.session.commit()
    # except:
    #     pass
    datastore.find_or_create_role(name='admin', description='User is admin')
    datastore.find_or_create_role(
        name='manager', description='User is manager')
    datastore.find_or_create_role(name='user', description='User')
    if not datastore.find_user(email='admin@email.com'):
        datastore.create_user(email='admin@email.com',
                              password=generate_password_hash('admin'), roles=["admin"])
    if not datastore.find_user(email='manager@email.com'):
        datastore.create_user(email='manager@email.com',
                              password=generate_password_hash('manager'), roles=["manager"], active=False)
    if not datastore.find_user(email='user@email.com'):
        datastore.create_user(email='user@email.com',
                              password=generate_password_hash('user'), roles=["user"])
    db.session.commit()
