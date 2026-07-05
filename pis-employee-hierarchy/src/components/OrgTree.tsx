'use client';
import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import Tree, { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import { OrgTreeProps } from './orgTree.types';
import { toD3Node, buildFlatMap } from './orgTree.utils';
import OrgTreeNode from './OrgTreeNode';

export default function OrgTree({ data, onEdit, onDelete, onAddChild, onDetail }: OrgTreeProps) {
  const treeData = useMemo<RawNodeDatum[]>(() => {
    if (data.length === 0) return [];
    if (data.length === 1) return [toD3Node(data[0])];
    return [{
      name: 'Organization',
      attributes: { description: '', id: '__virtual_root__' },
      children: data.map(toD3Node),
    }];
  }, [data]);

  const flatMap = useMemo(() => buildFlatMap(data), [data]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 400, y: 60 });

  useEffect(() => {
    if (containerRef.current) {
      setTranslate({ x: containerRef.current.offsetWidth / 2, y: 60 });
    }
  }, [data]);

  const renderNode = useCallback(
    (props: CustomNodeElementProps) => (
      <OrgTreeNode
        {...props}
        flatMap={flatMap}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddChild={onAddChild}
        onDetail={onDetail}
      />
    ),
    [flatMap, onEdit, onDelete, onAddChild, onDetail],
  );

  if (treeData.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '600px', background: '#f8fafc', borderRadius: 8, overflow: 'hidden' }}
    >
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        renderCustomNodeElement={renderNode}
        separation={{ siblings: 1.4, nonSiblings: 1.8 }}
        nodeSize={{ x: 310, y: 150 }}
        translate={translate}
        zoom={0.75}
        initialDepth={2}
        enableLegacyTransitions
        transitionDuration={300}
        pathClassFunc={() => 'tree-link'}
      />
      <style>{`
        .tree-link { stroke: #cbd5e1; stroke-width: 1.5px; fill: none; }
      `}</style>
    </div>
  );
}
