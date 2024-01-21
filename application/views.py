from flask import current_app as app, jsonify, request, render_template, session, send_file
from flask_security import auth_required, roles_required, current_user
from .models import User, db, Product, Category, orders
from .security import datastore
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from flask_restful import marshal, fields
from flask_restful import Resource, Api, reqparse, marshal_with, fields
import flask_excel as excel
from .tasks import create_resource, say_hello, resource, users_download, categories_download

@app.get('/')
def home():
    return render_template('index.html')


@app.get('/admin')
@auth_required('token')
@roles_required('admin')
def admin():
    return "hello admin"


@app.get('/activate/manager/<int:manager_id>')
@auth_required('token')
@roles_required('admin')
def admin_u(manager_id):
    manager = User.query.get(manager_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({'message': 'manager not found'}), 404

    manager.active = True
    db.session.commit()
    return jsonify({"message": "User activated"})


# @app.post('/user-login')
# def user_login():
#     data = request.get_json()
#     email = data.get('email')
#     if not email:
#         return jsonify({"message": "enter email"}), 400

#     user = datastore.find_user(email=email)

#     if not user:
#         return jsonify({"message": "User not found"}), 400

#     if check_password_hash(user.password, data.get("password")):
#         return user.get_auth_token()
#     else:
#         return jsonify({"message": "wrong password"}), 400

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
    else:
        return jsonify({"message": "Wrong Password"}), 400

 
@app.post('/register')
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if role == 'manager':
        if not datastore.find_user(email=email):
            datastore.create_user(email=email, password=generate_password_hash(
                password), roles=[role], active=False)
            db.session.commit()
            return {'status': 'success', 'message': 'Account updated successfully !!'}, 200
    else:
        if not datastore.find_user(email=email):
            datastore.create_user(
                email=email, password=generate_password_hash(password), roles=[role])
            db.session.commit()

            return {'status': 'success', 'message': 'Account updated successfully !!'}, 200
    return {"message": "Already Registered"}, 200


@app.get('/users')
@auth_required('token')
@roles_required('admin')
def users():
    query = User.query
    k = False
    query = query.filter_by(active=k)
    users = query.all()
    print(users)
    print(query)
    l = [{'id': user.id, 'email': user.email, 'username': user.username, 'active': user.active}
         for user in users]
    return jsonify(l)


user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'active': fields.Boolean
}


@app.get('/getusers')
@auth_required("token")
@roles_required("admin")
def get_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User found"}), 404
    print(users)
    return marshal(users, user_fields)


@app.put('/add_cart/<int:product_id>')
@auth_required("token")
def add_cart(product_id):
    parser_3 = reqparse.RequestParser()
    parser_3.add_argument("quantity", type=int, help="quantity", required=True)
    args = parser_3.parse_args()
    prod = Product.query.get(product_id)
    if not prod:
        return {"message": "Product not found"}, 404
    quantity = args.quantity

    if 'cart' not in session:
        session['cart'] = []
    details = {
        'id': prod.product_id,
        'name': prod.product_name,
        'cost': prod.product_cost,
        'quantity': quantity,
        'total_cost': prod.product_cost*quantity,
        'category': prod.category
    }

    for each in session['cart']:
        if prod.product_name == each['name']:
            each['quantity'] += quantity
            each['total_cost'] += prod.product_cost*quantity
            updated_stock = prod.product_stock - quantity
            prod.product_stock = updated_stock
            db.session.commit()
            session.modified = True
            print(session['cart'])
            return {"message": "Added to cart"}, 200

    session['cart'].append(details)
    updated_stock = prod.product_stock - quantity
    prod.product_stock = updated_stock
    db.session.commit()
    session.modified = True
    print(session['cart'])
    return {"message": "Added to cart"}, 200




cart_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'cost': fields.Integer,
    'category': fields.String,
    'quantity': fields.Integer,
    'total_cost': fields.Integer

}


@app.get('/view_cart')
@marshal_with(cart_fields)
@auth_required("token")
def view_cart():
    if 'cart' in session:
        cart = session['cart']

        print(cart)

        return (cart)
    else:
        return {"message": "You haven't add any product"}


@app.delete('/delete_cart/<int:product_id>')
@auth_required('token')
def delete_cart(product_id):
    if 'cart' in session:
        prod = Product.query.get(product_id)
        for each in session['cart']:
            if each['name'] == prod.product_name:
                k = each['quantity']
                prod = Product.query.get(product_id)
                prod.product_stock += k
                session['cart'].remove(each)
                db.session.commit()
                session.modified = True
                return {"message": "Item was removed from the cart"}
            
@app.get('/receipt')
@auth_required('token')
@roles_required('user')
def receipt():
    if 'cart' in session:
        for each in session['cart']:
            pname = each['name']
            cost = each['cost']
            quantity = each['quantity']
            total_price =each['total_cost']
        
            order=orders(user_id=current_user.id,order_name=pname,order_value=cost,order_quantity=quantity,order_total=total_price)
            db.session.add(order)
            db.session.commit()    
            session['cart'] =[]
            session.modified=True
        cart=session['cart']
        return jsonify({"message" : "order is created"}), 200
    else:
        return jsonify({"message" : "Add the products"}), 404

    


@app.get('/sum')
@auth_required('token')
def sum():
    sum = 0
    if 'cart' not in session:
        sum = 0
    for each in session['cart']:
        sum = sum + each['total_cost']
    return {"total_sum": sum}


@app.get('/activate/category/<int:category_id>')
@auth_required('token')
@roles_required('admin')
def approve_category(category_id):
    manager = Category.query.get(category_id)
    manager.is_approved = True
    db.session.commit()
    return jsonify({"message": "Category activated"})






@app.get('/download-csv') 
def download_csv():
    task = create_resource.delay()
    return jsonify({"task-id" : task.id})
    
# celery -A main:celery_app worker --loglevel INFO


from celery.result import AsyncResult

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message" : "Task Pending"}), 404


@app.get('/download-users')
def download_users():
    task = users_download.delay()
    return jsonify({"task-id" : task.id})

@app.get('/download-categories')
def download_categories():
    task = categories_download.delay()
    return jsonify({"task-id" : task.id})


    

@app.get('/sayhello')
def say_view():
    res = say_hello.delay()
    return jsonify({"task_id" : res.id})

@app.get('/csv')
def down():
    product = Product.query.with_entities(Product.product_name, Product.category).all()
    output = excel.make_response_from_query_sets(product, column_names=["category", "product_name"], file_type="csv")
    return output
    
@app.get('/resource')
def resource_1():
    res = resource.delay()
    return jsonify({"task_id": res.id})


#celery -A main:celery_app worker --loglevel INFO -P gevent


#celery -A main:celery_app beat -l INFO
