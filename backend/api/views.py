import json
from celery.result import AsyncResult
from django.shortcuts import render
from django.contrib.auth.models import User

from backend.job import start_scheduler, stop_scheduler, check_task_status
from .serializers import UserSerializer,longLivedTokenSerializer, optimizationResultSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny
from .models import longLivedToken, optimizationResult
import requests
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from api.optimizationModel import optimizeElectricityPrices


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    

class saveOptimizationResult(generics.ListCreateAPIView):
    serializer_class = optimizationResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return optimizationResult.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class DeleteAllOptimizationResults(generics.DestroyAPIView):
    serializer_class = optimizationResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return optimizationResult.objects.filter(author=user)

class LongLivedTokenListCreate(generics.ListCreateAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return longLivedToken.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class LongLivedTokenDelete(generics.DestroyAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return longLivedToken.objects.filter(author=user)
    
class showMyDevices(generics.ListAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        token = self.kwargs['pk']
        headers = {
            "Authorization": "Bearer "+token,
            "content-type": "application/json",
        }
        devices = []
        all_entities = requests.get("http://homeassistant.local:8123/api/states", headers=headers).json()
        for device in all_entities:
            domain = device['entity_id'].split('.')[0]
            if domain in ['light', 'switch', 'media_player', 'climate','camera']:
                devices.append(device)
        return Response(devices)

@method_decorator(csrf_exempt, name='dispatch')
class StartTaskView(generics.ListAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        workingTimes = request.data['workingTime']
        token=request.data['token']
        optimizationOutput=optimizeElectricityPrices(r'C:\Users\ivanc\Radna površina\ZavrsniRad\DA.xlsx',workingTimes)
        url = "http://homeassistant.local:8123/api/services/homeassistant/"
        headers = {
            "Authorization": "Bearer "+token,
            "content-type": "application/json",
        }
        start_scheduler(optimizationOutput,headers,url)
        return JsonResponse(optimizationOutput)

    def get(self, request, *args, **kwargs):
        stop_scheduler()
        return Response("Scheduler stopped!")
    
class CheckTaskStatus(generics.ListAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        value=check_task_status()
        return Response(value)

class TurnOnDevice(generics.ListAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        token=request.data['token']
        entityId=request.data['entity_id']
        url = "http://homeassistant.local:8123/api/services/homeassistant/turn_on"
        headers = {
            "Authorization": "Bearer "+token,
            "content-type": "application/json",
        }
        data = {
            "entity_id": entityId
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))
        return Response(response.json())
        
class TurnOffDevice(generics.ListAPIView):
    serializer_class = longLivedTokenSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        print(request.data)
        token=request.data['token']
        entityId=request.data['entity_id']
        url = "http://homeassistant.local:8123/api/services/homeassistant/turn_off"
        headers = {
            "Authorization": "Bearer "+token,
            "content-type": "application/json",
        }
        data = {
            "entity_id": entityId
        }
        response = requests.post(url, headers=headers, data=json.dumps(data))
        return Response(response.json())