import numpy as np
import pandas as pd
import csv
from sqlalchemy  import create_engine
from datetime import datetime
'''
Change filename variable as per the directory or filepath of your Benefits cost file
'''
def preprocess_quality(filename):
    '''
    Input :
    Quality filename directory

    Output:
    Columns with entries with string datatype are converted to float and empty fields,N/A fields are imputed with 0.00 value

    '''

    column_list = ['Claims_Received', 'Claims_Denials', 'Internal_Appeals Filed',
       'Number_Internal_Appeals_Overturned',
       'Percent_Internal_Appeals_Overturned', 'External Appeals Filed',
       'Number_External_Appeals_Overturned',
       'Percent_External_Appeals_Overturned']
    df = pd.read_csv(filename,encoding = "utf-8")
    df_copy = df.copy()
    print("Reading File")
    df_copy.replace('^\*+$', np.nan, regex=True,inplace =True)
    df_copy.replace(r'\D+', '',regex=True ,inplace = True)
    df_copy.fillna(0,inplace=True)

    for cols in column_list :
        df_copy[cols]= pd.to_numeric(df_copy[cols],errors='coerce')
    df_copy.to_csv('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/quality_clean.csv', index=False)
    print("Done")

if __name__ == "__main__":


    df = pd.read_csv('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/quality_clean.csv', index=False)
    # Optional, set your indexes to get Primary Keys
    # df = df.set_index(['COL A', 'COL B'])

    engine = create_engine('mysql://user:pass@host/db', echo=False)

    df.to_sql(quality, engine, index=False)
    # preprocess_quality('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/quality.csv')
