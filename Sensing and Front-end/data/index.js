

const ButtonAllTime = document.getElementById('ButtonAllTime');
const Button30Days = document.getElementById('Button30Days');
const Button7Days = document.getElementById('Button7Days');
const Button1Days = document.getElementById('Button1Days');

const ButtonDownload = document.getElementById('ButtonDownload');

// function getGraphData() {

//     $.post("/api/getGraphData", {

//         numdays: 30
  
//       }, function (err, req, resp) {
        
//         console.log(resp);
//       });

// }
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  script.onerror = () => {
    setTimeout(() => loadScript(src, callback), 2000); // Retry after 2 seconds
  };
  document.head.appendChild(script);
}

// FUNCTION FOR GETDATA 1 DAY
function getGraphData1() {
  const requestData = {
    numdays: 1
  };
  loadScript('/chart.min.js', function() {
    // Script loaded successfully, you can now use the Chart.js library
    console.log('Chart.js loaded!');
  });

  fetch("/api/getGraphData1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Received data:", data);
       // Extract x labels and y values from sampleData
       const labels = ["0 hrs", "", "1 hrs", "", "2 hrs", "", "3 hrs", "", "4 hrs", "", "5 hrs", "", "6 hrs", "", "7 hrs", "", "8 hrs", "", "9 hrs", "", "10 hrs", "", "11 hrs", "", "12 hrs", "", "13 hrs", "", "14 hrs", "", "15 hrs", "", "16 hrs", " ", "17 hrs", "", "18 hrs", "", "19 hrs", "", "20 hrs", "", "21 hrs", "", "22 hrs", "", "23 hrs", "", "24 hrs"];
       const values = data[0].temps;
       const valueslow = data[0].tempLows;

       // DO Temperature GRAPH
       // Create chart data and configuration
       const graphdata = {
        labels: labels,
        datasets: [
          {
            label: 'Max Temperature',
            data: values, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Temperature',
            data: valueslow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(9, 66, 61, 1)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const config = {
        type: 'line',
        data: graphdata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Temperature Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Temperature Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };
      




       // DO HUMIDITY GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const valueshumidity = data[0].humidities;
       const valueshumidityLow = data[0].humiditiesLows;
       // Create chart data and configuration
       const graphdataHumidity = {
        labels: labels,
        datasets: [
          {
            label: 'Max Humidiy',
            data: valueshumidity, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Humidity',
            data: valueshumidityLow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const configHumidity = {
        type: 'line',
        data: graphdataHumidity,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Humidity Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Humidity Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };

       // Create the chart
       var myChart = new Chart(document.getElementById('tempChart'), config);
       var myChartHumidity = new Chart(document.getElementById('humidityChart'), configHumidity);
      
      // Display the received Temperature Information
      const tempRangeElement = document.getElementById('tempRange');
      // Update the text content of the <span> element
      tempRangeElement.textContent = data[0].minTemp[0] + "-"+data[0].maxTemp[0] + " Degrees";
      
      const temptotalReadingsElement = document.getElementById('tempTotalReadings');
      // Update the text content of the <span> element
      temptotalReadingsElement.textContent = data[0].totalreadings[0] + "";

      const tempTIR = document.getElementById('tempTIR');
      tempTIR.textContent = Math.round(data[0].readingsInRange[0]/data[0].totalreadings[0]*100) + " %";

      var temptotal = 0;
      for (var i = 0; i < values.length; i++) {
        temptotal += values[i];
      }
      var temptotal = temptotal/values.length;

      const tempAverage = document.getElementById('tempAverage');
      // Update the text content of the <span> element
      tempAverage.textContent = Math.round(temptotal) + " Degrees";



      // Humidity Information
      const humRange = document.getElementById('humRange');
      // Update the text content of the <span> element
      humRange.textContent = data[0].minHumidity[0] + "-"+data[0].maxHumidity[0] + " % RH";

      var humtotal = 0;
      for (var i = 0; i < valueshumidity.length; i++) {
        humtotal += valueshumidity[i];
      }
      var humtotal = humtotal/valueshumidity.length;

      
      const humAverage = document.getElementById('humAverage');
      // Update the text content of the <span> element
      humAverage.textContent = Math.round(humtotal) + " % RH";

      const humTotalReadings = document.getElementById('humTotalReadings');
      // Update the text content of the <span> element
      humTotalReadings.textContent = data[0].totalreadings[0] + "";
    })
    .catch(error => {
      console.error("Error:", error);
    });
}



// FUNCTION FOR GETDATA 7 DAYS
function getGraphData7() {
  const requestData = {
    numdays: 7
  };
  loadScript('/chart.min.js', function() {
    // Script loaded successfully, you can now use the Chart.js library
    console.log('Chart.js loaded!');
  });

  fetch("/api/getGraphData7", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Received data:", data);
       // Extract x labels and y values from sampleData
       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       //const labels = ["0 hrs", "", "1 hrs", "", "2 hrs", "", "3 hrs", "", "4 hrs", "", "5 hrs", "", "6 hrs", "", "7 hrs", "", "8 hrs", "", "9 hrs", "", "10 hrs", "", "11 hrs", "", "12 hrs", "", "13 hrs", "", "14 hrs", "", "15 hrs", "", "16 hrs", "", "17 hrs", "", "18 hrs", "", "19 hrs", "", "20 hrs", "", "21 hrs", "", "22 hrs", "", "23 hrs", "", "24 hrs"];
       const labels = ["Day 0", "", "", "", "Day 2", "", "", "", "Day 3", "", "", "", "Day 4", "", "", "", "Day 5", "", "", "", "Day 6", "", "", "", "Day 7", "", "", ""];
       const values = data[0].temps;
       const valueslow = data[0].tempLows;

       // DO Temperature GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       // Create chart data and configuration
       const graphdata = {
        labels: labels,
        datasets: [
          {
            label: 'Max Temperature ',
            data: values, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Temperature',
            data: valueslow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const config = {
        type: 'line',
        data: graphdata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Temperature Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Temperature Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };
      


       // DO HUMIDITY GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const valueshumidity = data[0].humidities;
       const valueshumidityLow = data[0].humiditiesLows;
       // Create chart data and configuration
       const graphdataHumidity = {
        labels: labels,
        datasets: [
          {
            label: 'Max Humidity',
            data: valueshumidity, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Humidity',
            data: valueshumidityLow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const configHumidity = {
        type: 'line',
        data: graphdataHumidity,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Humidity Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Humidity Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };


       // Create the chart
       var myChart = new Chart(document.getElementById('tempChart'), config);
       var myChartHumidity = new Chart(document.getElementById('humidityChart'), configHumidity);
      // Display the received data or perform additional operations
      // ...
      // Display the received Temperature Information
      const tempRangeElement = document.getElementById('tempRange');
      // Update the text content of the <span> element
      tempRangeElement.textContent = data[0].minTemp[0] + "-"+data[0].maxTemp[0] + " Degrees";
      
      const temptotalReadingsElement = document.getElementById('tempTotalReadings');
      // Update the text content of the <span> element
      temptotalReadingsElement.textContent = data[0].totalreadings[0] + "";

      const tempTIR = document.getElementById('tempTIR');
      tempTIR.textContent = Math.round(data[0].readingsInRange[0]/data[0].totalreadings[0]*100) + " %";

      var temptotal = 0;
      for (var i = 0; i < values.length; i++) {
        temptotal += values[i];
      }
      var temptotal = temptotal/values.length;

      const tempAverage = document.getElementById('tempAverage');
      // Update the text content of the <span> element
      tempAverage.textContent = Math.round(temptotal) + " Degrees";



      // Humidity Information
      const humRange = document.getElementById('humRange');
      // Update the text content of the <span> element
      humRange.textContent = data[0].minHumidity[0] + "-"+data[0].maxHumidity[0] + " % RH";

      var humtotal = 0;
      for (var i = 0; i < valueshumidity.length; i++) {
        humtotal += valueshumidity[i];
      }
      var humtotal = humtotal/valueshumidity.length;

      
      const humAverage = document.getElementById('humAverage');
      // Update the text content of the <span> element
      humAverage.textContent = Math.round(humtotal) + " % RH";

      const humTotalReadings = document.getElementById('humTotalReadings');
      // Update the text content of the <span> element
      humTotalReadings.textContent = data[0].totalreadings[0] + "";
    })
    .catch(error => {
      console.error("Error:", error);
    });
}


// FUNCTION FOR GET DATA ALL
function getGraphDataAll() {
  const requestData = {
    numdays: 100
  };
  loadScript('/chart.min.js', function() {
    // Script loaded successfully, you can now use the Chart.js library
    console.log('Chart.js loaded!');
  });

  fetch("/api/getGraphDataAll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Received data:", data);
       // Extract x labels and y values from sampleData
       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10", "Day 11", "Day 12", "Day 13", "Day 14", "Day 15", "Day 16", "Day 17", "Day 18", "Day 19", "Day 20", "Day 21", "Day 22", "Day 23", "Day 24", "Day 25", "Day 26", "Day 27", "Day 28", "Day 29", "Day 30", "Day 31", "Day 32", "Day 33", "Day 34", "Day 35", "Day 36", "Day 37", "Day 38", "Day 39", "Day 40", "Day 41", "Day 42", "Day 43", "Day 44", "Day 45", "Day 46", "Day 47", "Day 48", "Day 49", "Day 50"];
       const values = data[0].temps;
       const valueslow = data[0].tempLows;

       // DO Temperature GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       // Create chart data and configuration
       const graphdata = {
        labels: labels,
        datasets: [
          {
            label: 'Max Temperature',
            data: values, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Temperature',
            data: valueslow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const config = {
        type: 'line',
        data: graphdata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Temperature Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Temperature Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };
      
       // DO HUMIDITY GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const valueshumidity = data[0].humidities;
       const valueshumidityLow = data[0].humiditiesLows;
       // Create chart data and configuration
       const graphdataHumidity = {
        labels: labels,
        datasets: [
          {
            label: 'Max Humidity',
            data: valueshumidity, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Humidity',
            data: valueshumidityLow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const configHumidity = {
        type: 'line',
        data: graphdataHumidity,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Humidity Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Humidity Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };

       // Create the chart
       var myChart = new Chart(document.getElementById('tempChart'), config);
       var myChartHumidity = new Chart(document.getElementById('humidityChart'), configHumidity);
      // Display the received data or perform additional operations
      // ...
      // Display the received Temperature Information
      const tempRangeElement = document.getElementById('tempRange');
      // Update the text content of the <span> element
      tempRangeElement.textContent = data[0].minTemp[0] + "-"+data[0].maxTemp[0] + " Degrees";
      
      const temptotalReadingsElement = document.getElementById('tempTotalReadings');
      // Update the text content of the <span> element
      temptotalReadingsElement.textContent = data[0].totalreadings[0] + "";

      const tempTIR = document.getElementById('tempTIR');
      tempTIR.textContent = Math.round(data[0].readingsInRange[0]/data[0].totalreadings[0]*100) + " %";

      var temptotal = 0;
      for (var i = 0; i < values.length; i++) {
        temptotal += values[i];
      }
      var temptotal = temptotal/values.length;

      const tempAverage = document.getElementById('tempAverage');
      // Update the text content of the <span> element
      tempAverage.textContent = Math.round(temptotal) + " Degrees";



      // Humidity Information
      const humRange = document.getElementById('humRange');
      // Update the text content of the <span> element
      humRange.textContent = data[0].minHumidity[0] + "-"+data[0].maxHumidity[0] + " % RH";

      var humtotal = 0;
      for (var i = 0; i < valueshumidity.length; i++) {
        humtotal += valueshumidity[i];
      }
      var humtotal = humtotal/valueshumidity.length;

      
      const humAverage = document.getElementById('humAverage');
      // Update the text content of the <span> element
      humAverage.textContent = Math.round(humtotal) + " % RH";

      const humTotalReadings = document.getElementById('humTotalReadings');
      // Update the text content of the <span> element
      humTotalReadings.textContent = data[0].totalreadings[0] + "";
    })
    .catch(error => {
      console.error("Error:", error);
    });
}



// FUNCTION FOR 30 DAYS
function getGraphData30() {
  const requestData = {
    numdays: 30
  };
  loadScript('/chart.min.js', function() {
    // Script loaded successfully, you can now use the Chart.js library
    console.log('Chart.js loaded!');
  });

  fetch("/api/getGraphData30", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Received data:", data);
       // Extract x labels and y values from sampleData
       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const labels = ["Day 1", "Day 1.5", "Day 2", "Day 2.5", "Day 3", "Day 3.5", "Day 4", "Day 4.5", "Day 5", "Day 5.5", "Day 6", "Day 6.5", "Day 7", "Day 7.5", "Day 8", "Day 8.5", "Day 9", "Day 9.5", "Day 10", "Day 10.5", "Day 11", "Day 11.5", "Day 12", "Day 12.5", "Day 13", "Day 13.5", "Day 14", "Day 14.5", "Day 15", "Day 15.5", "Day 16", "Day 16.5", "Day 17", "Day 17.5", "Day 18", "Day 18.5", "Day 19", "Day 19.5", "Day 20", "Day 20.5", "Day 21", "Day 21.5", "Day 22", "Day 22.5", "Day 23", "Day 23.5", "Day 24", "Day 24.5", "Day 25", "Day 25.5", "Day 26", "Day 26.5", "Day 27", "Day 27.5", "Day 28", "Day 28.5", "Day 29", "Day 29.5", "Day 30"];
       const values = data[0].temps;
       const valueslow = data[0].tempLows;

       // DO Temperature GRAPH
       // Create chart data and configuration
       const graphdata = {
        labels: labels,
        datasets: [
          {
            label: 'Max Temperature',
            data: values, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Temperature',
            data: valueslow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const config = {
        type: 'line',
        data: graphdata,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Temperature Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Temperature Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };
      
       // DO HUMIDITY GRAPH

       //const labels = [0,1,2,3,4,5,6,7,8,9,0,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47];
       const valueshumidity = data[0].humidities;
       const valueshumidityLow = data[0].humiditiesLows;
       // Create chart data and configuration
       const graphdataHumidity = {
        labels: labels,
        datasets: [
          {
            label: 'Max Humidity',
            data: valueshumidity, // Use y values for the first dataset
            borderColor: 'rgba(0, 150, 136, 1)',
            backgroundColor: 'rgba(0, 150, 136, 0.5)',
            pointBackgroundColor: 'rgba(0, 150, 136, 1)',
            fill: false,
          },
          {
            label: 'Min Humidity',
            data: valueshumidityLow, // Use y values for the second dataset
            borderColor: 'rgba(9, 66, 61, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointBackgroundColor: 'rgba(9, 66, 61, 1)',
            fill: false,
          },
        ],
      };
      
      const configHumidity = {
        type: 'line',
        data: graphdataHumidity,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Humidity Data',
            },
          },
          layout: {
            padding: {
              left: 50,
              right: 50,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Humidity Value',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Time',
              },
            },
          },
        },
      };

       // Create the chart
       var myChart = new Chart(document.getElementById('tempChart'), config);
       var myChartHumidity = new Chart(document.getElementById('humidityChart'), configHumidity);
      // Display the received data or perform additional operations
      // ...
      
      // Display the received Temperature Information
      const tempRangeElement = document.getElementById('tempRange');
      // Update the text content of the <span> element
      tempRangeElement.textContent = data[0].minTemp[0] + "-"+data[0].maxTemp[0] + " Degrees";
      
      const temptotalReadingsElement = document.getElementById('tempTotalReadings');
      // Update the text content of the <span> element
      temptotalReadingsElement.textContent = data[0].totalreadings[0] + "";

      const tempTIR = document.getElementById('tempTIR');
      tempTIR.textContent = Math.round(data[0].readingsInRange[0]/data[0].totalreadings[0]*100) + " %";

      var temptotal = 0;
      for (var i = 0; i < values.length; i++) {
        temptotal += values[i];
      }
      var temptotal = temptotal/values.length;

      const tempAverage = document.getElementById('tempAverage');
      // Update the text content of the <span> element
      tempAverage.textContent = Math.round(temptotal) + " Degrees";



      // Humidity Information
      const humRange = document.getElementById('humRange');
      // Update the text content of the <span> element
      humRange.textContent = data[0].minHumidity[0] + "-"+data[0].maxHumidity[0] + " % RH";

      var humtotal = 0;
      for (var i = 0; i < valueshumidity.length; i++) {
        humtotal += valueshumidity[i];
      }
      var humtotal = humtotal/valueshumidity.length;

      
      const humAverage = document.getElementById('humAverage');
      // Update the text content of the <span> element
      humAverage.textContent = Math.round(humtotal) + " % RH";

      const humTotalReadings = document.getElementById('humTotalReadings');
      // Update the text content of the <span> element
      humTotalReadings.textContent = data[0].totalreadings[0] + "";
      
    })
    .catch(error => {
      console.error("Error:", error);
    });
}


// Listeners
Button30Days.addEventListener("click", getGraphData30);

Button7Days.addEventListener("click", getGraphData7);

Button1Days.addEventListener("click", getGraphData1);

ButtonAllTime.addEventListener("click", getGraphDataAll);


// Add a click event listener to the button
document.getElementById('ButtonPDFDownload').addEventListener('click', () => {
  window.print();
});



document.getElementById('ButtonRawDownload').addEventListener('click', () => {
  console.log("Downloading");
  window.location.href = '/SensorData.txt';
});