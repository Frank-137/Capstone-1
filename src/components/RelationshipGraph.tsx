
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { RelationshipGraph, HistoricalEvent } from '@/lib/types';
import { getEventById } from '@/data/events';

interface RelationshipGraphProps {
  graph: RelationshipGraph;
  onSelectEvent: (event: HistoricalEvent) => void;
  selectedEventId: string | null;
}

const RelationshipGraphVisualization: React.FC<RelationshipGraphProps> = ({
  graph,
  onSelectEvent,
  selectedEventId
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });
  
  // Create and update the D3 simulation when data changes
  useEffect(() => {
    if (!svgRef.current || !graph.nodes.length) return;
    
    // Clear existing graph
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Set up the simulation
    const simulation = d3.forceSimulation(graph.nodes as any)
      .force("link", d3.forceLink(graph.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(30));
    
    // Draw links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.strength))
      .attr("stroke", "#aaa")
      .attr("stroke-opacity", 0.6);
    
    // Create a group for each node
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .join("g")
      .attr("class", "node")
      .on("click", (event, d) => {
        const eventData = getEventById(d.id);
        if (eventData) {
          onSelectEvent(eventData);
        }
      })
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      );
    
    // Add circles to nodes
    node.append("circle")
      .attr("r", 12)
      .attr("fill", d => {
        switch (d.type) {
          case 'battle': return 'rgb(213, 94, 0)';
          case 'treaty': return 'rgb(0, 114, 178)';
          case 'political': return 'rgb(204, 121, 167)';
          case 'economic': return 'rgb(0, 158, 115)';
          default: return '#999';
        }
      })
      .attr("stroke", d => d.id === selectedEventId ? '#fff' : 'transparent')
      .attr("stroke-width", 2);
    
    // Add text labels to nodes
    node.append("text")
      .text(d => {
        // Only show first few characters of the label
        const shortLabel = d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label;
        return shortLabel;
      })
      .attr('x', 16)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('fill', '#fff');
    
    // Tooltip on hover
    node.append("title")
      .text(d => d.label);
    
    // Update positions on each tick of the simulation
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);
      
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });
    
    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Clean up on unmount
    return () => {
      simulation.stop();
    };
  }, [graph, dimensions, onSelectEvent, selectedEventId]);
  
  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="overflow-visible"
      />
    </div>
  );
};

export default RelationshipGraphVisualization;
