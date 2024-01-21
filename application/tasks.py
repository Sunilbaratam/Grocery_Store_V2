from celery import shared_task
import flask_excel as excel
from .models import Product, User, Role, orders, Category
from .mail_service import send_message
from jinja2 import Template


@shared_task(ignore_result=False)
def create_resource():
    users = Product.query.with_entities(Product.product_name, Product.product_cost, Product.product_stock, Product.category).all()
    csv_output = excel.make_response_from_query_sets(users,["product_name", "product_cost", "product_stock", "category"],"csv")
    filename = "products.csv"
    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    
    return filename


@shared_task(ignore_resul=False)
def say_hello():
    return "say_hello"

@shared_task(ignore_result=False)
def resource():
    product = Product.query.with_entities(Product.product_name, Product.category).all()
    output = excel.make_response_from_query_sets(product, ["product_name", "category"], "csv")
    filename="test_1.csv"

    with open(filename, 'wb') as f:
        f.write(output.data)
    
    return filename

@shared_task(ignore_result=False)
def users_download():
    users = User.query.with_entities(User.email).all()
    output = excel.make_response_from_query_sets(users, ["email"], "csv")
    filename = "users.csv"
    
    with open(filename, 'wb') as f:
        f.write(output.data)
    
    return filename

@shared_task(ignore_result=False)
def categories_download():
    categories = Category.query.with_entities(Category.category_name).all()
    output = excel.make_response_from_query_sets(categories, ["category_name"], "csv")
    filename = "categories.csv"
    
    with open(filename, 'wb') as f:
        f.write(output.data)
    
    return filename



@shared_task(ignore_result=False)
def daily_reminder(to, subject):
    send_message(to, subject, "Visit the app to get best products at affordable price")
    return "OK"
    
@shared_task(ignore_result=False)
def monthly_report(to, subject):
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    for user in users:
        order = orders.query.filter(orders.user_id==user.id).all()
        print(order)
        with open('templates/report.html', 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                         template.render(order))
    return "OK"


#celery_app beat -l INFO                  
