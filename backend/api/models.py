from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class longLivedToken(models.Model):
    token = models.CharField(max_length=500)
    homeAttached = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.homeAttached
    
class optimizationResult(models.Model):
    name = models.CharField(max_length=500,default='default_value')
    homeAttached = models.CharField(max_length=100,default='default_value')
    homeToken = models.CharField(max_length=500,default='default_value')
    result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.author.username