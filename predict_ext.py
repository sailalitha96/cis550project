#!/usr/bin/env python

'''
Preprocessing :
'''
import csv
import pandas as pd
import numpy as np
import re


def remove_null_dental_col(filename):
    '''
    Input :
    Network provider filename directory
    Output:
    Columns with Null entries for DentalOnlyPlan Header are populated with "Yes" or "No"
    You may add or remove arguments as necessary; include a description in the README.
    '''
    network_df = pd.read_csv(filename)
    print("Reading File")
    # dental_df = network_df["DentalOnlyPlan"]
    output_file = 'C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/network_clean_2019.csv'
    with open(output_file, 'a') as f:
        header_title = False
        if f.tell() == 0:
            header_title = list(network_df.columns)
        network_df.loc[network_df['DentalOnlyPlan'] == "Yes"].to_csv(f, mode='a', sep=',', header=header_title, index=False)

    dental_df = network_df.loc[network_df['DentalOnlyPlan']!="Yes"]
    dental_df.loc[dental_df['NetworkName'].str.contains('Dente',case = False), 'DentalOnlyPlan'] = 'Yes'
    dental_df.loc[dental_df['NetworkName'].str.contains('dental', case=False), 'DentalOnlyPlan'] = 'Yes'
    dental_df.loc[dental_df['NetworkName'].str.contains('Dental', case=False), 'DentalOnlyPlan'] = 'Yes'
    dental_df.loc[dental_df['NetworkName'].str.contains('Denta', case=False), 'DentalOnlyPlan'] = 'Yes'
    dental_df.loc[dental_df['NetworkURL'].str.contains('dental', case=False), 'DentalOnlyPlan'] = 'Yes'
    dental_df.loc[dental_df['DentalOnlyPlan'].isna(),'DentalOnlyPlan']= "No"
    # print(dental_df)
    dental_df.to_csv(output_file, mode='a', sep=',', header=False,index=False)

    # for i in range(len(dental_df)):
    #     if not len(dental_dxf[i]):
    #         if re.search("Dente",network_df["NetworkName"][i].astype('str')) or re.search("dente",network_df["NetworkName"][i].astype('str')) or re.search("dental",network_df["NetworkURL"][i].astype('str')) or re.search("dentist",network_df["NetworkURL"][i].astype('str')):
    #             dental_df[i] = "Yes"
    #         else:
    #             dental_df[i] = "No"
    # network_df.to_csv(filename,index = False)
    print("Done")
    #


if __name__ == "__main__":
    remove_null_dental_col('C:/Users/Rutuja Moharil/CIS550 Project/database.sqlite/Network_PUF_original.csv')
