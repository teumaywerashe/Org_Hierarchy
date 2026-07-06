'use client';
import { useState } from 'react';
import { OrgTreeNodeProps } from './orgTree.types';

export default function OrgTreeNode({
  nodeDatum,
  toggleNode,
  flatMap,
  onEdit,
  onDelete,
  onAddChild,
  onDetail,
}: OrgTreeNodeProps) {
  const [hovered, setHovered] = useState(false);

  const id          = nodeDatum.attributes?.id as string;
  const position    = flatMap.get(id);
  const description = nodeDatum.attributes?.description as string;
  const isCollapsed = (nodeDatum as any).__rd3t?.collapsed;
  const hasChildren = (position?.children?.length ?? 0) > 0;
  const isVirtual   = id === '__virtual_root__';

  // Card dimensions
  const nodeWidth  = 300;
  const nodeHeight = 80;
  const cardLeft   = -nodeWidth / 2;
  const pad        = 10;

  // Flex-like layout: chevron (if any) → avatar → text
  const chevronW  = hasChildren ? 22 : 0;
  const gap       = 40;
  const chevronCx = cardLeft + pad + chevronW/2;
  const avatarCx  = cardLeft + pad + chevronW + (hasChildren ? gap : 0) + 22;
  const textX     = avatarCx + 22 + gap ;

  // Colors
  const cardFill   = isVirtual ? '#1e40af' : hovered ? '#f0f9ff' : '#ffffff';
  const cardStroke = isVirtual ? '#1e3a8a' : hovered ? '#60a5fa' : '#e2e8f0';
  const avatarFill = isVirtual ? '#3b82f6' : '#dbeafe';
  const avatarText = isVirtual ? '#ffffff' : '#1d4ed8';
  const nameFill   = isVirtual ? '#ffffff' : '#0f172a';
  const descFill   = isVirtual ? '#bfdbfe' : '#94a3b8';
  const chevronClr = isVirtual ? '#bfdbfe' : '#60a5fa';

  return (
    <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>

      {/* Card background */}
      <rect
        x={cardLeft} y={-nodeHeight / 2}
        width={nodeWidth} height={nodeHeight}
        rx={10} ry={10}
        fill={cardFill} stroke={cardStroke} strokeWidth={1.5}
        style={{
          filter: hovered
            ? 'drop-shadow(0 4px 14px rgba(59,130,246,0.2))'
            : 'drop-shadow(0 1px 5px rgba(0,0,0,0.09))',
        }}
      />

      {/* Card body hit area — click opens detail */}
      <rect
        x={cardLeft} y={-nodeHeight / 2}
        width={nodeWidth} height={nodeHeight}
        rx={10} ry={10} fill="transparent"
        style={{ cursor: 'pointer' }}
        onClick={(e) => { e.stopPropagation(); if (position) onDetail(position); }}
      />

      {/* Chevron — only rendered when node has children */}
      {hasChildren && (
        <g
          transform={`translate(${chevronCx}, 0)`}
          style={{ cursor: 'pointer',width:"100px" }}
          onClick={(e) => { e.stopPropagation(); toggleNode(); }}
        >
          <rect x={-22} y={-40} color='red' fill="white" radius={20} width={42} height={80}  />
          {isCollapsed ? (
            <path d="M-7,-11 L10,0 L-7,11"
              fill="none" stroke={chevronClr} strokeWidth={5}
              strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M-11,-5 L0,10 L11,-5"
              fill="none" stroke={chevronClr} strokeWidth={5}
              strokeLinecap="round" strokeLinejoin="round" />
          )}
        </g>
      )}

      {/* Avatar */}
      <circle cx={avatarCx} cy={0} r={22} fill={avatarFill} style={{ pointerEvents: 'none' }} />
      <text
        x={avatarCx} y={6}
        textAnchor="middle" fontSize={14} fontWeight="600" fill={avatarText}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {nodeDatum.name.slice(0, 2).toUpperCase()}
      </text>

      {/* Name */}
      <text
        x={textX} y={-9}
        fontSize={16} fontWeight="500" fill={nameFill}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {nodeDatum.name.length > 13 ? nodeDatum.name.slice(0, 13) + '… ' : nodeDatum.name}
      </text>

      {/* Description */}
      <text
        x={textX} y={20}
        fontSize={12} fontWeight="300" fill={descFill}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {description
          ? description.length > 17 ? description.slice(0, 17) + '…' : description
          : 'No description'}
      </text>

      {/* Hover action buttons */}
      {hovered && position && (
        <>
          <g transform={`translate(${nodeWidth / 2 + 16}, -24)`} style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onAddChild(position); }}>
            <circle r={12} fill="#22c55e" />
            <text textAnchor="middle" y={5} fontSize={15} fill="white" style={{ userSelect: 'none' }}>+</text>
          </g>
          <g transform={`translate(${nodeWidth / 2 + 16}, 0)`} style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onEdit(position); }}>
            <circle r={12} fill="#3b82f6" />
            <text textAnchor="middle" y={4} fontSize={12} fill="white" style={{ userSelect: 'none' }}>✎</text>
          </g>
          <g transform={`translate(${nodeWidth / 2 + 16}, 24)`} style={{ cursor: 'pointer' }}
            onClick={(e) => { e.stopPropagation(); onDelete(position); }}>
            <circle r={12} fill="#ef4444" />
            <text textAnchor="middle" y={5} fontSize={14} fill="white" style={{ userSelect: 'none' }}>✕</text>
          </g>
        </>
      )}
    </g>
  );
}
