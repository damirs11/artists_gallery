from flask import Flask, send_from_directory, request, Blueprint
from flask_caching import Cache
from flask_cors import CORS
from flask_restful import Api

from vk_parser import VkParser, get_data_from_excel

config = {
    "DEBUG": True,  # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__, static_url_path='', static_folder='../client/build')
app.config.from_mapping(config)
cache = Cache(app)
CORS(app)
flask_api = Api(app)


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


api = Blueprint('api', __name__)
VkParser = VkParser('c26d2991c26d2991c26d2991f3c17927aecc26dc26d2991a60cd8abe81ca440d482ce3e')


@api.get("getGroupInfo")
def get_group_info():
    args = request.args
    return VkParser.get_group_info(args.get('id'))


@api.get("getGroupPosts")
def get_group_posts():
    args = request.args
    arg_id = args.get('id')

    if cache.has(arg_id):
        return cache.get(arg_id)

    print("TRIGGERED")

    group_info = VkParser.get_group_info(args.get('id'))
    group_posts = VkParser.get_group_posts(group_info['id'])
    cache.set(arg_id, group_posts)

    return group_posts


@api.get("getExcelData")
def get_excel_data():
    if cache.has('excel'):
        return cache.get('excel')

    result = get_data_from_excel('https://docs.google.com/spreadsheets/d/e/2PACX-1vRVSArj7x2n4plBLaGd6MK6JadaD'
                               '-RCuzYHRVn5HlTyAvw00frx8vi3hxk5MC04IpQWwfphfQjGH9e_/pub?gid=68999889&single=true'
                               '&output=csv')
    cache.set('excel', result)

    return result


app.register_blueprint(api, url_prefix='/api/')
