let runners = 6
const runnerWeight = 8
const lane = 20
const nLanes = runners + 1
const width = 800
const height = 600
const padding = 150

let scale = 1
let runnersLength = []
let names = []

const colors = [
  {
    r: 165,
    g: 0,
    b: 0
  },
  {
    r: 0,
    g: 165,
    b: 0
  },
  {
    r: 0,
    g: 0,
    b: 165
  },
  {
    r: 165,
    g: 165,
    b: 0
  },
  {
    r: 165,
    g: 0,
    b: 165
  },
  {
    r: 0,
    g: 165,
    b: 165
  },
  {
    r: 20,
    g: 20,
    b: 20
  },
  {
    r: 80,
    g: 80,
    b: 80
  },
  {
    r: 160,
    g: 160,
    b: 160
  },
  {
    r: 240,
    g: 240,
    b: 240
  }
]

function setup() {
  createCanvas(width, height)
  const data = fetchData().then(response => {
    names = response.map(entry => entry.id)
    runnersLength = response.map(entry => parseFloat(entry.km))
    runners = runnersLength.length
    scale = Math.ceil(Math.max.apply(null, runnersLength) / 40) * 40 / 4
  })
}

function draw() {
  noFill()
  background(255)
  drawBackground()
  drawRunners()
  drawTrack()
  drawLabels()
}

function drawRunners() {
  noFill()
  strokeWeight(runnerWeight)
  for(let j = 0; j < runners; j++)
  {
    stroke(colors[j].r, colors[j].g, colors[j].b)
    if (runnersLength[j] > 0)
    {
      const lengthRatio = runnersLength[j] >= scale ?
            1 :
            runnersLength[j] / scale

      line(
        padding,
        padding + j * lane + lane / 2,
        width - padding - (1 - lengthRatio) * (width - 2 * padding),
        padding + j * lane + lane / 2)
    }

    if (runnersLength[j] > scale)
    {
      const lengthRatio = runnersLength[j] >= 2 * scale ?
            1 :
            (runnersLength[j] - scale) / scale

      arc(
        width - padding,
        height / 2,
        2 * padding - j * 2 * lane - lane,
        2 * padding - j * 2 * lane - lane,
        -PI/2,
        -PI/2 + PI * lengthRatio)
    }

    if (runnersLength[j] > 2 * scale)
    {
      const lengthRatio = runnersLength[j] >= 3 * scale ?
            1 :
            (runnersLength[j] - 2 * scale) / scale

      line(
        padding + (1 - lengthRatio) * (width - 2 * padding),
        height - padding - j * lane - lane / 2,
        width - padding,
        height - padding - j * lane - lane / 2)
    }

    if (runnersLength[j] > 3 * scale)
    {
      const lengthRatio = runnersLength[j] >= 4 * scale ?
            1 :
            (runnersLength[j] - 3 * scale) / scale

      arc(
        padding,
        height / 2,
        2 * padding - j * 2 * lane - lane,
        2 * padding - j * 2 * lane - lane,
        PI / 2,
        PI / 2 + PI * lengthRatio)
    }
  }
}

function drawBackground() {
  strokeWeight(0)
  fill(190, 114, 91)
  rect(
    padding,
    padding,
    width - 2 * padding,
    height- 2 * padding
  )

  arc(
    padding,
    height / 2,
    2 * padding,
    2 * padding,
    PI/2,
    -PI/2)
  arc(
    width - padding,
    height / 2,
    2 * padding,
    2 * padding,
    -PI/2,
    PI/2)
}


function drawTrack() {
  strokeWeight(1)
  stroke(255)
  noFill()
  line(
    padding,
    padding - lane,
    padding,
    padding + nLanes * lane
  )
  line(
    width - padding,
    padding - lane,
    width - padding,
    padding + nLanes * lane
  )
  line(
    width - padding,
    height - padding + lane,
    width - padding,
    height - padding - nLanes * lane,
  )
  line(
    padding,
    height - padding + lane,
    padding,
    height - padding - nLanes * lane,
  )

  for(let i = 0; i < nLanes; i++)
  {
    arc(
      padding,
      height / 2,
      2 * padding - i * 2 * lane,
      2 * padding -i * 2 * lane,
      PI/2,
      -PI/2)
    arc(
      width - padding,
      height / 2,
      2 * padding - i * 2 * lane,
      2 * padding -i * 2 * lane,
      -PI/2,
      PI/2)
    line(
      padding,
      padding + i * lane,
      width - padding,
      padding + i * lane)
    line(
      padding,
      height - padding - i * lane,
      width - padding,
      height - padding - i * lane)
  }
}

function drawLabels() {
  stroke(0)
  text(0,
    padding + 10,
    padding - 30)
  text(4 * scale,
    padding - 20,
    padding - 30)
  text(1 * scale,
    width - padding - 20,
    padding - 30)
  text(2 * scale,
    width - padding - 20,
    height - padding + 30)
  text(3 * scale,
    padding - 20,
    height - padding + 30)

  for (let n = 0; n < names.length; n++)
  {
    fill(0)
    strokeWeight(0)
    const x = 1.2 * padding + Math.floor(n / 3) * padding
    const y = height - 0.75 * padding + (n % 3) * 20
    text(`${names[n]}:\t ${runnersLength[n]}`, x, y)
    fill(colors[n].r, colors[n].g, colors[n].b)
    rect(x - 15, y - 8, 8, 8)
    fill(0)
  }
}

function fetchData() {
  return fetch('https://spreadsheets.google.com/feeds/list/1RvBt-GXz7kKzYj3XLpwatdMNZxKjwq3qqx5sm_WRzb4/1/public/basic?alt=json', {
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      var rows = [];
	    var labels = [];
		  var cells = data.feed.entry;

		  var rowCols = cells[0].content.$t.split(',');

		  labels.push("id");
		  for (var j = 0; j < rowCols.length; j++){
	      var keyVal = rowCols[j].split(':');
	      labels.push(keyVal[0].trim());
	    }

		  for (var i = 0; i < cells.length; i++){
		    var rowObj = {};
		    rowObj.id = cells[i].title.$t;
		    var rowCols = cells[i].content.$t.split(',');

	  	  for (var j = 0; j < rowCols.length; j++){
		      var keyVal = rowCols[j].split(':');
		      rowObj[keyVal[0].trim()] = keyVal[1].trim();
		    }
		    rows.push(rowObj);
        if (parseFloat(rows[0].km)) {
          rows.sort((a, b) => b.km - a.km)
        }
		  }

		  return rows;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
