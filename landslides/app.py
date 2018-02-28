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
    results = session.query(Landslides.latitude, Landslides.longtiude, Landslides.landslide_size, Landslides.landslide_type, Landslides.trigger).all()

    latitude = [result[0] for result in results]
    longitude = [result[1] for result in results]
    landslide_size = [result[2] for result in results]
    landslide_type = [result[3] for result in results]
    trigger = [result[4] for result in results]

    landslide_map_list = [{
        "latitude": latitude,
        "longitude": longitude, 
        "landslide_size": landslide_size, 
        "landslide_type": landslide_type, 
        "trigger": trigger
    }]

    return jsonify(landslide_map_list)

if __name__ == "__main__":
    app.run()
