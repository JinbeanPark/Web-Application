import sys, time, random
from locust import HttpUser, task, between


class MyUser(HttpUser):

    wait_time = between(0.5, 1)

    @task
    def open(self):
        # generate a random postid between 1 and 500
        postid = random.randint(1, 500)
        self.client.get('/editor/post?action=open&username=cs144&postid=' + str(postid), name = "/editor/post?action=open")
