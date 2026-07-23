"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";

import { Employee, EmployeePayload } from "@/types/employee";
import { Position } from "@/types/position";

interface EmployeeModalProps {
  opened: boolean;
  employeeTarget: Employee | null;
  employeeForm: EmployeePayload;
  setEmployeeForm: React.Dispatch<React.SetStateAction<EmployeePayload>>;
  positions: Position[];
  onClose: () => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

export default function EmployeeModal({
  opened,
  employeeTarget,
  employeeForm,
  setEmployeeForm,
  positions,
  onClose,
  onSave,
  saving,
}: EmployeeModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={employeeTarget ? "Edit Employee" : "Add Employee"}
      centered
      size="lg"
    >
      <Stack gap="sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput
            label="First Name"
            value={employeeForm.firstName}
            onChange={(event) =>
              setEmployeeForm((current) => ({
                ...current,
                firstName: event?.currentTarget?.value ?? "",
              }))
            }
          />
          <TextInput
            label="Last Name"
            value={employeeForm.lastName}
            onChange={(event) =>
              setEmployeeForm((current) => ({
                ...current,
                lastName: event?.currentTarget?.value ?? "",
              }))
            }
          />
        </div>
        <TextInput
          label="Email"
          value={employeeForm.email}
          onChange={(event) =>
            setEmployeeForm((current) => ({
              ...current,
              email: event?.currentTarget?.value ?? "",
            }))
          }
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <TextInput
            label="Phone Number"
            value={employeeForm.phoneNumber ?? ""}
            onChange={(event) =>
              setEmployeeForm((current) => ({
                ...current,
                phoneNumber: event?.currentTarget?.value ?? "",
              }))
            }
          />
          <TextInput
            label="Hire Date"
            type="date"
            value={employeeForm.hireDate ?? ""}
            onChange={(event) =>
              setEmployeeForm((current) => ({
                ...current,
                hireDate: event?.currentTarget?.value ?? "",
              }))
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <NumberInput
            label="Salary"
            value={employeeForm.salary ?? undefined}
            onChange={(value) =>
              setEmployeeForm((current) => ({
                ...current,
                salary:
                  typeof value === "number"
                    ? value
                    : value === "" || value == null
                      ? null
                      : Number(value),
              }))
            }
            min={0}
            decimalScale={2}
          />
          <Select
            label="Position"
            data={positions.map((position) => ({
              value: position.id,
              label: position.name,
            }))}
            value={employeeForm.positionId}
            onChange={(value) =>
              setEmployeeForm((current) => ({
                ...current,
                positionId: value ?? null,
              }))
            }
            searchable
            allowDeselect={false}
          />
        </div>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={saving} onClick={onSave}>
            {employeeTarget ? "Update Employee" : "Add Employee"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
