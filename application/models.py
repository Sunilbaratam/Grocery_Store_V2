from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


class RolesUsers(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    # role_id = db.Column(db.String, db.ForeignKey('role.id'))
    # role = db.relationship('Role')
    roles = db.relationship('Role', secondary='roles_users',
                            backref=db.backref('users', lazy='dynamic'))


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True) 
    description = db.Column(db.String(255))


class Category(db.Model):
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(20), unique=True, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class Product(db.Model):
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(20), nullable=False)
    # product_mdate = db.Column(db.Date, nullable=False)
    # product_edate = db.Column(db.Date, nullable=False)
    product_cost = db.Column(db.Integer, nullable=False)
    product_stock = db.Column(db.Integer, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)
    category = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class orders(db.Model):
    order_id = db.Column(db.Integer, primary_key=True)
    order_name = db.Column(db.String(20), nullable=False)
    order_value = db.Column(db.Integer, nullable=False)
    order_quantity = db.Column(db.Integer, nullable=False)
    order_total = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
