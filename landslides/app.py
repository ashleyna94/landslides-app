# import necessary libraries
import numpy as np

import os

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
from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL", "") or "sqlite:///landslides_db.sqlite"

db = SQLAlchemy(app)
from .models import Landslides


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Query the database and send the jsonified results
@app.route("/send", methods=["GET", "POST"])
def send():
    if request.method == "POST":
        name = request.form["petName"]
        lat = request.form["petLat"]
        lon = request.form["petLon"]

        landslide = Landslides(country=name, latitude=lat, longitude=lon)
        db.session.add(landslide)
        db.session.commit()
        return redirect("http://localhost:5000/", code=302)

    return render_template("form.html")

@app.route("/api/pals")
def pals():
    results = db.session.query(Pet.country, Pet.latitude, Pet.longitude).all()

    hover_text = [result[0] for result in results]
    lat = [result[1] for result in results]
    lon = [result[2] for result in results]

    pet_data = [{
        "type": "scattergeo",
        "locationmode": "USA-states",
        "lat": lat,
        "lon": lon,
        "text": hover_text,
        "hoverinfo": "text",
        "marker": {
            "size": 50,
            "line": {
            "color": "rgb(8,8,8)",
            "width": 1
            },
        }
    }]

    return jsonify(pet_data)

if __name__ == "__main__":
    app.run()
