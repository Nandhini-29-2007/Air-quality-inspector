# 🌫️ Air Quality Prediction System

## 📌 Project Overview

The **Air Quality Prediction System** is a machine learning-based web application that predicts the Air Quality Index (AQI) using environmental parameters such as PM2.5, PM10, NO₂, SO₂, CO, O₃, temperature, humidity, and wind speed.

The system uses machine learning models to predict the AQI value and classify the air quality into different categories. A web dashboard is provided to display prediction results and prediction history.

---

## 🎯 Objectives

- Predict Air Quality Index (AQI) using environmental parameters.
- Classify air quality into different categories.
- Perform data preprocessing and exploratory data analysis.
- Train and compare machine learning models.
- Develop a user-friendly web interface.
- Store prediction results for future reference.
- Display AQI prediction history through a dashboard.

---

## 🛠️ Technologies Used

### Programming Language
- Python

### Machine Learning
- Scikit-learn
- Linear Regression
- Random Forest Regression
- Random Forest Classification

### Data Processing
- Pandas
- NumPy

### Visualization
- Matplotlib
- Seaborn
- Chart.js

### Web Development
- Flask
- HTML
- CSS
- JavaScript

### Database
- SQLite

### Model Storage
- Joblib

---

## 📊 Input Parameters

The system accepts the following environmental parameters:

| Parameter | Description |
|---|---|
| PM2.5 | Fine particulate matter |
| PM10 | Particulate matter |
| NO₂ | Nitrogen dioxide |
| SO₂ | Sulfur dioxide |
| CO | Carbon monoxide |
| O₃ | Ozone |
| Temperature | Temperature in °C |
| Humidity | Relative humidity in % |
| Wind Speed | Wind speed in m/s |

---

## 🤖 Machine Learning Models

### 1. Linear Regression

Linear Regression is used as a baseline regression model to predict the numerical AQI value from environmental parameters.

### 2. Random Forest Regression

Random Forest Regression combines multiple decision trees to predict the AQI value and can capture non-linear relationships between environmental parameters.

### 3. Random Forest Classification

Random Forest Classification is used to classify the predicted air quality into AQI categories.

---

## 🌈 AQI Categories

| AQI Range | Category |
|---|---|
| 0–50 | Good |
| 51–100 | Satisfactory |
| 101–200 | Moderate |
| 201–300 | Poor |
| 301–400 | Very Poor |
| 401+ | Severe |

---

## 📈 System Features

- Environmental parameter input form
- AQI prediction
- Air quality category prediction
- Real-time prediction result display
- Air quality dashboard
- Latest environmental readings
- AQI prediction history chart
- Prediction history table
- SQLite database for storing predictions
- Responsive web interface

---

## 🏗️ System Architecture

```text
User
  ↓
Web Interface
  ↓
Flask Backend
  ↓
Input Validation & Processing
  ↓
Machine Learning Models
  ↓
AQI Prediction
  ↓
AQI Category
  ↓
SQLite Database
  ↓
Dashboard & Prediction History
