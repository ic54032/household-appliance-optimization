from django.urls import path
from . import views

urlpatterns = [
path('longLivedToken/', views.LongLivedTokenListCreate.as_view(), name='longLivedTokenList'),
path('longLivedToken/<int:pk>/', views.LongLivedTokenDelete.as_view(), name='longLivedTokenDelete'),
path('showMyDevices/<str:pk>/', views.showMyDevices.as_view(), name='showMyDevices'),
path('task/', views.StartTaskView.as_view(), name='startTask'),
path('checkTask/', views.CheckTaskStatus.as_view(), name='checkTaskStatus'),
path('saveOptimizationResult/', views.saveOptimizationResult.as_view(), name='saveOptimizationResult'),
path('deleteOptimizationResult/<int:pk>/', views.DeleteAllOptimizationResults.as_view(), name='deleteOptimizationResult'),
path('turnOffDevice/', views.TurnOffDevice.as_view(), name='turnOffDevice'),
path('turnOnDevice/', views.TurnOnDevice.as_view(), name='turnOnDevice'),
]