import numpy as np 
import pandas as pd
import csv
# from sqlalchemy  import create_engine
from datetime import datetime

# import sqlite3
ls=[]
# engine = create_engine('sqlite:///test.db', echo = True)

# db = create_engine('sqlite:///.db')
# with open('Rate_edit.csv', newline='') as csvfile:
#     reader = csv.reader(csvfile)
#     next(reader)
#     for row in reader:
#         print(row[0])
#         if(row[0]=='2016'):
#             ls.append(row)
#         break 


# with open('Rate_2016.csv','w',newline='') as result_file:
#     wr = csv.writer(result_file, dialect='excel',delimiter=',')
#     wr.writerows(ls)
#     # for item in ls:
    #     wr.writerow(item)
    
# result_file.close()


# ## data preprocessing on rate 2016 

# with open('Rate_2016.csv', newline='') as csvfile:
#     reader = csv.reader(csvfile)
#     next(reader)
#     for row in reader:
        

rate_2016_df = pd.read_csv('Rate_2016.csv',keep_default_na= False)
print("read")
new_df = pd.DataFrame(columns = list(rate_2016_df.columns))
date1 = pd.to_datetime(rate_2016_df['RateEffectiveDate'])

date2 = pd.to_datetime(rate_2016_df['RateExpirationDate'])

# print(rate_2016_df['RateEffectiveDate'] - rate_2016_df['RateExpirationDate'])
rate_2016_df['diff_years'] = (date2- date1)
rate_2016_df['diff_years']=rate_2016_df['diff_years']/np.timedelta64(1,'M')
# rate_2016_df['diff_years'] =rate_2016_df['diff_years'].to_numeric()

# cleaning for time based payment 

plan_ids = (rate_2016_df.PlanId.unique()).tolist()
ages= (rate_2016_df.Age.unique()).tolist()

for plan in plan_ids:
    for age in ages:
        flag= False
        df_plan = rate_2016_df[(rate_2016_df['PlanId']==plan) & (rate_2016_df['Age']==age)]
        if  len(df_plan):
            for i in range(len(df_plan)):
                # print(df_plan['diff_years'])
                if df_plan['diff_years'].iloc[i] >= 11:
                    flag = True
                    print("yes")
                    # print(df_plan.iloc[i])
                    new_df.append(df_plan.iloc[i],ignore_index=True)
                    break
            
            if not flag :
                # print("Age" , age, plan)
                # print(df_plan)
                df_plan_copy = df_plan.iloc[0]
                df_plan_copy['IndividualRate'] = pd.to_numeric(df_plan['IndividualRate']).mean()
                # print("done")
                df_plan_copy['IndividualTobaccoRate'] =  pd.to_numeric(df_plan['IndividualTobaccoRate']).mean()
                df_plan_copy['Couple'] = pd.to_numeric(df_plan['Couple']).mean()
                df_plan_copy['PrimarySubscriberAndOneDependent'] =  pd.to_numeric(df_plan['PrimarySubscriberAndOneDependent']).mean()
                df_plan_copy['PrimarySubscriberAndTwoDependents'] = pd.to_numeric(df_plan['PrimarySubscriberAndTwoDependents']).mean()
                df_plan_copy['PrimarySubscriberAndThreeOrMoreDependents'] =  pd.to_numeric(df_plan['PrimarySubscriberAndThreeOrMoreDependents']).mean()
                df_plan_copy['CoupleAndOneDependent'] = pd.to_numeric(df_plan['CoupleAndOneDependent']).mean()
                df_plan_copy['CoupleAndTwoDependents'] = pd.to_numeric(df_plan['CoupleAndTwoDependents']).mean()
                df_plan_copy['CoupleAndThreeOrMoreDependents'] = pd.to_numeric(df_plan['CoupleAndThreeOrMoreDependents']).mean()
                new_df.append(df_plan_copy,ignore_index=True)

        flag = False
            

new_df.to_csv('rate_cleaned.csv')


