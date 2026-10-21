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
            <div class="weather-empty">

                <i class="bi bi-cloud-slash"></i>

                <h5>
                    No weather data available.
                </h5>

                <p>
                    There are currently no weather records.
                </p>

            </div>
        `;

        return;
    }

    weather.forEach(item => {

        weatherList.innerHTML += `

            <div class="admin-weather-card">

                <div class="admin-weather-card-body">


                    <!-- LOCATION -->

                    <div class="admin-weather-item">

                        <div class="admin-weather-icon">

                            <i class="bi bi-geo-alt"></i>

                        </div>

                        <h5>
                            Location
                        </h5>

                        <p>
                            ${item.location ?? '-'}
                        </p>

                    </div>


                    <!-- MINIMUM -->

                    <div class="admin-weather-item">

                        <div class="admin-weather-icon">

                            <i class="bi bi-thermometer-low"></i>

                        </div>

                        <h5>
                            Minimum
                        </h5>

                        <p>
                            ${item.temp_min ?? '--'} °C
                        </p>

                    </div>


                    <!-- MAXIMUM -->

                    <div class="admin-weather-item">

                        <div class="admin-weather-icon">

                            <i class="bi bi-thermometer-high"></i>

                        </div>

                        <h5>
                            Maximum
                        </h5>

                        <p>
                            ${item.temp_max ?? '--'} °C
                        </p>

                    </div>


                    <!-- WEATHER -->

                    <div class="admin-weather-item">

                        <div class="admin-weather-icon">

                            <i class="bi bi-cloud-sun"></i>

                        </div>

                        <h5>
                            Weather
                        </h5>

                        <p>
                            ${item.weather_type ?? '-'}
                        </p>

                    </div>


                </div>


                <!-- FOOTER -->

                <div class="admin-weather-card-footer">

                    <div class="admin-weather-date">

                        <i class="bi bi-calendar"></i>

                        ${item.date ?? '-'}

                    </div>


                    <div class="admin-weather-actions">

                        <button
                            class="admin-weather-edit-btn"
                            onclick="editWeather(${item.ID})">

                            <i class="bi bi-pencil"></i>

                            Edit

                        </button>


                        <button
                            class="admin-weather-delete-btn"
                            onclick="deleteWeather(${item.ID})">

                            <i class="bi bi-trash"></i>

                            Delete

                        </button>

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


