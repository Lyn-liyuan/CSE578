
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.cluster import AgglomerativeClustering
import scipy.cluster.hierarchy as sch
from scipy.cluster.hierarchy import fcluster

import json

def convert_currency(var):
    new_value = var.replace(",","").replace("%","").replace("-","0")

    return float(new_value)

df=pd.read_csv('10yearAUSOpenMatches.csv',header=0,skiprows=0,sep=',')
df=df[(df['round']=='semi') | (df['round']=='Final') | (df['round']=='quarter') | (df['round']=='Fourth')]
df['firstServe1'] = df['firstServe1'].apply(convert_currency)
df['return1'] = df['return1'].apply(convert_currency)
df['break1'] = df['break1'].apply(convert_currency)
group = df.groupby('winner')
first_serve = group['firstServe1'].mean()
ace = group['ace1'].mean()
rt = group['return1'].mean()
bk = group['break1'].mean()
stat = pd.concat([first_serve,ace,rt,bk],axis=1)

linkage = sch.linkage(stat, method ='complete',metric='euclidean')

data  = []
keys = stat.index.values
n = len(keys)
obj1 = {}
obj2 = {}
for i,row in enumerate(linkage):
    key1 = int(row[0])
    id1 = str(key1) if key1>=n else keys[key1]
    obj1 = {"id":id1,"name":id1,"parent":str(n+i)}
    key2 = int(row[1])
    id2 = str(key2) if key2>=n else keys[key2]
    obj2 = {"id":id2,"name":id2,"parent":str(n+i)}
    data.append(obj1)
    data.append(obj2)
root = {"id":obj2['parent'],"name":obj2['parent'],"parent":None}
data.append(root)
js = json.dumps(data)
print(js)


