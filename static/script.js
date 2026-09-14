let aqiChart = null;


// ============================================================
// PREDICT AQI
// ============================================================

async function predictAQI() {

    const data = {

        pm25:
            document.getElementById("pm25").value,

        pm10:
            document.getElementById("pm10").value,

        no2:
            document.getElementById("no2").value,

        so2:
            document.getElementById("so2").value,

        co:
            document.getElementById("co").value,

        o3:
            document.getElementById("o3").value,

        temperature:
            document.getElementById("temperature").value,

        humidity:
            document.getElementById("humidity").value,

        wind_speed:
            document.getElementById("wind_speed").value

    };


    // Check fields

    for (let key in data) {

        if (data[key] === "") {

            alert(
                "Please enter all environmental values."
            );

            return;

        }

    }


    try {

        const response = await fetch(
            "/predict",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(data)

            }
        );


        const result =
            await response.json();


        if (result.success) {


            // Show prediction result

            document.getElementById(
                "result"
            ).style.display = "block";


            document.getElementById(
                "aqi"
            ).textContent = result.aqi;


            document.getElementById(
                "category"
            ).textContent =
                result.category;


            // Apply AQI styling

            updateAQIStyle(
                result.aqi,
                result.category
            );


            // Update dashboard

            loadDashboard();


            // Scroll to result

            document.getElementById(
                "result"
            ).scrollIntoView({
                behavior: "smooth"
            });


        } else {

            alert(
                "Prediction error: "
                + result.error
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Could not connect to Flask server."
        );

    }

}



// ============================================================
// AQI STYLE
// ============================================================

function updateAQIStyle(aqi, category) {

    const categoryElement =
        document.getElementById("category");


    categoryElement.className =
        "category";


    if (aqi <= 50) {

        categoryElement.classList.add(
            "good"
        );

    }

    else if (aqi <= 100) {

        categoryElement.classList.add(
            "satisfactory"
        );

    }

    else if (aqi <= 200) {

        categoryElement.classList.add(
            "moderate"
        );

    }

    else if (aqi <= 300) {

        categoryElement.classList.add(
            "poor"
        );

    }

    else if (aqi <= 400) {

        categoryElement.classList.add(
            "very-poor"
        );

    }

    else {

        categoryElement.classList.add(
            "severe"
        );

    }

}



// ============================================================
// LOAD DASHBOARD
// ============================================================

async function loadDashboard() {

    try {

        const response =
            await fetch("/api/history");


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                "Dashboard error:",
                data.error
            );

            return;

        }


        const predictions =
            data.predictions;


        // Total predictions

        document.getElementById(
            "totalPredictions"
        ).textContent =
            predictions.length;


        if (predictions.length === 0) {

            return;

        }


        // Latest prediction

        const latest =
            predictions[0];


        document.getElementById(
            "latestAQI"
        ).textContent =
            latest.predicted_aqi;


        document.getElementById(
            "latestCategory"
        ).textContent =
            latest.category;


        // Environmental readings

        document.getElementById(
            "latestPM25"
        ).textContent =
            latest.pm25;


        document.getElementById(
            "latestPM10"
        ).textContent =
            latest.pm10;


        document.getElementById(
            "latestNO2"
        ).textContent =
            latest.no2;


        document.getElementById(
            "latestSO2"
        ).textContent =
            latest.so2;


        document.getElementById(
            "latestCO"
        ).textContent =
            latest.co;


        document.getElementById(
            "latestO3"
        ).textContent =
            latest.o3;


        document.getElementById(
            "latestTemperature"
        ).textContent =
            latest.temperature + " °C";


        document.getElementById(
            "latestHumidity"
        ).textContent =
            latest.humidity + " %";


        document.getElementById(
            "latestWind"
        ).textContent =
            latest.wind_speed + " m/s";


        // Update history table

        updateHistoryTable(
            predictions
        );


        // Update chart

        updateChart(
            predictions
        );

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }

}



// ============================================================
// HISTORY TABLE
// ============================================================

function updateHistoryTable(
    predictions
) {

    const table =
        document.getElementById(
            "historyTable"
        );


    table.innerHTML = "";


    predictions.forEach(
        function(row) {


            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${row.timestamp}
                </td>

                <td>
                    ${row.pm25}
                </td>

                <td>
                    ${row.pm10}
                </td>

                <td>
                    ${row.temperature} °C
                </td>

                <td>
                    ${row.humidity} %
                </td>

                <td>
                    ${row.predicted_aqi}
                </td>

                <td>
                    <span class="table-category">
                        ${row.category}
                    </span>
                </td>

            `;


            table.appendChild(tr);

        }
    );

}



// ============================================================
// AQI CHART
// ============================================================

function updateChart(
    predictions
) {

    const chartData =
        [...predictions].reverse();


    const labels =
        chartData.map(
            row => row.timestamp
        );


    const values =
        chartData.map(
            row => row.predicted_aqi
        );


    const ctx =
        document
        .getElementById("aqiChart")
        .getContext("2d");


    if (aqiChart !== null) {

        aqiChart.destroy();

    }


    aqiChart =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Predicted AQI",

                            data:
                                values,

                            borderWidth: 3,

                            tension: 0.3,

                            fill: false,

                            pointRadius: 5

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            display: true

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text: "AQI"

                            }

                        },


                        x: {

                            title: {

                                display: true,

                                text:
                                    "Prediction Time"

                            }

                        }

                    }

                }

            }
        );

}



// ============================================================
// LOAD DASHBOARD WHEN PAGE OPENS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

    }
);