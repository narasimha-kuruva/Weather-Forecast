
    window.addEventListener('load',()=>{
        var lat,long,country,locationKey,localName,timeZone,allInfoLocation,ApiKey;
        navigator.geolocation.getCurrentPosition((position)=>{
            console.log("position : ",position);
            lat=position['coords']['latitude'];
            long=position['coords']['longitude'];
            console.log(`lattitude = ${lat},longitude = ${long}`);
            ApiKey='3AP1lPR5Xu5ScuBmfGWbbshckrag9XLK';
            // var URL="http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=3AP1lPR5Xu5ScuBmfGWbbshckrag9XLK&q=17.4686208%2C78.39744&language=en-us"
           var geoPositionUrl=`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ApiKey}&q=${lat},${long}&language=en-us`
           
           axios.get(geoPositionUrl)
           .then((response)=>{
                console.log(response);
                locationKey=response.data.Key;
                country=response.data.Country.EnglishName;
                localName=response.data.SupplementalAdminAreas[1].EnglishName;
                timeZone=response.data.TimeZone;
                allInfoLocation={
                    locationKey,country,localName,timeZone
                };
                console.log(allInfoLocation);
                weatherData(ApiKey,locationKey);
           })
           
        })
    })
    function weatherData(ApiKey,locationKey){
       var weatherUrl=`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${ApiKey}`;
       axios.get(weatherUrl)
       .then((response)=>{
        console.log(response);
        var date=response.data.DailyForecasts[3].Date;
        
        
       })
    }

