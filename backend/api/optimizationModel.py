import pandas as pd
from gurobipy import *

def optimizeElectricityPrices(filePath,optimizationDevices:dict):
    data = pd.read_excel(filePath, sheet_name='Sheet1')
    pricesOfElectricityByHour = data.to_numpy()[:,1]

    time = 24

    m = Model('Electricity prices')    

    device_vars = {device: m.addVars(24,vtype=GRB.BINARY, name=device) for device in optimizationDevices}
    
    total_cost=quicksum(
    pricesOfElectricityByHour[i]*device_vars[device][i]*1 for device in optimizationDevices for i in range(time)
    )
    m.setObjective(total_cost)
    
    print(optimizationDevices)

    for device in optimizationDevices:
        m.addConstr(quicksum(device_vars[device][i] for i in range(time)) >= optimizationDevices[device]) 
 
    m.optimize()

    #rezultat se interpretira tako da je sat=indeks+1, npr. na indeksu 0 se nalazi cijena struje u 01:00
    
    
    result={device: [int(device_vars[device][i].x) for i in range(time)] for device in optimizationDevices}
    return(result)
