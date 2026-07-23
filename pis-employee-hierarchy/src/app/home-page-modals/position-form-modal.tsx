"use client";

import { Alert, Group, Modal } from "@mantine/core";
import { IconBuilding } from "@tabler/icons-react";

import PositionForm from "@/components/PositionForm";
import { CreatePositionPayload, Position } from "@/types/position";

interface PositionFormModalProps {
  opened: boolean;
  editTarget: Position | null;
  presetParent: Position | null;
  positions: Position[];
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePositionPayload) => Promise<void>;
}

export default function PositionFormModal({
  opened,
  editTarget,
  presetParent,
  positions,
  loading,
  onClose,
  onSubmit,
}: PositionFormModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconBuilding size={18} />
          <span>
            {editTarget
              ? "Edit Position"
              : presetParent
                ? `Add under ${presetParent.name}`
                : "New Position"}
          </span>
        </Group>
      }
      centered
      size="md"
    >
      {presetParent && !editTarget && (
        <Alert color="blue" variant="light" mb="sm" className="text-sm">
          Adding a child position under <strong>{presetParent.name}</strong>
        </Alert>
      )}
      <PositionForm
        positions={positions}
        editTarget={editTarget}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
}
