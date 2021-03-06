import { select, json, scaleLinear, scaleTime, axisLeft, axisBottom, format, extent, max, timeFormat } from 'd3'

const width = document.body.clientWidth
const height = document.body.clientHeight - 200

const container = select('#container')
    .attr('width', width)
    .attr('height', height)
const svg = container.select('svg')
    .attr('width', width)
    .attr('height', height)
const div = container.select('div').style("opacity", 0)


const render = dataArr => {

    const xValue = d => d[0]
    const xAxisLabel = 'Year'
    const yValue = d => d[1]
    const yAxisLabel = 'Value (in billions)'
    const margin = {top: 40, right:50, bottom: 75, left: 100}
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const xScale = scaleTime()
        .domain(extent(dataArr,xValue))
        .range([0, innerWidth])
    
    const yScale = scaleLinear()
        .domain([0, max(dataArr,yValue)])
        .range([0,innerHeight])
       

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const xAxis = axisBottom(xScale)
        .tickPadding(10)

    const xAxisG = g.append('g').call(xAxis)
        .attr('id', 'x-axis')
       .attr('transform', `translate(0, ${innerHeight})`) 

        xAxisG.append('text')
            .attr('class', 'axis-label')
            .attr('y', 60)
            .attr('x', innerWidth/2)
            .text(xAxisLabel)

    const yAxisTickFormat = number =>
    format('.1s')(number)
        .replace('G', 'B')

    const yAxisScale = scaleLinear()
    .domain([0, max(dataArr,yValue)])
    .range([innerHeight,0])
    
    const yAxis = axisLeft(yAxisScale)
                .tickPadding(10)
                .tickFormat(yAxisTickFormat)


        
    const yAxisG = g.append('g').call(yAxis)
                    .attr('id', 'y-axis')
                    .attr('transform', `translate(0, 0)`)
                      
        yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y',  -60)
        .attr('x',  - innerHeight/2)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)


    g.selectAll('rect')
        .data(dataArr)
        .enter()
        .append('rect')
        .attr('x', d => xScale(xValue(d)))
        .attr('y', d => innerHeight - yScale(yValue(d)) )
        .attr('width', width/dataArr.length)
        .attr('height',  d => yScale(yValue(d)))
        .attr('class', 'bar')
        .attr('data-date', xValue)
        .attr('data-gdp', yValue)
        .on("mouseover", function(d) {
            div.attr('data-date', xValue(d))
            div.attr('data-value', yValue(d))
            .html('Date : ' + timeFormat("%Y-%m")(xValue(d)) + '<br/>' +' Value : '+ yValue(d) + ' billions of dollars')
                .style("opacity", 1)
        })
        .on("mouseout", function(d) {
            div.style("opacity", 0);
            });

}

json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
      const dataArr = data.data
        dataArr.forEach((d) => {
            d[0] = new Date(d[0]);
            d[1] = +d[1];  
    });
    render(dataArr);
  });

