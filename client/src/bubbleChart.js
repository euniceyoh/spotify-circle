import React, { useState, useEffect, useRef } from "react";
import firestoredb from './firebase'
import * as d3 from 'd3';

function BubbleChart() {
    // dummy data
    const[dataIn, setData] = useState([
    { name: "A", similarityScore: 50 },
    { name: "B", similarityScore: 20},
    { name: "C", similarityScore: 5},
    { name: "Bob", similarityScore: 30},
    { name: "Joe Shmoe", similarityScore: 42},
    { name: "Bobby Shmurda", similarityScore: 35}
    ])

    const width = 800;
    const height = 400;

    const svgRef = useRef() // not sure what this does

    useEffect(() => {

        //var svg = d3.select("#chart")

        const svg = d3.select(svgRef.current)
        .append("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("transform", "translate(0,0)");

        // Simulation is collection of forces that determines where our elements go
        // First we force circles to middle with x and y, then we force them apart
        var simulation = d3.forceSimulation()
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05))
            .force("collide", d3.forceCollide( d => radiusScale(d.similarityScore)))

        // Domain: smallest vs. largest input from data
        // Range: smallest vs. largest display size
        var radiusScale = d3.scaleSqrt().domain([1, 100]).range([10, 100])

        var element = svg.selectAll(".bubble")
            .data(dataIn) //
            .enter()
            .append("g")
            //.attr("transform", function(d) { return "translate(150,100)" })

        var circles = element
            .append("circle")
            //.attr("class", "bubble")
            .attr("r", d => radiusScale(d.similarityScore))
            .attr("fill", "lightblue")
            //.attr("cx", 100)
            //.attr("cy", 300)
            .on("click", function(event, d) {
                console.log(d);
            })
            //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })

        var labels = element
            .append("text")
            //.attr('dy', '.5em')
            .attr('text-anchor', 'middle')
            .style('fill', 'white')
            .style('font-size', 15)
            .text(function(d) {
                return d.name;
            })
            //.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })

        simulation.nodes(dataIn)
            .on("tick", ticked)

        function ticked() {
            circles
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });

            labels
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" });
        }
    }, [dataIn])

    return (
        <div>
             <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 800"
                ref={svgRef}>
            </svg>
        </div>
    )
}

export default BubbleChart;
