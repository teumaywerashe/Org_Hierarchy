"use client";

import { Button, Group, Modal, Text } from "@mantine/core";

import { Employee } from "@/types/employee";

interface EmployeeDeleteModalProps {
  opened: boolean;
  employee: Employee | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function EmployeeDeleteModal({
  opened,
  employee,
  loading,
  onClose,
  onConfirm,
}: EmployeeDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Delete Employee" centered>
      <Text size="sm" c="dimmed">
        {employee
          ? `Delete ${employee.firstName} ${employee.lastName}?`
          : "Delete this employee?"}
      </Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button color="red" loading={loading} onClick={onConfirm}>
          Delete
        </Button>
      </Group>
    </Modal>
  );
}
