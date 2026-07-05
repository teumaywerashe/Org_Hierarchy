'use client';
import { Modal, Text, Button, Group } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Position } from '@/types/position';

interface Props {
  position: Position | null;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function DeleteModal({ position, onConfirm, onClose, loading }: Props) {
  return (
    <Modal
      opened={!!position}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconAlertTriangle size={18} color="orange" />
          <span className="font-semibold">Delete Position</span>
        </Group>
      }
      centered
      size="sm"
    >
      <Text size="sm" className="text-gray-600 mb-4">
        Are you sure you want to delete <strong>{position?.name}</strong>? This action cannot be undone.
        <br />
        <span className="text-orange-500 text-xs mt-1 block">
          Note: Positions with children cannot be deleted.
        </span>
      </Text>
      <Group justify="flex-end" gap="sm">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
