import numpy as np
import pandas as pd
import csv
# from sqlalchemy  import create_engine
from datetime import datetime

# import sqlite3
if __name__ == "__main__":
    '''
    Change filename variable as per the directory or filepath of your Benefits cost file
    '''
    def preprocess_benefits(filename):
        '''
        Input :
        Benefits Cost sharing filename directory

        Output:
        Columns with entries with string datatype are converted to float and empty fields are imputed with 0.00 value
        (Coinsurace,Copay,CoinsuranceOutofNet are converted in this manner)
        '''
        column_list = ['CopayInnTier1','CopayInnTier2', 'CopayOutofNet', 'CoinsInnTier1', 'CoinsInnTier2','CoinsOutofNet']
        df = pd.read_csv(filename,encoding="latin1")
        df_copy = df.copy()
        print("Reading File")
        # date1 = pd.to_datetime(rate_2016_df['CoinsInnTier1'])
        for cols in column_list :
            df_copy[cols] = df[cols].str.replace('([A-Za-z]+)', '')
            if 'Copay' in cols :
                df_copy[cols] = df_copy[cols].str.replace('$', '')
            else:
                df_copy[cols] = df_copy[cols].str.replace('%','')

            df_copy.loc[df_copy[cols].isna(),cols] = 0.00
            df_copy[cols]= pd.to_numeric(df_copy[cols],errors='coerce')
            df_copy.loc[df_copy[cols].isna(), cols] = 0.00
            print("Done column",cols)
        df_copy.to_csv('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Benefits_clean.csv', index=False)
        print("Done")
        #

    if __name__ == "__main__":
        preprocess_benefits('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Benefits_Cost_Sharing_PUF.csv')
