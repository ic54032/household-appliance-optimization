import atexit
from django_apscheduler.jobstores import DjangoJobStore, register_events
from apscheduler.schedulers.background import BackgroundScheduler,BlockingScheduler
from datetime import datetime
import requests

def my_job(result,headers,url):
    print("Job started!")
    current_time = int(datetime.now().strftime("%M"))
    for device in result:
        next_state=result[device][current_time]
        data={"entity_id": device}
        print(data)
        if(next_state==0):
            requests.request("Post",url+"turn_off", headers=headers,json=data)
        else:
            requests.request("Post",url+"turn_on", headers=headers,json=data)

scheduler = BackgroundScheduler()

def start_scheduler(result,headers,url):
    scheduler.remove_all_jobs()
    scheduler.add_job(my_job, 'cron', minute='*',id='job', args=[result, headers, url],replace_existing=True)
    if not scheduler.running:
        scheduler.start()
    print("Scheduler started!")
    
def stop_scheduler():
    scheduler.remove_all_jobs()
    print("Scheduler stopped!")
    
def check_task_status():
    jobs = scheduler.get_jobs()
    for job in jobs:
        if job.id == 'job':
            return True
    else:
        return False

