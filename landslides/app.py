# Import necessary libraries
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
    sel = [Landslides.latitude, Landslides.longitude, Landslides.landslide_size, Landslides.landslide_type, Landslides.trigger]

    results = session.query(*sel).all()

    mylist = []
    
    for result in results:
        landslide_map = {}
        landslide_map["latitude"] = result[0]
        landslide_map["longitude"] = result[1]
        landslide_map["landslide_size"] = result[2]
        landslide_map["landslide_type"] = result[3]
        landslide_map["trigger"] = result[4]
        mylist.append(landslide_map)

    return jsonify(mylist)

if __name__ == "__main__":
    app.run()
