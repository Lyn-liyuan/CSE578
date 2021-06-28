
import pandas as pd
import json

df=pd.read_csv('10yearAUSOpenMatches.csv',header=None,skiprows=0,sep=',')
tree = None
data = []
top_level = {}
cur_level = {}
level = ''

for row in df[df[3]=='2013'].values:
    point  = 0
    for score in row[2].split(" "):
         if score!='ret.':
            point = point + int(score[:1])

    obj =  {'id':row[0]+'-'+row[1],'parent':None,'name':row[1],'round':row[0],'loser':row[6],'point':point,'children':[]}
    
    if row[0]=='Final':
        tree = obj
        data.append(obj)
        cur_level[row[1]]=obj
        cur_level[row[6]]=obj
        continue

    if row[0]!=level:
        top_level = cur_level
        cur_level = {}
        level = row[0]
    
    if row[1] in top_level:
        top = top_level[row[1]]
        obj['parent']=top['id']
        top['children'].append(obj)
        data.append(obj)


    cur_level[row[1]]=obj
    cur_level[row[6]]=obj


js = json.dumps(tree)
print(js)
