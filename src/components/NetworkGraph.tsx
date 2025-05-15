
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { NetworkData, NetworkNode, NetworkLink } from '@/lib/solanaApi';
import { Card } from './ui/card';

interface NetworkGraphProps {
  data: NetworkData;
  onNodeClick: (node: NetworkNode) => void;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create the force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink<NetworkNode, NetworkLink>(data.links)
        .id(d => d.id)
        .distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Create the SVG elements
    const svg = d3.select(svgRef.current);

    // Add zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // Create a container group for all our elements (for zooming)
    const container = svg.append("g");

    // Define arrow marker for links
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M-10,-5L0,0L-10,5")
      .attr("fill", "#aaa");

    // Create links
    const link = container.append("g")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#aaa")
      .attr("stroke-width", d => Math.sqrt(d.value))
      .attr("stroke-opacity", 0.4)
      .attr("marker-end", "url(#arrowhead)");

    // Calculate node size based on amount/value
    const getNodeRadius = (node: NetworkNode) => {
      // Base node size on transaction amount or wallet balance
      if (node.type === 'wallet') {
        // For wallet nodes, use balance as a factor (with min and max limits)
        return node.balance ? Math.max(8, Math.min(20, 8 + Math.sqrt(node.balance) * 3)) : 8;
      } else {
        // For transaction nodes, use amount
        return Math.max(6, Math.min(15, Math.sqrt(node.value * 20)));
      }
    };

    // Create nodes group
    const nodeGroup = container.append("g")
      .selectAll(".node")
      .data(data.nodes)
      .join("g")
      .attr("class", "node")
      .call(d3.drag<SVGGElement, NetworkNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles for nodes
    nodeGroup.append("circle")
      .attr("r", getNodeRadius)
      .attr("fill", d => d.color || "#666")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("fill-opacity", 0.8)
      .attr("stroke-opacity", 0.8);

    // Add labels for nodes
    nodeGroup.append("text")
      .text(d => d.label)
      .attr("font-size", 10)
      .attr("dx", d => getNodeRadius(d) + 5)
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("pointer-events", "none");

    // Add event listeners for nodes
    nodeGroup
      .on("click", (event, d) => {
        // For wallet nodes, open Solscan in new tab
        if (d.type === 'wallet') {
          window.open(`https://solscan.io/account/${d.id}`, '_blank');
        }
        onNodeClick(d);
      })
      .on("mouseover", (event, d) => {
        const tooltip = d3.select(tooltipRef.current!);
        tooltip.style("opacity", 0.9);
        tooltip.html(getTooltipContent(d))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        d3.select(tooltipRef.current!).style("opacity", 0);
      });

    // Define simulation tick behavior
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Handle drag events
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Helper function to generate tooltip content
    function getTooltipContent(node: NetworkNode): string {
      if (node.type === 'wallet') {
        return `
          <div class="p-2">
            <div class="font-bold">${node.label}</div>
            ${node.balance !== undefined ? `<div>Balance: ${node.balance.toFixed(4)} SOL</div>` : ''}
            <div class="text-xs text-solana-accent mt-1">Click to view on Solscan</div>
          </div>
        `;
      } else {
        return `<div class="p-2"><div class="font-bold">Transaction</div><div>${node.label}</div></div>`;
      }
    }

    // Cleanup on component unmount
    return () => {
      simulation.stop();
    };
  }, [data, onNodeClick]);

  return (
    <Card className="w-full h-[60vh] md:h-[75vh] relative overflow-hidden glass-panel">
      <svg ref={svgRef} className="w-full h-full bg-transparent"></svg>
      <div 
        ref={tooltipRef}
        className="absolute pointer-events-none bg-black/80 text-white text-sm rounded px-3 py-2 opacity-0 transition-opacity z-50 border border-white/10"
      ></div>
    </Card>
  );
};

export default NetworkGraph;
