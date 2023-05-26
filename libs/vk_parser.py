import json

import vk as vk
import pandas as pd


def get_data_from_excel(url):
    csv = pd.read_csv(url).to_json(orient='records')
    json_obj = json.loads(csv)
    return json_obj


class VkParser:
    def __init__(self, token, version='5.131'):
        self.api = vk.API(access_token=token, v=version)

    def get_group_info(self, group_id):
        return self.api.groups.getById(group_id=group_id)[0]

    def get_group_posts(self, owner_id, offset=0, count=100):
        return self.api.wall.get(owner_id=owner_id * -1, offset=offset, count=count)
