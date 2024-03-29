let runnerWeight = 8
let lane = 20
let width = 800
let height = 500
let padding = 150

let data

function setup() {
  recalculateScale()
  const canvas = createCanvas(width, height)
  canvas.parent('sketch-holder');

  fetchData().then(response => {
    data = response
  })
}

const getNames = (data) => data.map(entry => entry.nome)
const getLength = (data) => data.map(entry => parseFloat(entry.km))
const countRunners = (data) => getNames(data).length
const getColors = (data) => data.map(entry => color(entry.color))
const getTeams = (data) => {
  let teamIds = data.map(entry => parseInt(entry.team))
  teamIds = Array.from(new Set(teamIds))
  const teams = []

  teamIds.forEach(id => {
    teams.push(data.filter(entry => parseInt(entry.team) === id))
  })

  return teams
}
const countTeams = (data) => getTeams(data).length
const getScale = (data) => Math.ceil(getMaxLength(data) / 40) * 40 / 4
const isDrawingTeams = (data) => countTeams(data) > 1
const getMaxLength = (data) => {
  if (isDrawingTeams(data)) {
    const teams = getTeams(data)
    const lengths = teams.map(team =>
        team.reduce((t1, t2) => parseFloat(t1.km) + parseFloat(t2.km)))
    return Math.max(...lengths)
  } else {
    const lengths = getLength(data)
    return Math.max(...lengths)
  }
}

function windowResized() {
  recalculateScale()
  resizeCanvas(width, height);
}

function recalculateScale() {
  width = document.getElementById('sketch-holder').offsetWidth
  height = 2 * width / 3
  padding = height / 4
  lane = height / 30
  runnerWeight = lane / 2
}


function draw() {
  noFill()
  background(255)
  drawBackground()
  if (data)
  {
    drawTrack()
    if (isDrawingTeams(data))
    {
      drawTeams()
      drawTeamLabels()
    } else {
      drawRunnerLabels()
      drawRunners()
    }
  }
}

function drawRunners() {
  const runners = countRunners(data)
  const runnersLength = getLength(data)
  const scale = getScale(data)
  const nLanes = runners + 1

  if (!countRunners(data)){
    return
  }

  noFill()
  strokeWeight(runnerWeight)

  for(let j = 0; j < runners; j++)
  {
    const fillColor = getColors(data)[j]
    fillColor.setAlpha(255)
    stroke(fillColor)
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

function drawTeams() {
  const teams = getTeams(data)
  const runners = teams.length
  const nLanes = runners + 1

  noFill()
  strokeWeight(runnerWeight)
  for(let j = 0; j < runners; j++)
  {
    const runnersLength = getLength(teams[j])
    const colors = getColors(teams[j])
    const scale = getScale(data)
    let position = 0
    let angle = -PI/2

    for(let k = 0; k < teams[j].length; k++)
    {
      const startPosition = position
      position += runnersLength[k]

      const fillColor = colors[k]
      fillColor.setAlpha(255)

      stroke(fillColor)
      if (position > 0 && startPosition < scale)
      {
        const lengthRatio = position >= scale ?
              1 :
              position / scale

        line(
          padding + startPosition,
          padding + j * lane + lane / 2,
          width - padding - (1 - lengthRatio) * (width - 2 * padding),
          padding + j * lane + lane / 2)
      }

      if (position > scale && startPosition < 2 * scale)
      {
        const lengthRatio = position >= 2 * scale ?
              1 :
              (position - scale) / scale

        const endAngle = -PI/2 + PI * lengthRatio

        arc(
          width - padding,
          height / 2,
          2 * padding - j * 2 * lane - lane,
          2 * padding - j * 2 * lane - lane,
          angle,
          endAngle)

        angle = endAngle
      }

      if (position > 2 * scale && startPosition < 3 * scale)
      {
        const lengthRatio = position >= 3 * scale ?
              1 :
              (position - 2 * scale) / scale

        const startPositionLengthRatio = startPosition <= 2 * scale ?
              0 :
              (startPosition - 2 * scale) / scale

        line(
          padding + (1 - lengthRatio) * (width - 2 * padding),
          height - padding - j * lane - lane / 2,
          width - padding - startPositionLengthRatio * (width - 2 * padding),
          height - padding - j * lane - lane / 2)
      }

      if (position > 3 * scale)
      {
        const lengthRatio = position >= 4 * scale ?
              1 :
              (position - 3 * scale) / scale

        const endAngle = PI / 2 + PI * lengthRatio

        arc(
          padding,
          height / 2,
          2 * padding - j * 2 * lane - lane,
          2 * padding - j * 2 * lane - lane,
          angle,
          endAngle)

        angle = endAngle
      }
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
  const names = getNames(data)
  const runners = countRunners(data)
  const nLanes = runners + 1
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

function drawTeamLabels() {
  const teams = getTeams(data)
  const scale = getScale(data)

  stroke(0)
  strokeWeight(1)
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

  teams.forEach((team, n) => {
    const teamNames = getNames(team)
    const teamLength = getLength(team)
    const teamColors = getColors(team)

    const name = teamNames.reduce((t1, t2) => `${t1}/${t2}`)
    const runnersLength = nf(teamLength.reduce((t1, t2) => t1 + t2), 0, 2)

    fill(0)
    strokeWeight(0)
    const x = 1.4 * padding + Math.floor(n / 3) * 2 * padding
    const y = height - 0.75 * padding + (n % 3) * 20
    textAlign(LEFT);
    text(name, x, y)
    textAlign(RIGHT);
    text(runnersLength, x + 120, y)

    teamColors.forEach((color, index) => {
      fill(color)
      const rectSize = 15
      const pairNumber = Math.floor(index / 2)
      const rectTextDistance = 8 * (pairNumber + 1)
      const isPair = index % 2 === 0

      if (isPair) {
        triangle(
          x - rectTextDistance - rectSize, y - rectSize,
          x - rectTextDistance - rectSize, y,
          x - 7, y)
      } else {
        triangle(
          x - rectTextDistance - rectSize, y - rectSize,
          x - rectTextDistance, y - rectSize,
          x - rectTextDistance, y)
      }
    })

    textAlign(LEFT);
    fill(0)
  })
}

function drawRunnerLabels() {
  const names = getNames(data)
  const scale = getScale(data)
  const runnersLength = getLength(data)
  const colors = getColors(data)

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
    const x = 1.2 * padding + Math.floor(n / 3) * 2 * padding
    const y = height - 0.75 * padding + (n % 3) * 20
    text(`${names[n]}:\t ${runnersLength[n]}`, x, y)
    fill(colors[n])
    rect(x - 15, y - 8, 8, 8)
    fill(0)
  }
}

function fetchData() {
  return fetch('https://docs.google.com/spreadsheets/d/1RvBt-GXz7kKzYj3XLpwatdMNZxKjwq3qqx5sm_WRzb4/gviz/tq?tqx=out:json', {
    headers: {
      'Content-Type': 'text/plain',
    }
  })
    .then(response => response.text())
    .then(data => {
      const r = data.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)
      data = (JSON.parse(r[1])).table
      const labels = data.cols.map(d => d.label).filter(l => l)
      const rows = []
      data.rows.forEach(r => {
        const rowObj = {}
        for(let l = 0; l < labels.length; l++){
          rowObj[labels[l]] = r.c[l]?.f ?? r.c[l]?.v
        }
        rows.push(rowObj)
      })

      if (parseFloat(rows[0].km)) {
        rows.sort((a, b) => b.km - a.km)
      }

		  return rows;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
