import sys, time, random
from locust import HttpUser, task, between


class MyUser(HttpUser):
    
    wait_time = between(0.5, 1)

    @task
    def open(self):
        # generate a random postid between 1 and 500
        postid = random.randint(1, 500)
        self.client.get('/blog/cs144/' + str(postid), name = "/blog/cs144")