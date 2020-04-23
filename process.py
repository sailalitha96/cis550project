import numpy as np
import pandas as pd
import csv
# from sqlalchemy  import create_engine
from datetime import datetime


def combine_rate(file1, file2, file3):
    rating_1 = pd.read_csv(file1, keep_default_na=True)

    rating_2 = pd.read_csv(file2, keep_default_na=True)
    rating_3 = pd.read_csv(file3, keep_default_na=True)
    #
    frames = [rating_1.iloc[:, :12], rating_2.iloc[:, :12], rating_1.iloc[:, :12]]
    final_df = pd.concat(frames, axis=0)
    col_frames1 = [rating_1.iloc[:, 12:21].reset_index(drop=True),
                   0 * rating_2.iloc[:, 12:21].reset_index(drop=True),
                   0 * rating_3.iloc[:, 12:21].reset_index(drop=True)]
    col_frames2 = [0 * rating_1.iloc[:, 12:21].reset_index(drop=True),
                   rating_2.iloc[:, 12:21].reset_index(drop=True),
                   0 * rating_3.iloc[:, 12:21].reset_index(drop=True)]
    col_frames3 = [0 * rating_1.iloc[:, 12:21].reset_index(drop=True),
                   0 * rating_2.iloc[:, 12:21].reset_index(drop=True),
                   rating_3.iloc[:, 12:21].reset_index(drop=True)]

    rating_1_col_df = pd.DataFrame(np.concatenate(col_frames1), columns=rating_1.columns[12:21])
    rating_2_col_df = pd.DataFrame(np.concatenate(col_frames2), columns=rating_2.columns[12:21])
    rating_3_col_df = pd.DataFrame(np.concatenate(col_frames3), columns=rating_3.columns[12:21])

    col_df_combined = pd.concat([rating_1_col_df, rating_2_col_df, rating_3_col_df], axis=1)
    print(col_df_combined.shape)
    # col_df_combined.to_csv("C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Column_check.csv")
    # print(rating_1_col_df.shape)
    Rate_df = pd.concat([final_df.reset_index(drop=True), col_df_combined.reset_index(drop=True)], axis=1)
    Rate_df.replace('', 0, inplace=True)
    Rate_df.fillna(0, inplace=True)
    Rate_df.to_csv("C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_2019_database.csv",index = False)
    print("Done")
    pass


# import sqlite3
if __name__ == "__main__":

    # ## data preprocessing on rate 2016
    '''
    Change filename variable as per the directory or filepath of your Rate file
    '''

    filename = 'C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_rating_area_2.csv'
    rate_2016_df = pd.read_csv(filename, keep_default_na=False)
    # print(rate_2016_df.columns)
    print("Read")
    date1 = pd.to_datetime(rate_2016_df['RateEffectiveDate'])

    date2 = pd.to_datetime(rate_2016_df['RateExpirationDate'])

    # print(rate_2016_df['RateEffectiveDate'] - rate_2016_df['RateExpirationDate'])
    rate_2016_df['diff_years'] = (date2 - date1)
    rate_2016_df['diff_years'] = rate_2016_df['diff_years'] / np.timedelta64(1, 'M')
    # rate_2016_df['diff_years'] = rate_2016_df['diff_years'].to_numeric()
    print("Created Diff")
    # cleaning for time based payment

    plan_ids = (rate_2016_df.PlanId.unique()).tolist()
    ages = (rate_2016_df.Age.unique()).tolist()
    count = 0
    with open('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_clean_area2.csv', 'a') as f:
        header_title = False
        for plan in plan_ids:
            for age in ages:
                print(count)
                count += 1
                flag = False
                df_plan = rate_2016_df[
                    (rate_2016_df['PlanId'] == plan) & (rate_2016_df['Age'] == age)]
                if len(df_plan):
                    for i in range(len(df_plan)):
                        # print(df_plan['diff_years'])
                        if df_plan['diff_years'].iloc[i] >= 11:
                            flag = True
                            # print(df_plan.iloc[i])
                            new_df = pd.DataFrame([df_plan.iloc[i, :]])
                            if f.tell() == 0:
                                header_title = list(rate_2016_df.columns)
                            else:
                                header_title = False
                            new_df.to_csv(f, mode='a', sep=',', header=header_title, index=False)
                            print("Reached flag")
                            break;

                        else :
                            if f.tell() == 0:
                                header_title = list(rate_2016_df.columns)
                            else:
                                header_title = False
                            if df_plan.iloc[i]['IndividualRate'] > 0  and age!='Family Option':
                                print(pd.DataFrame([df_plan.iloc[i, :]]))
                                pd.DataFrame([df_plan.iloc[i,:]]).to_csv(f, mode='a', sep=',', header=header_title, index=False)
                                break;
                            elif age=='Family Option' :
                                pd.DataFrame(df_plan.iloc[:1]).to_csv(f, mode='a', sep=',', header=header_title,index=False)
                                break;
                        print("Reached non flag")

    file_1 = 'C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_clean_area1.csv'
    file_2 = 'C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_clean_area2.csv'
    file_3 = 'C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Rate_clean_area3.csv'
    combine_rate(file_1, file_2, file_3)