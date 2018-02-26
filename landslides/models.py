from .app import db


class Landslides(db.Model):
    __tablename__ = 'landslides'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String)
    time = db.Column(db.String)
    country = db.Column(db.String)
    nearest_places = db.Column(db.String)
    hazard_type = db.Column(db.String)
    landslide_type = db.Column(db.String)
    trigger = db.Column(db.String)
    storm_name = db.Column(db.String)
    fatalities = db.Column(db.Integer)
    injuries = db.Column(db.Integer)
    source_name = db.Column(db.String)
    source_link = db.Column(db.String)
    location_description = db.Column(db.String)
    location_accuracy = db.Column(db.String)
    landslide_size = db.Column(db.String)
    photos_link = db.Column(db.String)
    cat_src = db.Column(db.String)
    cat_id = db.Column(db.Integer)
    countryname = db.Column(db.String)
    near = db.Column(db.String)
    distance = db.Column(db.Float)
    adminname1 = db.Column(db.String)
    adminname2 = db.Column(db.String)
    population = db.Column(db.Integer)
    countrycode = db.Column(db.String)
    continentcode = db.Column(db.String)
    key = db.Column(db.String)
    version = db.Column(db.Integer)
    tstamp = db.Column(db.String)
    changeset_id = db.Column(db.Integer)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    geolocation = db.Column(db.String)

    def __repr__(self):
        return '<Landslides %r>' % (self.name)