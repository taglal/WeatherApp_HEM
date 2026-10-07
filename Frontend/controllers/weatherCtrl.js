async function getWeather() {

    try {

        const response = await fetch(
            'http://localhost:3000/weather'
        );

        const weather = await response.json();

        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                weather.error
            );

            return;
        }

        drawWeather(weather);

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}


function drawWeather(weather) {

    const weatherList = document.querySelector('#weatherList');

    if (!weatherList) {
        return;
    }

    weatherList.innerHTML = '';

    if (weather.length === 0) {

        weatherList.innerHTML = `
            <div class="alert alert-info">
                No weather data available.
            </div>
        `;

        return;
    }


    weather.forEach(item => {

        weatherList.innerHTML += `

            <div class="card mb-4">

                <div class="card-body">

                    <!-- HEADER -->

                    <div class="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h4 class="mb-1">
                                <i class="bi bi-geo-alt"></i>
                                ${item.location}
                            </h4>

                            <small class="text-muted">
                                <i class="bi bi-calendar"></i>
                                ${item.date}
                            </small>

                        </div>

                        <div class="fs-1">
                            <i class="bi bi-cloud-sun"></i>
                        </div>

                    </div>


                    <!-- MAIN TEMPERATURE -->

                    <div class="row text-center mb-4">

                        <div class="col-md-4 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-thermometer-low fs-2"></i>

                                <h6 class="mt-2">
                                    Minimum
                                </h6>

                                <h4>
                                    ${item.temp_min} °C
                                </h4>

                            </div>

                        </div>


                        <div class="col-md-4 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-thermometer-high fs-2"></i>

                                <h6 class="mt-2">
                                    Maximum
                                </h6>

                                <h4>
                                    ${item.temp_max} °C
                                </h4>

                            </div>

                        </div>


                        <div class="col-md-4 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-cloud-sun fs-2"></i>

                                <h6 class="mt-2">
                                    Weather
                                </h6>

                                <h4>
                                    ${item.weather_type}
                                </h4>

                            </div>

                        </div>

                    </div>


                    <!-- ADDITIONAL DATA -->

                    <div class="row text-center">

                        <div class="col-md-3 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-cloud-rain fs-3"></i>

                                <h6 class="mt-2">
                                    Precipitation
                                </h6>

                                <p class="mb-0">
                                    ${item.precipitation} mm
                                </p>

                            </div>

                        </div>


                        <div class="col-md-3 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-droplet fs-3"></i>

                                <h6 class="mt-2">
                                    Humidity
                                </h6>

                                <p class="mb-0">
                                    ${item.humidity}%
                                </p>

                            </div>

                        </div>


                        <div class="col-md-3 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-wind fs-3"></i>

                                <h6 class="mt-2">
                                    Wind
                                </h6>

                                <p class="mb-0">
                                    ${item.wind_speed}
                                    km/h
                                </p>

                            </div>

                        </div>


                        <div class="col-md-3 mb-3">

                            <div class="border rounded p-3 h-100">

                                <i class="bi bi-sun fs-3"></i>

                                <h6 class="mt-2">
                                    UV Index
                                </h6>

                                <p class="mb-0">
                                    ${item.uv_index}
                                </p>

                            </div>

                        </div>

                    </div>


                    <!-- EXTRA INFORMATION -->

                    <div class="row mt-2">

                        <div class="col-md-4">

                            <small class="text-muted">
                                Precipitation probability:
                                ${item.precipitation_probability}%
                            </small>

                        </div>

                        <div class="col-md-4">

                            <small class="text-muted">
                                Wind direction:
                                ${item.wind_direction || '-'}
                            </small>

                        </div>

                        <div class="col-md-4">

                            <small class="text-muted">
                                Pressure:
                                ${item.pressure} hPa
                            </small>

                        </div>

                    </div>

                </div>

            </div>

        `;
    });
}
async function getAllWeather() {

    try {

        const response = await fetch(
            'http://localhost:3000/weather'
        );

        const weather = await response.json();

        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                weather.error
            );

            return;
        }

        drawAdminWeather(weather);

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
function drawAdminWeather(weather) {

    const weatherList = document.querySelector('#weatherList');

    if (!weatherList) {
        return;
    }

    weatherList.innerHTML = '';

    if (weather.length === 0) {

        weatherList.innerHTML = `
            <div class="alert alert-info">
                No weather data available.
            </div>
        `;

        return;
    }

    weather.forEach(item => {

        weatherList.innerHTML += `

            <div class="card mb-3">

                <div class="card-body">

                    <div class="row">

                        <!-- LOCATION -->

                        <div class="col-md-6 col-lg-3 mb-3">

                            <div class="text-center">

                                <i class="bi bi-geo-alt fs-1"></i>

                                <h5 class="mt-2">
                                    Location
                                </h5>

                                <p>
                                    ${item.location}
                                </p>

                            </div>

                        </div>


                        <!-- MINIMUM -->

                        <div class="col-md-6 col-lg-3 mb-3">

                            <div class="text-center">

                                <i class="bi bi-thermometer-low fs-1"></i>

                                <h5 class="mt-2">
                                    Minimum
                                </h5>

                                <p>
                                    ${item.temp_min} °C
                                </p>

                            </div>

                        </div>


                        <!-- MAXIMUM -->

                        <div class="col-md-6 col-lg-3 mb-3">

                            <div class="text-center">

                                <i class="bi bi-thermometer-high fs-1"></i>

                                <h5 class="mt-2">
                                    Maximum
                                </h5>

                                <p>
                                    ${item.temp_max} °C
                                </p>

                            </div>

                        </div>


                        <!-- WEATHER -->

                        <div class="col-md-6 col-lg-3 mb-3">

                            <div class="text-center">

                                <i class="bi bi-cloud-sun fs-1"></i>

                                <h5 class="mt-2">
                                    Weather
                                </h5>

                                <p>
                                    ${item.weather_type}
                                </p>

                            </div>

                        </div>

                    </div>


                    <hr>


                    <div class="d-flex justify-content-between align-items-center">

                        <small class="text-muted">
                            <i class="bi bi-calendar"></i>
                            ${item.date}
                        </small>


                        <div>

                            <button
                                class="btn btn-warning btn-sm me-2"
                                onclick="editWeather(${item.ID})">

                                <i class="bi bi-pencil"></i>
                                Edit

                            </button>


                            <button
                                class="btn btn-danger btn-sm"
                                onclick="deleteWeather(${item.ID})">

                                <i class="bi bi-trash"></i>
                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;
    });
}
async function deleteWeather(id) {

    if (!confirm('Are you sure you want to delete this weather forecast?')) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/weather/${id}`,
            {
                method: 'DELETE'
            }
        );

        const result = await response.json();

        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                result.error
            );

            return;
        }

        showMessage(
            'success',
            'SUCCESS',
            'Weather forecast deleted successfully!'
        );

        getAllWeather();

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
async function editWeather(id) {

    try {

        const response = await fetch(
            `http://localhost:3000/weather/${id}`
        );

        const weather = await response.json();

        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                weather.error
            );

            return;
        }


        document.querySelector('#editWeatherID').value =
            weather.ID;

        document.querySelector('#editWeatherDate').value =
            weather.date;

        document.querySelector('#editWeatherLocation').value =
            weather.location;

        document.querySelector('#editWeatherMin').value =
            weather.temp_min;

        document.querySelector('#editWeatherMax').value =
            weather.temp_max;

        document.querySelector('#editWeatherType').value =
            weather.weather_type;

        document.querySelector('#editWeatherPrecipitation').value =
            weather.precipitation;

        document.querySelector('#editWeatherPrecipitationProbability').value =
            weather.precipitation_probability;

        document.querySelector('#editWeatherWindSpeed').value =
            weather.wind_speed;

        document.querySelector('#editWeatherWindDirection').value =
            weather.wind_direction || '';

        document.querySelector('#editWeatherHumidity').value =
            weather.humidity;

        document.querySelector('#editWeatherPressure').value =
            weather.pressure;

        document.querySelector('#editWeatherUV').value =
            weather.uv_index;


        const modal = new bootstrap.Modal(
            document.querySelector('#editWeatherModal')
        );

        modal.show();

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
async function updateWeather() {

    const id =
        document.querySelector('#editWeatherID').value;


    const data = {

        date:
            document.querySelector('#editWeatherDate').value,

        location:
            document.querySelector('#editWeatherLocation').value,

        temp_min:
            Number(
                document.querySelector('#editWeatherMin').value
            ),

        temp_max:
            Number(
                document.querySelector('#editWeatherMax').value
            ),

        weather_type:
            document.querySelector('#editWeatherType').value,

        precipitation:
            Number(
                document.querySelector('#editWeatherPrecipitation').value
            ),

        precipitation_probability:
            Number(
                document.querySelector(
                    '#editWeatherPrecipitationProbability'
                ).value
            ),

        wind_speed:
            Number(
                document.querySelector('#editWeatherWindSpeed').value
            ),

        wind_direction:
            document.querySelector(
                '#editWeatherWindDirection'
            ).value || null,

        humidity:
            Number(
                document.querySelector('#editWeatherHumidity').value
            ),

        pressure:
            Number(
                document.querySelector('#editWeatherPressure').value
            ),

        uv_index:
            Number(
                document.querySelector('#editWeatherUV').value
            )
    };


    if (
        !data.date ||
        !data.location ||
        !data.weather_type
    ) {

        showMessage(
            'danger',
            'ERROR',
            'Please fill in all required fields!'
        );

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:3000/weather/${id}`,
            {
                method: 'PATCH',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(data)
            }
        );


        const result = await response.json();


        if (response.status !== 200) {

            showMessage(
                'danger',
                'ERROR',
                result.error
            );

            return;
        }


        const modalElement =
            document.querySelector('#editWeatherModal');

        const modal =
            bootstrap.Modal.getInstance(modalElement);

        modal.hide();


        showMessage(
            'success',
            'SUCCESS',
            'Weather forecast updated successfully!'
        );


        getAllWeather();

    } catch (error) {

        console.log(error);

        showMessage(
            'danger',
            'ERROR',
            'Could not connect to the server!'
        );
    }
}
async function getHomeWeather() {

    try {

        const response = await fetch('http://localhost:3000/weather');

        if (!response.ok) {
            throw new Error('HTTP error: ' + response.status);
        }

        const weatherData = await response.json();

        const today = new Date().toLocaleDateString('sv-SE', {
            timeZone: 'Europe/Budapest'
        });

        const todayWeather = weatherData.find(weather => {

            const weatherDate = new Date(weather.date)
                .toLocaleDateString('sv-SE', {
                    timeZone: 'Europe/Budapest'
                });

            return weatherDate === today;
        });


        if (!todayWeather) {

            document.querySelector('#homeWeatherType').textContent = 'No data';
            document.querySelector('#homeWeatherLocation').textContent = '-';
            document.querySelector('#homeWeatherDate').textContent = '-';

            document.querySelector('#homeTempMin').textContent = '-- °C';
            document.querySelector('#homeTempMax').textContent = '-- °C';

            document.querySelector('#homeHumidity').textContent = '-- %';
            document.querySelector('#homePrecipitation').textContent = '-- mm';
            document.querySelector('#homeWind').textContent = '-- km/h';
            document.querySelector('#homeUv').textContent = '--';

            document.querySelector('#homeLastUpdate').textContent = '-';

            return;
        }


        document.querySelector('#homeWeatherType').textContent =
            todayWeather.weather_type ?? '-';

        document.querySelector('#homeWeatherLocation').textContent =
            todayWeather.location ?? '-';

        document.querySelector('#homeWeatherDate').textContent =
            new Date(todayWeather.date).toLocaleDateString('hu-HU', {
                timeZone: 'Europe/Budapest'
            });


        document.querySelector('#homeTempMin').textContent =
            `${todayWeather.temp_min ?? '--'} °C`;

        document.querySelector('#homeTempMax').textContent =
            `${todayWeather.temp_max ?? '--'} °C`;
        
        document.querySelector('#homeTempMain').textContent =
            `${todayWeather.temp_max ?? '--'} °C`;


        document.querySelector('#homeHumidity').textContent =
            `${todayWeather.humidity ?? '--'} %`;

        document.querySelector('#homePrecipitation').textContent =
            `${todayWeather.precipitation ?? '--'} mm`;

        document.querySelector('#homeWind').textContent =
            `${todayWeather.wind_speed ?? '--'} km/h`;

        document.querySelector('#homeUv').textContent =
            todayWeather.uv_index ?? '--';


        document.querySelector('#homeLastUpdate').textContent =
            new Date().toLocaleTimeString('hu-HU');

    } catch (error) {

        console.error('HOME WEATHER ERROR:', error);

    }
}