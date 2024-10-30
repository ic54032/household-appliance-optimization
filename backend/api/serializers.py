from django.contrib.auth.models import User
from rest_framework import serializers
from .models import longLivedToken
from .models import optimizationResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class longLivedTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = longLivedToken
        fields = ["id", "token", "homeAttached", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
    
class optimizationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = optimizationResult
        fields = ["id", "name" , "homeAttached" ,"homeToken", "result", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}