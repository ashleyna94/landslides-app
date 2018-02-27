# import necessary libraries
import numpy as np

import os

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import os

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
Base = automap_base()

engine = create_engine(os.environ.get("DATABASE_URL"))

# reflect the tables
Base.prepare(engine, reflect=True)

# mapped classes are now created with names by default
# matching that of the table name.
Landslides = Base.classes.landslides
session = Session(engine)

# create route that renders index.html template
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

if __name__ == "__main__":
    app.run()
