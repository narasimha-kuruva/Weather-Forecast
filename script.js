window.addEventListener('load', () => {
    var latitude, longitude, country, locationKey, localName, state, allInfoLocation, ApiKey;
    var countryName, stateName, villageName;

    // Function to return an element by its CSS selector
    var returnId = (selector) => {
        return document.querySelector(selector);
    }

    // Get elements from the DOM
    countryName = returnId("#countryId");
    stateName = returnId('#state');
    villageName = returnId('#localName');
    

    // Async function to handle geolocation and API requests
    (async function automatic() {
        // Wrap navigator.geolocation.getCurrentPosition in a Promise
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            ApiKey = '3AP1lPR5Xu5ScuBmfGWbbshckrag9XLK';
            var geoPositionUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ApiKey}&q=${latitude},${longitude}&language=en-us`;

            const geoResponse = await axios.get(geoPositionUrl);
            console.log(geoResponse);
            locationKey = geoResponse.data.Key;
            country = geoResponse.data.Country.EnglishName;
            localName = geoResponse.data.SupplementalAdminAreas[1].EnglishName;
            state = geoResponse.data.AdministrativeArea.EnglishName;

            // Update DOM elements
            if (countryName) countryName.textContent = country;
            if (stateName) stateName.textContent = state;
            if (villageName) villageName.textContent = localName;

            allInfoLocation = {
                locationKey, country, state, localName
            };

            // Fetch and display weather data
            await weatherData(allInfoLocation);

        } catch (error) {
            console.error("Error occurred: ", error);
        }
    })(); // End of IIFE

    // Function to fetch and process weather data
    async function weatherData(info) {
        var weatherUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${info.locationKey}?apikey=${ApiKey}`;
        
        try {
            const weatherResponse = await axios.get(weatherUrl);
            console.log(weatherResponse);

            // var allDates = {
            //     date1: weatherResponse.data.DailyForecasts[0].Date,
            //     date2: weatherResponse.data.DailyForecasts[1].Date,
            //     date3: weatherResponse.data.DailyForecasts[2].Date,
            //     date4: weatherResponse.data.DailyForecasts[3].Date,
            //     date5: weatherResponse.data.DailyForecasts[4].Date // Fixed duplicate key
            // };
            var dates=document.querySelectorAll('.weekname');
            var temp=0
            dates.forEach((date)=>{
                var timeDate= weatherResponse.data.DailyForecasts[temp].Date;
                date.textContent=timeDate.slice(0,10);
                temp++;
            })
            var boxes=document.querySelectorAll('.btn')
            var boxMinTemp=document.querySelectorAll('#min-Temp');
            var boxMaxTemp=document.querySelectorAll('#max-Temp');
            var a=0;
            boxMinTemp.forEach((minTemp)=>{
                minTemp.textContent=weatherResponse.data.DailyForecasts[a].Temperature.Minimum.Value ;
                a++;
            })
            var b=0;
            boxMaxTemp.forEach((maxTemp)=>{
                maxTemp.textContent=weatherResponse.data.DailyForecasts[b].Temperature.Maximum.Value;
                b++;
            })
            var innerDayName=document.querySelector('.day-name');
            await weatherInfo(weatherResponse,boxes,innerDayName);

        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }
    async function  weatherInfo(weatherResponse,boxes,innerDayName){
        boxes.forEach((box)=>{
            box.addEventListener('click',()=>{
                var dayString=box.querySelector('.weekname').textContent;
                console.log(dayString);
                const day=new Date(dayString);
                // const date = new Date(we); // Create a Date object from the input string
                const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                innerDayName.textContent= daysOfWeek[day.getDay()];
                var fHeat=document.querySelector('#fHeat');
                var maxFHeat=document.querySelector('#max-fHeat');
                var minFHeat=document.querySelector('#min-fHeat');
                var maxiTemp=box.querySelector('#max-Temp').textContent;
                var miniTemp=box.querySelector('#min-Temp').textContent;
                minFHeat.textContent=`${miniTemp} F`;
                maxFHeat.textContent=`${maxiTemp} F`;
                fHeat.textContent=`${maxiTemp} F`;
                // max degree celcious
                var maxNumerator=parseInt((maxiTemp-32)*5);
                var totalMax=maxNumerator/9;
               var cdegree=document.querySelector('#cdegree');
               cdegree.textContent=`${totalMax.toFixed(2)} °C`;
               // min degree celcios
               var minNumerator=parseInt((miniTemp-32)*5);
               var totalMin=minNumerator/9;
               var minDegree=document.querySelector('#min-degree');
               var maxDegree=document.querySelector('#max-degree');
               minDegree.textContent=`${totalMin.toFixed(2)} °C`;
               maxDegree.textContent=`${totalMax.toFixed(2)} °C`;
            })
        })
    }
});
