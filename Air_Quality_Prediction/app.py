from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import sqlite3
from datetime import datetime

app = Flask(__name__)


# ============================================================
# LOAD TRAINED MACHINE LEARNING MODELS
# ============================================================

regression_model = joblib.load(
    "models/air_quality_regression.pkl"
)

classification_model = joblib.load(
    "models/air_quality_classifier.pkl"
)


# ============================================================
# CREATE DATABASE
# ============================================================

def create_database():

    connection = sqlite3.connect("air_quality.db")

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            timestamp TEXT,

            pm25 REAL,
            pm10 REAL,
            no2 REAL,
            so2 REAL,
            co REAL,
            o3 REAL,

            temperature REAL,
            humidity REAL,
            wind_speed REAL,

            predicted_aqi REAL,

            category TEXT
        )
    """)

    connection.commit()

    connection.close()


create_database()


# ============================================================
# HOME PAGE
# ============================================================

@app.route("/")
def home():

    return render_template("index.html")


# ============================================================
# PREDICTION API
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        # Receive data from the webpage

        data = request.get_json()


        # Convert values to numbers

        pm25 = float(data["pm25"])

        pm10 = float(data["pm10"])

        no2 = float(data["no2"])

        so2 = float(data["so2"])

        co = float(data["co"])

        o3 = float(data["o3"])

        temperature = float(
            data["temperature"]
        )

        humidity = float(
            data["humidity"]
        )

        wind_speed = float(
            data["wind_speed"]
        )


        # ====================================================
        # PREPARE INPUT FOR MACHINE LEARNING MODEL
        # ====================================================

        input_data = np.array([

            [
                pm25,
                pm10,
                no2,
                so2,
                co,
                o3,
                temperature,
                humidity,
                wind_speed
            ]

        ])


        # ====================================================
        # PREDICT AQI VALUE
        # ====================================================

        predicted_aqi = regression_model.predict(
            input_data
        )[0]


        # Round AQI

        predicted_aqi = round(
            max(0, predicted_aqi),
            2
        )


        # ====================================================
        # PREDICT AQI CATEGORY
        # ====================================================

        predicted_category = (
            classification_model.predict(
                input_data
            )[0]
        )


        # ====================================================
        # SAVE PREDICTION TO DATABASE
        # ====================================================

        connection = sqlite3.connect(
            "air_quality.db"
        )

        cursor = connection.cursor()


        cursor.execute("""
            INSERT INTO predictions (

                timestamp,

                pm25,
                pm10,
                no2,
                so2,
                co,
                o3,

                temperature,
                humidity,
                wind_speed,

                predicted_aqi,
                category

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (

            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            ),

            pm25,
            pm10,
            no2,
            so2,
            co,
            o3,

            temperature,
            humidity,
            wind_speed,

            predicted_aqi,

            predicted_category
        ))


        connection.commit()

        connection.close()


        # ====================================================
        # SEND RESULT BACK TO WEBSITE
        # ====================================================

        return jsonify({

            "success": True,

            "aqi": predicted_aqi,

            "category": predicted_category

        })


    except Exception as error:

        return jsonify({

            "success": False,

            "error": str(error)

        })

# ============================================================
# DASHBOARD
# ============================================================

@app.route("/dashboard")
def dashboard():

    connection = sqlite3.connect("air_quality.db")

    connection.row_factory = sqlite3.Row

    cursor = connection.cursor()

    # Get all predictions
    cursor.execute("""
        SELECT *
        FROM predictions
        ORDER BY id DESC
    """)

    predictions = cursor.fetchall()

    # Get total number of predictions
    cursor.execute("""
        SELECT COUNT(*) AS total
        FROM predictions
    """)

    total_predictions = cursor.fetchone()["total"]

    connection.close()

    return render_template(
        "dashboard.html",
        predictions=predictions,
        total_predictions=total_predictions
    )

# ============================================================
# DASHBOARD HISTORY API
# ============================================================

@app.route("/api/history")
def api_history():

    try:

        connection = sqlite3.connect(
            "air_quality.db"
        )

        connection.row_factory = sqlite3.Row

        cursor = connection.cursor()

        cursor.execute("""
            SELECT *
            FROM predictions
            ORDER BY id DESC
        """)

        rows = cursor.fetchall()

        connection.close()


        predictions = []

        for row in rows:

            predictions.append({

                "timestamp":
                    row["timestamp"],

                "pm25":
                    row["pm25"],

                "pm10":
                    row["pm10"],

                "no2":
                    row["no2"],

                "so2":
                    row["so2"],

                "co":
                    row["co"],

                "o3":
                    row["o3"],

                "temperature":
                    row["temperature"],

                "humidity":
                    row["humidity"],

                "wind_speed":
                    row["wind_speed"],

                "predicted_aqi":
                    row["predicted_aqi"],

                "category":
                    row["category"]

            })


        return jsonify({

            "success": True,

            "predictions":
                predictions

        })


    except Exception as error:

        return jsonify({

            "success": False,

            "error":
                str(error)

        })
# ============================================================
# START FLASK SERVER
# ============================================================


if __name__ == "__main__":

    app.run(
        debug=True
    )