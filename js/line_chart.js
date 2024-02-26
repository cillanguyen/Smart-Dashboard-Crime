google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBasic);

function drawBasic() {

      var data2 = new google.visualization.DataTable();
      data2.addColumn('string', 'Month');
      data2.addColumn('number', 'Total');

      data2.addRows([
        ['Jan', 5716],
        ['Feb', 4908],
        ['Mar', 4929],
        ['Apr', 6154],
        ['May', 6146],
        ['Jun', 5562],
        ['Jul', 6061],
        ['Aug', 6423],
        ['Sep', 5902],
        ['Oct', 6428],
        ['Nov', 5792],
        ['Dec', 5565]
      ]);

      var options2 = {
        hAxis: {
          title: 'Month'
        },
        vAxis: {
          title: 'Amount of Crimes'
        },
        legend: 'none',
        'width': 500, // Set the width of the chart
        'height': 300 // Set the height of the chart
      };

      var chart2 = new google.visualization.LineChart(document.getElementById('line_div'));

      chart2.draw(data2, options2);
    }