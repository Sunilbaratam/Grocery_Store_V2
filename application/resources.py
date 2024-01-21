from flask_restful import Resource, Api, reqparse, marshal_with, fields
from .models import Product, Category, db
from flask_security import auth_required, roles_required, current_user
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
#from .instances import cache

api = Api(prefix='/api')

parser = reqparse.RequestParser()
parser.add_argument('product_name', type=str,
                    help='it will be in string', required=True)
parser.add_argument('product_cost', type=int,
                    help='it will be in integer', required=True)
parser.add_argument('product_stock', type=int,
                    help='it will be in integer', required=True)
parser.add_argument('category', type=str,
                    help='it will be in string', required=True)


product_fields = {
    'product_id': fields.Integer,
    'product_name': fields.String,
    'product_cost': fields.Integer,
    'product_stock': fields.Integer,
    'category': fields.String,
    'is_approved': fields.Boolean
}

category_fields = {
    'category_id': fields.Integer,
    'category_name': fields.String,
    'is_approved': fields.Boolean
}


class Products(Resource):
    @marshal_with(product_fields)
    @auth_required("token")
    def get(self):
        all_products = Product.query.all()
        print(all_products)
        # print(current_user.)
        return all_products

    @auth_required('token')
    @roles_required('manager')
    def post(self):
        args = parser.parse_args()
        prod = Product(product_name=args.get('product_name'), product_cost=args.get(
            'product_cost'), product_stock=args.get('product_stock'), user_id=current_user.id, category=args.get('category'))
        db.session.add(prod)
        db.session.commit()
        return {"message": "Product is created"}

    @auth_required('token')
    @roles_required('manager')
    def put(self, product_id):
        parser_2 = reqparse.RequestParser()
        parser_2.add_argument('updatedCost', type=float,
                              help='Cost of the product')
        parser_2.add_argument('updatedStock', type=int,
                              help='Stock of the product')
        parser_2.add_argument('updatedCategory', type=str,
                              help='Category of the product')

        args = parser_2.parse_args()
        cost = args.get('updatedCost')
        stock = args.get('updatedStock')
        cat = args.get('updatedCategory')
        product = Product.query.get(product_id)
        if cost:
            product.product_cost = cost
            db.session.commit()
            return {"message": "Product is updated"}
        if stock:
            product.product_stock = stock
            db.session.commit()
            return {"message": "Product is updated"}
        if cat:
            product.category = cat
            db.session.commit()
            return {"message": "Product is updated"}

    @auth_required('token')
    @roles_required('manager')
    def delete(self, product_id):
        prod = Product.query.get(product_id)
        db.session.delete(prod)
        db.session.commit()
        return {"message": "Product is deleted"}


class Categories(Resource):
    @marshal_with(category_fields)
    @auth_required('token')
    def get(self):
        all_categories = Category.query.all()
        return all_categories

    @auth_required('token')
    @roles_required('admin')
    def post(self):
        parser_1 = reqparse.RequestParser()
        parser_1.add_argument("category_name", type=str,
                              required=True, help="its name")
        args = parser_1.parse_args()
        category = Category(category_name=args.get(
            'category_name'), is_approved = True, user_id=current_user.id)
        db.session.add(category)
        db.session.commit()
        return {"message": "category Created"}

    @auth_required('token')
    @roles_required('admin')
    def put(self, category_id):
        parser_3 = reqparse.RequestParser()
        parser_3.add_argument("updatedCategory", type=str,
                              help="name of the category")
        args = parser_3.parse_args()
        category = Category.query.get(category_id)
        name = args.updatedCategory
        if name:
            category.category_name = name
            db.session().commit()
            return {"message": "Category Updated"}

    @auth_required('token')
    @roles_required('admin')
    def delete(self, category_id):
        cat = Category.query.get(category_id)
        db.session.delete(cat)
        db.session.commit()
        return {"message": "Category is deleted"}
    
    
        
class Manager(Resource) :
    @auth_required('token')
    @roles_required('manager')
    def post(self):
        parser_1 = reqparse.RequestParser()
        parser_1.add_argument("category_name", type=str,
                              required=True, help="its name")
        args = parser_1.parse_args()
        category = Category(category_name=args.get(
            'category_name'), user_id=current_user.id)
        db.session.add(category)
        db.session.commit()
        return {"message": "category Created"}
    
    @auth_required('token')
    @roles_required('manager')
    def put(self, category_id):
        parser_3 = reqparse.RequestParser()
        parser_3.add_argument("updatedCategory", type=str,
                              help="name of the category")
        args = parser_3.parse_args()
        category = Category.query.get(category_id)
        name = args.updatedCategory
        if name:
            category.category_name = name
            category.is_approved = False
            db.session().commit()
            return {"message": "Category Updated"}



api.add_resource(Products, '/product', '/product/<int:product_id>')
api.add_resource(Categories, '/category', '/category/<int:category_id>')
api.add_resource(Manager, '/manager', '/manager/<int:category_id>')
