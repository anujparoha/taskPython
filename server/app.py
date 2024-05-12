from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import ObjectId  

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/companies"
mongo = PyMongo(app)

companies = [
  {
    "name": "Tech Innovators Inc.",
    "revenue": 50000000,
    "founded_year": 2005,
    "keywords": ["technology", "innovation", "software", "startup"],
    "location": {
      "city": "San Francisco",
      "state": "California",
      "country": "USA"
    },
    "email": "contact@techinnovators.com"
  },
  {
    "name": "Green Energy Solutions",
    "revenue": 75000000,
    "founded_year": 2010,
    "keywords": ["energy", "renewable", "sustainability"],
    "location": {
      "city": "Austin",
      "state": "Texas",
      "country": "USA"
    },
    "email": "info@greenenergysolutions.com"
  },
  {
    "name": "Digital Design Co.",
    "revenue": 35000000,
    "founded_year": 2015,
    "keywords": ["design", "graphics", "branding"],
    "location": {
      "city": "New York",
      "state": "New York",
      "country": "USA"
    },
    "email": "contact@digitaldesignco.com"
  },
  {
    "name": "Healthcare Innovations Group",
    "revenue": 60000000,
    "founded_year": 2008,
    "keywords": ["healthcare", "innovation", "medical"],
    "location": {
      "city": "Boston",
      "state": "Massachusetts",
      "country": "USA"
    },
    "email": "info@healthcareinnovations.com"
  },
  {
    "name": "Foodie Ventures Ltd.",
    "revenue": 40000000,
    "founded_year": 2012,
    "keywords": ["food", "restaurant", "cuisine"],
    "location": {
      "city": "Chicago",
      "state": "Illinois",
      "country": "USA"
    },
    "email": "contact@foodieventures.com"
  },
  {
    "name": "Eco-Friendly Solutions Inc.",
    "revenue": 55000000,
    "founded_year": 2009,
    "keywords": ["environment", "sustainability", "green"],
    "location": {
      "city": "Portland",
      "state": "Oregon",
      "country": "USA"
    },
    "email": "info@ecofriendlysolutions.com"
  },
  {
    "name": "Finance Innovators Corporation",
    "revenue": 80000000,
    "founded_year": 2007,
    "keywords": ["finance", "investment", "banking"],
    "location": {
      "city": "Los Angeles",
      "state": "California",
      "country": "USA"
    },
    "email": "info@financeinnovators.com"
  },
  {
    "name": "Artistic Creations Studio",
    "revenue": 45000000,
    "founded_year": 2014,
    "keywords": ["art", "design", "craft"],
    "location": {
      "city": "Seattle",
      "state": "Washington",
      "country": "USA"
    },
    "email": "contact@artisticcreations.com"
  },
  {
    "name": "Travel Adventures LLC",
    "revenue": 70000000,
    "founded_year": 2011,
    "keywords": ["travel", "adventure", "tourism"],
    "location": {
      "city": "Miami",
      "state": "Florida",
      "country": "USA"
    },
    "email": "info@traveladventures.com"
  },
  {
    "name": "Tech Solutions Ltd.",
    "revenue": 60000000,
    "founded_year": 2013,
    "keywords": ["technology", "software", "consulting"],
    "location": {
      "city": "Dallas",
      "state": "Texas",
      "country": "USA"
    },
    "email": "info@techsolutions.com"
  }
]


def insert_sample_data():
    if mongo.db.company.count_documents({}) == 0:
        mongo.db.company.insert_many(companies)


@app.route('/api/companies', methods=['GET'])
def get_companies():
    companies = list(mongo.db.company.find({}, {'_id': 0}))
    return jsonify({"companies": companies})

@app.route('/api/companies/location', methods=['GET'])
def filter_companies_by_location():
    location = request.args.get('location')
  
    filtered_companies = list(mongo.db.company.find({"location.city": location}, {'_id': 0}))
    return jsonify({"companies": filtered_companies})

@app.route('/api/companies/search', methods=['GET'])
def search_companies():
    query = request.args.get('query')
    
    searched_companies = list(mongo.db.company.find({"name": {"$regex": query, "$options": "i"}}, {'_id': 0}))
    return jsonify({"companies": searched_companies})

if __name__ == '__main__':
   
    insert_sample_data()
    app.run(debug=True)
