import pandas as pd
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.ext.automap import automap_base

def clean_data_viz():
    # connect to postGRES database
    engine = create_engine("postgres://vyavhewrhtvpzj:807f060f51c5988773c3dcd6bd68b769cfe69d8826b5ec5dd17b28d1d4e3af9e@ec2-54-225-249-161.compute-1.amazonaws.com:5432/d9fsrm70s2042g")
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    Landslides = Base.classes.landslides
    session = Session(engine)
    results = session.query(Landslides.latitude, Landslides.longitude, Landslides.fatalities, Landslides.countrycode, Landslides.continentcode).all()

    # create lists to be turned into database
    latitude = []
    longitude = []
    fatalities = []
    country = []
    continent = []
    # loop thru results and append to list
    for row in results:
        latitude.append(row[0])
        longitude.append(row[1])
        fatalities.append(row[2])
        country.append(row[3])
        continent.append(row[4])

    data = pd.DataFrame({
        "latitude": latitude,
        "longitude": longitude,
        "fatalities": fatalities,
        "country_code": country,
        "continent_code": continent
    })

    # clean data
    data_v1 = data[data['fatalities'].str.contains("NaN") == False]
    data_v2 = data_v1[data_v1['country_code'].str.contains("NaN") == False]
    data_v2.reset_index(drop=True, inplace=True)
    data_v2["continent_code"].replace(to_replace="NaN", value="NA", inplace=True)
    data_v2["fatalities"] = data_v2["fatalities"].str.replace(",","")
    data_v2['fatalities'] = data_v2['fatalities'].apply(pd.to_numeric)

    # group df by continent then country
    groupby_object = data_v2.groupby(['continent_code', 'country_code']).sum()
    groupby_object_landslide = data_v2.groupby(['continent_code', 'country_code']).count()
    # reset index 
    # TADA final set
    final_data_fatalities = groupby_object_fatalities.reset_index()
    final_dict_fatalities = final_data_fatalities.to_dict(orient='records')
    final_data_count = groupby_object_landslide.reset_index()
    final_dict_count = final_data_count.to_dict(orient='records')

    return final_dict_fatalities


