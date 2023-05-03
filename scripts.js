const chartCanvas = document.getElementById('chart');
const chartCtx = chartCanvas.getContext('2d');
const chartType = document.getElementById('chart-type');

document.getElementById('add-data-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let value = parseFloat(document.getElementById('value').value);

    if (name && value) {
        let newRow = document.createElement('tr');
        newRow.innerHTML = `<td>${name}</td><td>${value}</td>`;
        document.getElementById('data-table').appendChild(newRow);

        drawChart(chartCtx, getData(), chartType.value);
    }
});

chartType.addEventListener('change', () => drawChart(chartCtx, getData(), chartType.value));

function getData() {
    let data = [];
    let rows = document.getElementById('data-table').rows;

    for (let i = 1; i < rows.length; i++) {
        let name = rows[i].cells[0].innerText;
        let value = parseFloat(rows[i].cells[1].innerText);
        data.push({ name, value });
    }

    return data;
}

function drawChart(ctx, data, type) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (type === 'bar') {
        drawBarChart(ctx, data);
    } else if (type === 'pie') {
        drawPieChart(ctx, data);
    } else if (type === 'doughnut') {
        drawDoughnutChart(ctx, data);
    } else if (type === 'line') {
        drawLineChart(ctx, data);
    }
}

function drawBarChart(ctx, data) {
  let maxValue = Math.max(...data.map(item => item.value));
  let colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#e91e63', '#ffc107'];
  let canvas = ctx.canvas;
  let barWidth = 50;
  let barSpacing = (canvas.width - data.length * barWidth) / (data.length + 1);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  data.forEach((item, index) => {
    let barHeight = (item.value / maxValue) * (canvas.height - 50);
    let posX = barSpacing + index * (barWidth + barSpacing);
    let posY = canvas.height - barHeight;

    ctx.fillStyle = colors[index];
    ctx.fillRect(posX, posY, barWidth, barHeight);

    ctx.fillStyle = 'black';
    ctx.fillText(item.value, posX + barWidth / 2 - 10, posY - 10);
  });
}

function drawPieChart(ctx, data) {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  let colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#e91e63', '#ffc107'];
  let canvas = ctx.canvas;
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let radius = Math.min(canvas.width, canvas.height) / 2 - 50;

  let startAngle = 0;
  let endAngle = 0;

  ctx.clearRect(0, 0, canvas.width,canvas.height);

data.forEach((item, index) => {
let angle = (item.value / total) * 2 * Math.PI;
endAngle = startAngle + angle;
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.arc(centerX, centerY, radius, startAngle, endAngle);
ctx.lineTo(centerX, centerY);
ctx.closePath();

ctx.fillStyle = colors[index];
ctx.fill();

startAngle = endAngle;

let textX = centerX + radius * Math.cos(startAngle - angle / 2);
let textY = centerY + radius * Math.sin(startAngle - angle / 2);
ctx.fillStyle = 'black';
ctx.fillText(item.value, textX, textY);
});
}
function drawDoughnutChart(ctx, data) {
let total = data.reduce((sum, item) => sum + item.value, 0);
let colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#e91e63', '#ffc107'];
let canvas = ctx.canvas;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let radius = Math.min(canvas.width, canvas.height) / 2 - 50;
let innerRadius = radius * 0.5;

let startAngle = 0;
let endAngle = 0;

ctx.clearRect(0, 0, canvas.width, canvas.height);

data.forEach((item, index) => {
let angle = (item.value / total) * 2 * Math.PI;
endAngle = startAngle + angle;
ctx.beginPath();
ctx.arc(centerX, centerY, radius, startAngle, endAngle);
ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
ctx.closePath();

ctx.fillStyle = colors[index];
ctx.fill();

startAngle = endAngle;

let textX = centerX + (radius * 0.75) * Math.cos(startAngle - angle / 2);
let textY = centerY + (radius * 0.75) * Math.sin(startAngle - angle / 2);
ctx.fillStyle = 'black';
ctx.fillText(item.value, textX, textY);
});
}

function drawLineChart(ctx, data) {
let maxValue = Math.max(...data.map(item => item.value));
let colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b', '#9c27b0', '#e91e63', '#ffc107'];
let canvas = ctx.canvas;
let padding = 50;
let startX = padding;
let startY = canvas.height - padding;
let endX = canvas.width - padding;
let endY = padding;

ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.beginPath();
ctx.moveTo(startX, startY);
ctx.lineTo(startX, endY);
ctx.lineTo(endX, endY);
ctx.stroke();

let stepX = (canvas.width - 2 * padding) / (data.length - 1);
let currentX = startX;

data.forEach((item, index) => {
let posY = startY - (item.value / maxValue) * (canvas.height - 2 * padding);
ctx.beginPath();
ctx.arc(currentX, posY, 5, 0, 2 * Math.PI);
ctx.fillStyle = colors[index];
ctx.fill();
ctx.stroke();
ctx.fillStyle = 'black';
ctx.fillText(item.value, currentX - 10, posY - 10);

if (index < data.length - 1) {
  let nextX = currentX + stepX;
  let nextY = startY - (data[index + 1].value / maxValue) * (canvas.height - 2 * padding);
  ctx.beginPath();
  ctx.moveTo(currentX, posY);
  ctx.lineTo(nextX, nextY);
  ctx.stroke();
}

currentX += stepX;
});
}

function addData(name, value) {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${name}</td><td>${value}</td>`;
    document.getElementById('data-table').appendChild(newRow);
    drawChart(chartCtx, getData(), chartType.value);
}

addData('Apple', 50);
addData('Banana', 80);
addData('Cherry', 30);
addData('Date', 70);

drawChart(chartCtx, getData(), chartType.value);
