import { RawNodeDatum } from 'react-d3-tree';
import { Position } from '@/types/position';

export function toD3Node(position: Position): RawNodeDatum {
  return {
    name: position.name,
    attributes: { description: position.description || '', id: position.id },
    children: position.children?.map(toD3Node) ?? [],
  };
}

export function buildFlatMap(
  positions: Position[],
  map: Map<string, Position> = new Map(),
): Map<string, Position> {
  for (const p of positions) {
    map.set(p.id, p);
    if (p.children) buildFlatMap(p.children, map);
  }
  return map;
}
