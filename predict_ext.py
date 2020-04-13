#!/usr/bin/env python

'''
Preprocessing :
'''
import csv
import  pandas as pd
import numpy as np


def remove_null_dental_col(filename):
    '''
    Input :
    Network provider filename directory
    Output:
    Columns with Null entries for DentalOnlyPlan Header are populated with "Yes" or "No"
    You may add or remove arguments as necessary; include a description in the README.
    '''
    network_df = pd.read_csv(filename,keep_default_na = False)
    print("Reading File")
    dental_df = network_df["DentalOnlyPlan"]
    for i in range(len(dental_df)) :
        if not len(dental_df[i]):
            if "Dental" in network_df["NetworkName"][i] :
                dental_df[i] = "Yes"
            else:
                dental_df[i] = "No"
    network_df.to_csv(filename)
    print("Done")
if __name__=="__main__":
    remove_null_dental_col('Network_sample.csv')