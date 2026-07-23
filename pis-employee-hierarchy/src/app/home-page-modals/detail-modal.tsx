"use client";

import { Badge, Button, Divider, Modal, Text } from "@mantine/core";
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";

import { Position } from "@/types/position";

interface DetailModalProps {
  detailTarget: Position | null;
  flat: Position[];
  onClose: () => void;
  onEdit: (position: Position) => void;
  onAddChild: (position: Position) => void;
  onDelete: (position: Position) => void;
  onAddEmployee: () => void;
  positionEmployees: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    salary?: string | number | null;
  }>;
}

export default function DetailModal({
  detailTarget,
  flat,
  onClose,
  onEdit,
  onAddChild,
  onDelete,
  onAddEmployee,
  positionEmployees,
}: DetailModalProps) {
  return (
    <Modal
      opened={!!detailTarget}
      onClose={onClose}
      withCloseButton={false}
      fullScreen
      padding={0}
      radius="md"
    >
      {detailTarget && (
        <div className="relative min-h-screen w-full overflow-hidden bg-white">
          <div className="relative mb-10 flex h-20 w-full items-center bg-gradient-to-r from-blue-600 to-blue-500 px-6 pb-10 pt-6">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-blue-200 transition-colors hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-semibold text-white">
                {detailTarget.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight text-white">
                  {detailTarget.name}
                </p>
                <p className="mt-0.5 text-xs text-blue-100">Position Details</p>
              </div>
            </div>
          </div>

          <div className="-mt-5 space-y-3 px-6 pb-28">
            <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Description
                </p>
                <p className="mt-0.5 text-sm text-gray-700">
                  {detailTarget.description || "—"}
                </p>
              </div>
              <Divider />
              <div className="flex gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Direct Reports
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {detailTarget.children?.length ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Reports To
                  </p>
                  <p className="mt-0.5 text-sm text-gray-700">
                    {detailTarget.parentId ? (
                      (flat.find(
                        (position) => position.id === detailTarget.parentId,
                      )?.name ?? "—")
                    ) : (
                      <Badge color="blue" variant="light" size="sm">
                        Root
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Employees
                  </p>
                  <p className="text-sm text-gray-500">
                    People assigned to this position
                  </p>
                </div>
                <Badge color="blue" variant="light">
                  {positionEmployees.length}
                </Badge>
              </div>

              <div>
                <Button
                  variant="light"
                  leftSection={<IconPlus size={14} />}
                  onClick={onAddEmployee}
                >
                  Add Employee
                </Button>
              </div>

              {positionEmployees.length === 0 ? (
                <Text size="sm" c="dimmed">
                  No employees are assigned to this position.
                </Text>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {positionEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex flex-col gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-3 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {employee.email}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {employee.phoneNumber && <p>{employee.phoneNumber}</p>}
                        {employee.salary && <p>Salary: {employee.salary}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 px-6 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-2 sm:grid-cols-3">
              <Button
                variant="light"
                color="blue"
                size="sm"
                onClick={() => onEdit(detailTarget)}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="green"
                size="sm"
                onClick={() => onAddChild(detailTarget)}
              >
                Add Child
              </Button>
              <Button
                variant="light"
                color="red"
                size="sm"
                onClick={() => onDelete(detailTarget)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
