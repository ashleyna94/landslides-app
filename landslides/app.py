# import necessary libraries
import os
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
Base = automap_base()

engine = create_engine(os.environ.get("DATABASE_URL"))

# Reflect the tables
Base.prepare(engine, reflect=True)

# Mapped classes are now created with names by default
# matching that of the table name.
Landslides = Base.classes.landslides
session = Session(engine)

# Create a route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/geodata")
def geo():
    results = session.query(Landslides.hazard_type, Landslides.latitude, Landslides.longitude).all()

    hazard_type = [result[0] for result in results]
    latitude = [result[1] for result in results]
    longitude = [result[2] for result in results]

    geo_data = [{
        "hazard_type": hazard_type,
        "latitude": latitude,
        "longitude": longitude
    }]

    return jsonify(geo_data)

@app.route("/api/leaflet")
def landslide_map():
    results = session.query(Landslides.latitude, Landslides.longtiude, Landslides.landslide_size, Landslides.landslide_type, Landslides.trigger).all()

    landslide_map_dict = {}

    for result in results:
        landslide_map_dict["Latitude"] = result[0]
        landslide_map_dict["Longitude"] = result[1]
        landslide_map_dict["Landslide Size"] = result[2]
        landslide_map_dict["Landslide Type"] = result[3]
        landslide_map_dict["Trigger"] = result[4]

    return jsonify(landslide_map_dict)

if __name__ == "__main__":
    app.run()
