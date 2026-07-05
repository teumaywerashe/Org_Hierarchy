import { CustomNodeElementProps } from 'react-d3-tree';
import { Position } from '@/types/position';

export interface OrgTreeProps {
  data: Position[];
  onEdit: (position: Position) => void;
  onDelete: (position: Position) => void;
  onAddChild: (parent: Position) => void;
  onDetail: (position: Position) => void;
}

export interface OrgTreeNodeProps extends CustomNodeElementProps {
  flatMap: Map<string, Position>;
  onEdit: (position: Position) => void;
  onDelete: (position: Position) => void;
  onAddChild: (parent: Position) => void;
  onDetail: (position: Position) => void;
}