async function getForecast() {

    const forecastList =
        document.querySelector('#forecastList');

    if (!forecastList) {
        return;
    }

    try {

        const response =
            await fetch('http://localhost:3000/weather');

        if (!response.ok) {
            throw new Error(
                'HTTP error: ' + response.status
            );
        }

        const weatherData =
            await response.json();




        const today =
            new Date().toLocaleDateString(
                'sv-SE',
                {
                    timeZone: 'Europe/Budapest'
                }
            );


        const forecastData =
            weatherData
                .filter(weather => {

                    const weatherDate =
                        new Date(weather.date)
                            .toLocaleDateString(
                                'sv-SE',
                                {
                                    timeZone: 'Europe/Budapest'
                                }
                            );

                    return weatherDate >= today;

                })
                .sort((a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
                );



        forecastChartData = forecastData;


        
        forecastList.innerHTML = '';




        if (forecastData.length === 0) {

            forecastList.innerHTML = `

                <div class="forecast-empty">

                    <i class="bi bi-cloud-slash"></i>

                    <h5>
                        Nincs elérhető előrejelzés
                    </h5>

                    <p>
                        Jelenleg nincs jövőbeli
                        időjárási adat.
                    </p>

                </div>

            `;

            const chartMessage =
                document.querySelector(
                    '#forecastChartMessage'
                );

            if (chartMessage) {
                chartMessage.textContent =
                    'Nincs megjeleníthető előrejelzési adat.';
            }

            return;
        }




        forecastData.forEach(weather => {

            const date =
                new Date(weather.date);


            const formattedDate =
                date.toLocaleDateString(
                    'hu-HU',
                    {
                        timeZone: 'Europe/Budapest',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }
                );


            const dayName =
                date.toLocaleDateString(
                    'hu-HU',
                    {
                        timeZone: 'Europe/Budapest',
                        weekday: 'long'
                    }
                );




            let weatherIcon =
                'bi-cloud-sun';


            const type =
                String(
                    weather.weather_type || ''
                ).toLowerCase();


            if (
                type.includes('napos') ||
                type.includes('derült')
            ) {

                weatherIcon =
                    'bi-sun';

            } else if (
                type.includes('eső') ||
                type.includes('eso') ||
                type.includes('zápor')
            ) {

                weatherIcon =
                    'bi-cloud-rain';

            } else if (
                type.includes('vihar')
            ) {

                weatherIcon =
                    'bi-cloud-lightning';

            } else if (
                type.includes('hó') ||
                type.includes('havaz')
            ) {

                weatherIcon =
                    'bi-cloud-snow';

            } else if (
                type.includes('felhő') ||
                type.includes('felho')
            ) {

                weatherIcon =
                    'bi-cloud';

            }


        
            forecastList.innerHTML += `

                <div class="forecast-card">

                    <div class="forecast-card-date">

                        <div class="forecast-card-day">
                            ${dayName}
                        </div>

                        <div class="forecast-card-date-text">
                            ${formattedDate}
                        </div>

                    </div>


                    <div class="forecast-card-weather">

                        <div class="forecast-card-icon">

                            <i class="bi ${weatherIcon}"></i>

                        </div>

                        <div>

                            <div class="forecast-card-type">
                                ${weather.weather_type ?? '-'}
                            </div>

                            <div class="forecast-card-location">

                                <i class="bi bi-geo-alt"></i>

                                ${weather.location ?? '-'}

                            </div>

                        </div>

                    </div>


                    <div class="forecast-card-temperature">

                        <div class="forecast-card-temp-main">
                            ${weather.temp_max ?? '--'} °C
                        </div>

                        <div class="forecast-card-temp-range">

                            min:
                            ${weather.temp_min ?? '--'} °C

                        </div>

                    </div>


                    <div class="forecast-card-details">

                        <div class="forecast-card-detail">

                            <i class="bi bi-droplet"></i>

                            ${weather.humidity ?? '--'} %

                        </div>

                        <div class="forecast-card-detail">

                            <i class="bi bi-cloud-rain"></i>

                            ${weather.precipitation ?? '--'} mm

                        </div>

                        <div class="forecast-card-detail">

                            <i class="bi bi-wind"></i>

                            ${weather.wind_speed ?? '--'} km/h

                        </div>

                        <div class="forecast-card-detail">

                            <i class="bi bi-sun"></i>

                            UV ${weather.uv_index ?? '--'}

                        </div>

                    </div>


                    <button
                        type="button"
                        class="forecast-card-button"
                        onclick="showForecastDetails(${weather.ID})">

                        <i class="bi bi-eye"></i>

                        Részletek

                    </button>

                </div>

            `;

        });




        if (forecastViewMode === 'chart') {
            drawForecastTemperatureChart();
        }


    } catch (error) {

        console.error(
            'FORECAST ERROR:',
            error
        );

        forecastList.innerHTML = `

            <div class="forecast-empty">

                <i class="bi bi-exclamation-triangle"></i>

                <h5>
                    Hiba történt
                </h5>

                <p>
                    Az előrejelzési adatok
                    nem tölthetők be.
                </p>

            </div>

        `;

    }

}


async function showForecastDetails(id) {

    try {

        const response = await fetch(
            `http://localhost:3000/weather/${id}`
        );

        if (!response.ok) {
            throw new Error(
                `HTTP hiba: ${response.status}`
            );
        }

        const weather = await response.json();

        const setText = (selector, value) => {
            const element = document.querySelector(selector);

            if (element) {
                element.textContent = value;
            } else {
                console.warn(
                    `Nem található HTML-elem: ${selector}`
                );
            }
        };

        
        const dateText = String(weather.date ?? '').slice(0, 10);
        const dateParts = dateText.split('-');

        let formattedDate = '-';

        if (
            dateParts.length === 3 &&
            dateParts.every(part => part.length > 0)
        ) {
            formattedDate =
                `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}.`;
        }

        setText('#forecastModalDate', formattedDate);
        setText('#forecastModalLocation', weather.location ?? '-');
        setText('#forecastModalType', weather.weather_type ?? '-');

        setText(
            '#forecastModalMin',
            `${weather.temp_min ?? '--'} °C`
        );

        setText(
            '#forecastModalMax',
            `${weather.temp_max ?? '--'} °C`
        );

        setText(
            '#forecastModalHumidity',
            weather.humidity == null
                ? '-- %'
                : `${weather.humidity} %`
        );

        setText(
            '#forecastModalPrecipitation',
            weather.precipitation == null
                ? '-- mm'
                : `${weather.precipitation} mm`
        );

        setText(
            '#forecastModalWind',
            weather.wind_speed == null
                ? '-- km/h'
                : `${weather.wind_speed} km/h`
        );

        setText(
            '#forecastModalUv',
            weather.uv_index ?? '--'
        );

        const modalElement =
            document.querySelector('#forecastModal');

        if (!modalElement) {
            throw new Error(
                'Nem található a forecastModal HTML-elem.'
            );
        }

        if (typeof bootstrap === 'undefined') {
            throw new Error(
                'A Bootstrap JavaScript nincs betöltve.'
            );
        }

        bootstrap.Modal
            .getOrCreateInstance(modalElement)
            .show();

    } catch (error) {

        console.error(
            'FORECAST DETAILS ERROR:',
            error
        );

        if (typeof showMessage === 'function') {
            showMessage(
                'danger',
                'Hiba',
                'Nem sikerült betölteni az előrejelzés részleteit.'
            );
        }
    }
}




let forecastViewMode = 'cards';
let forecastChartData = [];
let forecastChartInstance = null;



function setForecastView(mode) {

    forecastViewMode = mode;

    const forecastList = document.querySelector('#forecastList');
    const chartView = document.querySelector('#forecastChartView');

    const cardsButton = document.querySelector('#forecastCardsButton');
    const chartButton = document.querySelector('#forecastChartButton');

    if (!forecastList || !chartView || !cardsButton || !chartButton) {
        return;
    }

    const showChart = mode === 'chart';

    
    forecastList.style.display = showChart ? 'none' : '';
    chartView.style.display = showChart ? 'block' : 'none';

   
    cardsButton.classList.toggle('active', !showChart);
    chartButton.classList.toggle('active', showChart);

    cardsButton.setAttribute('aria-pressed', String(!showChart));
    chartButton.setAttribute('aria-pressed', String(showChart));

    
    if (showChart) {
        drawForecastTemperatureChart();
    }
}




function drawForecastTemperatureChart() {

    const canvas = document.querySelector('#forecastTemperatureChart');
    const message = document.querySelector('#forecastChartMessage');

    if (!canvas || !message) {
        return;
    }

    
    if (typeof Chart === 'undefined') {
        message.textContent = 'A grafikonkönyvtár nem tölthető be.';
        return;
    }

    
    if (forecastChartInstance) {
        forecastChartInstance.destroy();
        forecastChartInstance = null;
    }

    
    if (!forecastChartData || forecastChartData.length === 0) {
        message.textContent = 'Nincs megjeleníthető előrejelzési adat.';
        return;
    }

    
    const sortedData = [...forecastChartData].sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
    });

    
    const labels = sortedData.map(item => {

        const dateText = String(item.date).slice(0, 10);
        const parts = dateText.split('-');

        if (parts.length !== 3) {
            return dateText;
        }

        return `${parts[2]}.${parts[1]}.`;
    });

   
    const minValues = sortedData.map(item => {
        return item.temp_min == null ? null : Number(item.temp_min);
    });

    const maxValues = sortedData.map(item => {
        return item.temp_max == null ? null : Number(item.temp_max);
    });

   
    const styles = getComputedStyle(document.body);

    const textColor =
        styles.getPropertyValue('--text-main').trim() ||
        (document.body.classList.contains('dark-theme')
            ? '#f5f5f5'
            : '#222222');

    const secondaryColor =
        styles.getPropertyValue('--text-secondary').trim() ||
        '#888888';

    const gridColor =
        styles.getPropertyValue('--glass-border').trim() ||
        'rgba(128, 128, 128, 0.25)';


    
    forecastChartInstance = new Chart(canvas, {

        type: 'line',

        data: {

            labels: labels,

            datasets: [

                {
                    label: 'Minimum (°C)',
                    data: minValues,

                    borderColor: secondaryColor,
                    backgroundColor: 'transparent',

                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 7,

                    tension: 0.3,
                    spanGaps: false
                },

                {
                    label: 'Maximum (°C)',
                    data: maxValues,

                    borderColor: textColor,
                    backgroundColor: 'transparent',

                    borderWidth: 3,
                    borderDash: [7, 5],

                    pointRadius: 4,
                    pointHoverRadius: 7,

                    tension: 0.3,
                    spanGaps: false
                }

            ]

        },

        options: {

            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: 'index',
                intersect: false
            },

            plugins: {

                
                legend: {
                    display: false
                },

                tooltip: {

                    callbacks: {

                        label(context) {

                            const value = context.parsed.y;

                            return `${context.dataset.label}: ${
                                value == null ? '-' : value
                            } °C`;
                        }

                    }

                }

            },

            scales: {

                x: {

                    ticks: {
                        color: secondaryColor
                    },

                    grid: {
                        color: gridColor
                    }

                },

                y: {

                    title: {

                        display: true,
                        text: 'Hőmérséklet (°C)',
                        color: textColor

                    },

                    ticks: {

                        color: secondaryColor,

                        callback(value) {
                            return `${value} °C`;
                        }

                    },

                    grid: {
                        color: gridColor
                    }

                }

            }

        }

    });

    message.textContent =
        `${sortedData.length} előrejelzési rekord megjelenítve.`;

}
