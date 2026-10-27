/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { User, Friendship } from '../types/network';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Info, Sparkles, Filter } from 'lucide-react';

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  user: User;
  degree: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  id: string;
  source: string | SimulationNode;
  target: string | SimulationNode;
}

export type GraphViewMode = 'default' | 'bfs' | 'dfs' | 'centrality' | 'components';

interface NetworkGraphProps {
  nodes: User[];
  edges: Friendship[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
  viewMode?: GraphViewMode;
  bfsLevels?: { level: number; nodeIds: string[] }[];
  activeStepNodeId?: string;
  activeStepEdge?: { source: string; target: string };
  centralityRanks?: Map<string, { rank: number; normalized: number; rawDegree: number }>;
  componentGroups?: Map<string, { componentId: number; color: string; name: string }>;
  highlightedRecommendationIds?: string[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  edges,
  selectedUserId,
  onSelectUser,
  viewMode = 'default',
  bfsLevels = [],
  activeStepNodeId,
  activeStepEdge,
  centralityRanks,
  componentGroups,
  highlightedRecommendationIds = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  // Compute degrees for each user
  const degreeMap = useMemo(() => {
    const map = new Map<string, number>();
    nodes.forEach(n => map.set(n.id, 0));
    edges.forEach(e => {
      map.set(e.source, (map.get(e.source) || 0) + 1);
      map.set(e.target, (map.get(e.target) || 0) + 1);
    });
    return map;
  }, [nodes, edges]);

  // Compute direct neighbors of selected user
  const directFriends = useMemo(() => {
    if (!selectedUserId) return new Set<string>();
    const set = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedUserId) set.add(e.target);
      if (e.target === selectedUserId) set.add(e.source);
    });
    return set;
  }, [selectedUserId, edges]);

  // Map node to BFS level if in BFS mode
  const nodeBfsLevelMap = useMemo(() => {
    const map = new Map<string, number>();
    bfsLevels.forEach(lvl => {
      lvl.nodeIds.forEach(id => map.set(id, lvl.level));
    });
    return map;
  }, [bfsLevels]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    nodes.forEach(n => set.add(n.department));
    return ['ALL', ...Array.from(set).sort()];
  }, [nodes]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.max(540, containerRef.current.clientHeight || 540);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    // Defs for gradients, glow filters, arrow markers
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Soft drop shadow
    const shadowFilter = defs.append('filter')
      .attr('id', 'node-shadow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    shadowFilter.append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '3')
      .attr('stdDeviation', '3')
      .attr('flood-opacity', '0.15');

    // Root container for zoom/pan
    const g = svg.append('g').attr('class', 'main-graph-group');
    gRef.current = g.node();

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Build data objects for D3 simulation
    const simNodes: SimulationNode[] = nodes.map(u => ({
      id: u.id,
      user: u,
      degree: degreeMap.get(u.id) || 0
    }));

    const simLinks: SimulationLink[] = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target
    }));

    // Force simulation setup
    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(simLinks)
        .id(d => d.id)
        .distance(75)
        .strength(0.35)
      )
      .force('charge', d3.forceManyBody().strength(-240))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimulationNode>().radius(d => {
        if (viewMode === 'centrality' && centralityRanks) {
          const rankInfo = centralityRanks.get(d.id);
          return (rankInfo ? 18 + rankInfo.normalized * 26 : 22) + 12;
        }
        return 32;
      }).iterations(2));

    // Links layer
    const linkGroup = g.append('g').attr('class', 'links');
    const links = linkGroup.selectAll<SVGLineElement, SimulationLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke', d => {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as SimulationNode).id;
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimulationNode).id;

        // Check if active step edge
        if (activeStepEdge) {
          if (
            (activeStepEdge.source === srcId && activeStepEdge.target === tgtId) ||
            (activeStepEdge.source === tgtId && activeStepEdge.target === srcId)
          ) {
            return '#8B5CF6'; // Vibrant active violet
          }
        }

        // Selected user incident edges
        if (selectedUserId && (srcId === selectedUserId || tgtId === selectedUserId)) {
          return '#6366F1'; // Indigo
        }

        return '#CBD5E1'; // Slate-300
      })
      .attr('stroke-width', d => {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as SimulationNode).id;
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimulationNode).id;

        if (activeStepEdge) {
          if (
            (activeStepEdge.source === srcId && activeStepEdge.target === tgtId) ||
            (activeStepEdge.source === tgtId && activeStepEdge.target === srcId)
          ) {
            return 3.5;
          }
        }

        if (selectedUserId && (srcId === selectedUserId || tgtId === selectedUserId)) {
          return 2.5;
        }

        return 1.4;
      })
      .attr('stroke-opacity', d => {
        const srcId = typeof d.source === 'string' ? d.source : (d.source as SimulationNode).id;
        const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimulationNode).id;

        if (selectedUserId) {
          if (srcId === selectedUserId || tgtId === selectedUserId) return 0.95;
          return 0.15;
        }
        return 0.7;
      });

    // Nodes layer
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Drag behavior
    const drag = d3.drag<SVGGElement, SimulationNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeG = nodeGroup.selectAll<SVGGElement, SimulationNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(drag);

    // Node Radius function based on mode
    const getNodeRadius = (d: SimulationNode): number => {
      if (viewMode === 'centrality' && centralityRanks) {
        const rankInfo = centralityRanks.get(d.id);
        const norm = rankInfo?.normalized || 0;
        return 16 + norm * 20; // 16px to 36px
      }
      return 20;
    };

    // Node outer selection glow ring
    nodeG.append('circle')
      .attr('class', 'glow-ring')
      .attr('r', d => getNodeRadius(d) + 5)
      .attr('fill', 'none')
      .attr('stroke', d => {
        if (d.id === activeStepNodeId) return '#F59E0B'; // Amber
        if (d.id === selectedUserId) return '#4F46E5'; // Indigo
        if (highlightedRecommendationIds.includes(d.id)) return '#10B981'; // Green recommendation
        return 'transparent';
      })
      .attr('stroke-width', d => (d.id === selectedUserId || d.id === activeStepNodeId ? 3.5 : 2))
      .attr('stroke-dasharray', d => (d.id === activeStepNodeId ? '4 2' : 'none'))
      .attr('opacity', d => (d.id === selectedUserId || d.id === activeStepNodeId || highlightedRecommendationIds.includes(d.id) ? 1 : 0));

    // Base circle
    nodeG.append('circle')
      .attr('class', 'base-node-circle')
      .attr('r', d => getNodeRadius(d))
      .attr('filter', 'url(#node-shadow)')
      .attr('fill', d => {
        // Component mode coloring
        if (viewMode === 'components' && componentGroups) {
          const comp = componentGroups.get(d.id);
          return comp ? comp.color : d.user.color;
        }

        // BFS Mode coloring by level
        if (viewMode === 'bfs' && nodeBfsLevelMap.has(d.id)) {
          const lvl = nodeBfsLevelMap.get(d.id)!;
          if (lvl === 0) return '#4F46E5'; // Root (Deep Indigo)
          if (lvl === 1) return '#0284C7'; // Level 1 (Sky Blue)
          if (lvl === 2) return '#8B5CF6'; // Level 2 (Violet)
          if (lvl === 3) return '#D946EF'; // Level 3 (Fuchsia)
          return '#64748B';
        }

        // Default or Centrality mode
        if (d.id === selectedUserId) return '#4338CA';
        if (directFriends.has(d.id)) return '#38BDF8'; // Direct connection
        if (highlightedRecommendationIds.includes(d.id)) return '#10B981';

        return d.user.color || '#6366F1';
      })
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.5)
      .attr('opacity', d => {
        if (departmentFilter !== 'ALL' && d.user.department !== departmentFilter) {
          return 0.2;
        }
        if (selectedUserId) {
          if (
            d.id === selectedUserId ||
            directFriends.has(d.id) ||
            highlightedRecommendationIds.includes(d.id) ||
            d.id === activeStepNodeId
          ) {
            return 1;
          }
          return 0.3;
        }
        return 1;
      });

    // Inner Initials or Degree text
    nodeG.append('text')
      .text(d => {
        if (viewMode === 'centrality') {
          return `${d.degree}`;
        }
        // First letters of name
        const parts = d.user.name.split(' ');
        return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2);
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', '#FFFFFF')
      .attr('font-size', d => (viewMode === 'centrality' ? 12 : 11))
      .attr('font-weight', '700')
      .attr('pointer-events', 'none');

    // Label under the node
    nodeG.append('text')
      .text(d => d.user.name.split(' ')[0])
      .attr('y', d => getNodeRadius(d) + 13)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1E293B')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .style('paint-order', 'stroke')
      .style('stroke', '#FFFFFF')
      .style('stroke-width', '3px')
      .style('stroke-linejoin', 'round');

    // Hover & Click listeners
    nodeG
      .on('mouseenter', (event, d) => {
        setHoveredUser(d.user);
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx + 12, y: my - 12 });
      })
      .on('mousemove', (event) => {
        const [mx, my] = d3.pointer(event, containerRef.current);
        setTooltipPos({ x: mx + 12, y: my - 12 });
      })
      .on('mouseleave', () => {
        setHoveredUser(null);
        setTooltipPos(null);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectUser(d.user);
      });

    // Tick update
    simulation.on('tick', () => {
      links
        .attr('x1', d => (d.source as SimulationNode).x || 0)
        .attr('y1', d => (d.source as SimulationNode).y || 0)
        .attr('x2', d => (d.target as SimulationNode).x || 0)
        .attr('y2', d => (d.target as SimulationNode).y || 0);

      nodeG.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [
    nodes,
    edges,
    selectedUserId,
    viewMode,
    bfsLevels,
    activeStepNodeId,
    activeStepEdge,
    centralityRanks,
    componentGroups,
    highlightedRecommendationIds,
    departmentFilter,
    degreeMap,
    directFriends,
    nodeBfsLevelMap,
    onSelectUser
  ]);

  // Zoom controls
  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(280)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current || !containerRef.current) return;
    const width = containerRef.current.clientWidth || 800;
    const height = Math.max(540, containerRef.current.clientHeight || 540);
    d3.select(svgRef.current)
      .transition()
      .duration(350)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity.translate(0, 0).scale(1));
  };

  return (
    <div className="relative w-full h-[580px] bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col" ref={containerRef}>
      {/* Top Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Department Filter & Status */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">Filter Dept:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs font-medium rounded-md px-2 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Legend Indicator */}
        <div className="flex items-center gap-2 pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-medium text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {viewMode === 'default' && 'Interactive Network View'}
            {viewMode === 'bfs' && 'BFS Traversal Level Decomposition'}
            {viewMode === 'dfs' && 'DFS Recursive Path View'}
            {viewMode === 'centrality' && 'Degree Centrality Bubble Sizing'}
            {viewMode === 'components' && 'Connected Component Clustering'}
          </span>
        </div>

        {/* Zoom & Canvas Action Buttons */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-sm pointer-events-auto">
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset View"
            aria-label="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive Tooltip */}
      {hoveredUser && tooltipPos && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs w-60 transform transition-transform"
          style={{
            left: `${Math.min(tooltipPos.x, (containerRef.current?.clientWidth || 800) - 260)}px`,
            top: `${Math.min(tooltipPos.y, 420)}px`
          }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: hoveredUser.color }}
            />
            <div className="font-bold text-white text-sm truncate">{hoveredUser.name}</div>
          </div>
          <div className="text-slate-300 text-[11px] mb-1 font-mono">{hoveredUser.handle}</div>
          <div className="text-indigo-300 font-medium text-[11px] mb-2">{hoveredUser.department} • {hoveredUser.role}</div>
          
          <div className="flex items-center justify-between border-t border-slate-700/80 pt-1.5 text-slate-300 text-[11px]">
            <span>Connections:</span>
            <span className="font-semibold text-white">{degreeMap.get(hoveredUser.id) || 0} friends</span>
          </div>

          <div className="mt-1 flex flex-wrap gap-1">
            {hoveredUser.interests.slice(0, 3).map((item, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs flex flex-wrap items-center gap-3 text-slate-600">
        <span className="font-semibold text-slate-800 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          Legend:
        </span>
        {viewMode === 'default' && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-700 border border-white" />
              Selected Node
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 border border-white" />
              1st Degree (Direct Friend)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
              Recommended Friend
            </span>
          </>
        )}
        {viewMode === 'bfs' && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600" /> Root (Level 0)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500" /> Level 1
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-violet-500" /> Level 2
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-fuchsia-500" /> Level 3
            </span>
          </>
        )}
        {viewMode === 'centrality' && (
          <span className="text-slate-600">
            Node radius directly proportional to Degree Centrality C_D(v)
          </span>
        )}
        {viewMode === 'components' && (
          <span className="text-slate-600">
            Node colors identify distinct connected components
          </span>
        )}
      </div>
    </div>
  );
};
