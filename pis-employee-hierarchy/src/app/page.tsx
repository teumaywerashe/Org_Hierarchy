"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Modal,
  Paper,
  Title,
  Text,
  Button,
  Group,
  Alert,
  Loader,
  Center,
  Badge,
  Divider,
  TextInput,
  Select,
  NumberInput,
  Stack,
} from "@mantine/core";
import {
  IconPlus,
  IconBuilding,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { employeeService } from "@/services/employeeService";
import {
  fetchTree,
  fetchFlat,
  createPosition,
  updatePosition,
  deletePosition,
  clearError,
} from "@/store/positionSlice";
import { Position, CreatePositionPayload } from "@/types/position";
import { Employee, EmployeePayload } from "@/types/employee";
import OrgTree from "@/components/OrgTree";
import PositionForm from "@/components/PositionForm";
import DeleteModal from "@/components/DeleteModal";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const { tree, flat, loading, error } = useAppSelector((s) => s.positions);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);
  const [presetParent, setPresetParent] = useState<Position | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Position | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [employeeTarget, setEmployeeTarget] = useState<Employee | null>(null);
  const [employeeSaving, setEmployeeSaving] = useState(false);
  const [employeeDeleteTarget, setEmployeeDeleteTarget] =
    useState<Employee | null>(null);
  const [employeeDeleteLoading, setEmployeeDeleteLoading] = useState(false);
  const [employeeForm, setEmployeeForm] = useState<EmployeePayload>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    salary: null,
    positionId: null,
  });

  const loadData = useCallback(() => {
    dispatch(fetchTree());
    dispatch(fetchFlat());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    employeeService
      .getAll()
      .then(setEmployees)
      .catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    if (error) {
      notifications.show({ title: "Error", message: error, color: "red" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleOpenCreate = () => {
    setEditTarget(null);
    setPresetParent(null);
    setFormOpen(true);
  };

  const handleAddChild = (parent: Position) => {
    setEditTarget(null);
    setPresetParent(parent);
    setFormOpen(true);
  };

  const handleEdit = (position: Position) => {
    setEditTarget(position);
    setPresetParent(null);
    setFormOpen(true);
  };

  const openEmployeeForm = (employee?: Employee) => {
    const basePositionId = detailTarget?.id ?? null;
    if (employee) {
      setEmployeeTarget(employee);
      setEmployeeForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phoneNumber: employee.phoneNumber ?? "",
        hireDate: employee.hireDate ?? "",
        salary:
          employee.salary === null || employee.salary === ""
            ? null
            : Number(employee.salary),
        positionId: employee.positionId ?? basePositionId,
      });
    } else {
      setEmployeeTarget(null);
      setEmployeeForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        hireDate: "",
        salary: null,
        positionId: basePositionId,
      });
    }
    setEmployeeFormOpen(true);
  };

  const saveEmployee = async () => {
    if (!employeeForm.positionId) {
      notifications.show({
        title: "Missing position",
        message: "Please select a position for this employee.",
        color: "red",
      });
      return;
    }

    setEmployeeSaving(true);
    try {
      if (employeeTarget) {
        await employeeService.update(employeeTarget.id, employeeForm);
        notifications.show({
          title: "Employee updated",
          message: `${employeeForm.firstName} ${employeeForm.lastName} updated.`,
          color: "teal",
        });
      } else {
        await employeeService.create(employeeForm);
        notifications.show({
          title: "Employee created",
          message: `${employeeForm.firstName} ${employeeForm.lastName} added.`,
          color: "teal",
        });
      }
      setEmployeeFormOpen(false);
      setEmployeeTarget(null);
      const refreshedEmployees = await employeeService.getAll();
      setEmployees(refreshedEmployees);
    } catch (err: any) {
      notifications.show({
        title: "Employee save failed",
        message: err?.message || "Unable to save employee.",
        color: "red",
      });
    } finally {
      setEmployeeSaving(false);
    }
  };

  const deleteEmployee = async () => {
    if (!employeeDeleteTarget) return;
    setEmployeeDeleteLoading(true);
    try {
      await employeeService.remove(employeeDeleteTarget.id);
      notifications.show({
        title: "Employee deleted",
        message: `${employeeDeleteTarget.firstName} ${employeeDeleteTarget.lastName} removed.`,
        color: "orange",
      });
      setEmployeeDeleteTarget(null);
      const refreshedEmployees = await employeeService.getAll();
      setEmployees(refreshedEmployees);
    } catch (err: any) {
      notifications.show({
        title: "Delete failed",
        message: err?.message || "Unable to delete employee.",
        color: "red",
      });
    } finally {
      setEmployeeDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (data: CreatePositionPayload) => {
    // Inject preset parent if adding child
    const payload = presetParent
      ? { ...data, parentId: presetParent.id }
      : data;

    if (editTarget) {
      await dispatch(
        updatePosition({ id: editTarget.id, data: payload }),
      ).unwrap();
      notifications.show({
        title: "Updated",
        message: `${data.name} updated.`,
        color: "teal",
      });
    } else {
      await dispatch(createPosition(payload)).unwrap();
      notifications.show({
        title: "Created",
        message: `${data.name} created.`,
        color: "teal",
      });
    }
    setFormOpen(false);
    setEditTarget(null);
    setPresetParent(null);
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await dispatch(deletePosition(deleteTarget.id)).unwrap();
      notifications.show({
        title: "Deleted",
        message: `${deleteTarget.name} deleted.`,
        color: "orange",
      });
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      const msg = err?.message || "Cannot delete position with children.";
      notifications.show({
        title: "Delete Failed",
        message: msg,
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  // TODO : TO BE IMPLIMENTED LATTER
  const handleDeleteRequest = (position: Position) => {
    if ((position.children?.length ?? 0) > 0) {
      notifications.show({
        title: "Cannot Delete",
        message: `"${position.name}" has child positions. Remove all children before deleting.`,
        color: "red",
        autoClose: 4000,
      });
      return;
    }
    setDeleteTarget(position);
  };

  const formPositions = editTarget
    ? flat.filter((p) => p.id !== editTarget.id)
    : flat;
  const positionEmployees = detailTarget
    ? employees.filter((employee) => employee.positionId === detailTarget.id)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="mx-auto  px-4 py-6 max-w-7xl">
        <div className="flex bg-white  max-w-7xl border-b  border-gray-200 mx-auto border-r-amber-400 px-4 py-6 shadow-sm rounded-md items-center justify-between">
          <Group gap="sm">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <IconBuilding size={20} color="white" />
            </div>
            <div>
              <Title order={3} className="text-gray-900 leading-tight">
                Org Hierarchy
              </Title>
              <Text size="xs" c="dimmed">
                Perago Information Systems
              </Text>
            </div>
          </Group>
          <Group gap="sm">
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={handleOpenCreate}
            >
              Add Position
            </Button>
          </Group>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
          <Paper p="md" radius="md" withBorder className="bg-white">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Total Positions
            </Text>
            <Text size="xl" fw={700} className="text-blue-600">
              {flat.length}
            </Text>
          </Paper>
          <Paper p="md" radius="md" withBorder className="bg-white">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Root Positions
            </Text>
            <Text size="xl" fw={700} className="text-blue-600">
              {tree.length}
            </Text>
          </Paper>
          <Paper
            p="md"
            radius="md"
            withBorder
            className="bg-white hidden sm:block"
          >
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Status
            </Text>
            <Badge color="green" size="lg" variant="light">
              Active
            </Badge>
          </Paper>
        </div>

        {/* Tree Panel */}
        <Paper p="lg" radius="md" withBorder className="bg-white">
          <Group justify="space-between" mb="md">
            <Title order={5} className="text-gray-700">
              Position Hierarchy
            </Title>
          </Group>
          <Divider mb="md" />

          {loading && tree.length === 0 ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : tree.length === 0 ? (
            <Center py="xl" className="flex-col gap-3">
              <IconBuilding size={48} color="gray" opacity={0.3} />
              <Text c="dimmed">
                No positions yet. Add your first position to get started.
              </Text>
              <Button
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={handleOpenCreate}
              >
                Add First Position
              </Button>
            </Center>
          ) : (
            <OrgTree
              data={tree}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onAddChild={handleAddChild}
              onDetail={setDetailTarget}
            />
          )}
        </Paper>
      </main>

      {/* Create / Edit Modal */}
      <Modal
        opened={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
          setPresetParent(null);
        }}
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
          positions={formPositions}
          editTarget={editTarget}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditTarget(null);
            setPresetParent(null);
          }}
          loading={loading}
        />
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        position={deleteTarget}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />

      {/* Detail Modal */}
      <Modal
        opened={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        withCloseButton={false}
        fullScreen
        padding={0}
        radius="md"
      >
        {detailTarget && (
          <div className="relative bg-white w-full min-h-screen overflow-hidden">
            {/* Banner header */}
            <div className="bg-gradient-to-r w-full h-20 flex items-center mb-10 from-blue-600 to-blue-500 px-6 pt-6 pb-10 relative">
              <button
                onClick={() => setDetailTarget(null)}
                className="absolute top-3 right-3 text-blue-200 hover:text-white transition-colors"
              >
                ✕
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-semibold">
                  {detailTarget.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-lg font-semibold leading-tight">
                    {detailTarget.name}
                  </p>
                  <p className="text-blue-100 text-xs mt-0.5">
                    Position Details
                  </p>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="px-6 -mt-5 space-y-3 pb-28">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {detailTarget.description || "—"}
                  </p>
                </div>
                <Divider />
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                      Direct Reports
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5 font-semibold">
                      {detailTarget.children?.length ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                      Reports To
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {detailTarget.parentId ? (
                        (flat.find((p) => p.id === detailTarget.parentId)
                          ?.name ?? "—")
                      ) : (
                        <Badge color="blue" variant="light" size="sm">
                          Root
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">
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
                    onClick={() => openEmployeeForm()}
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
                          {employee.phoneNumber && (
                            <p>{employee.phoneNumber}</p>
                          )}
                          {employee.salary && <p>Salary: {employee.salary}</p>}
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                          <Button
                            size="xs"
                            variant="light"
                            leftSection={<IconPencil size={12} />}
                            onClick={() => openEmployeeForm(employee)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            color="red"
                            leftSection={<IconTrash size={12} />}
                            onClick={() => setEmployeeDeleteTarget(employee)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
              <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-2 sm:grid-cols-3">
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={() => {
                    setDetailTarget(null);
                    handleEdit(detailTarget);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  color="green"
                  size="sm"
                  onClick={() => {
                    setDetailTarget(null);
                    handleAddChild(detailTarget);
                  }}
                >
                  Add Child
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => {
                    setDetailTarget(null);
                    handleDeleteRequest(detailTarget);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        opened={employeeFormOpen}
        onClose={() => {
          setEmployeeFormOpen(false);
          setEmployeeTarget(null);
        }}
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
                  firstName: event.currentTarget.value,
                }))
              }
            />
            <TextInput
              label="Last Name"
              value={employeeForm.lastName}
              onChange={(event) =>
                setEmployeeForm((current) => ({
                  ...current,
                  lastName: event.currentTarget.value,
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
                email: event.currentTarget.value,
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
                  phoneNumber: event.currentTarget.value,
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
                  hireDate: event.currentTarget.value,
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
                  salary: typeof value === "number" ? value : null,
                }))
              }
              min={0}
              decimalScale={2}
            />
            <Select
              label="Position"
              data={flat.map((position) => ({
                value: position.id,
                label: position.name,
              }))}
              value={employeeForm.positionId}
              onChange={(value) =>
                setEmployeeForm((current) => ({
                  ...current,
                  positionId: value,
                }))
              }
              searchable
              allowDeselect={false}
            />
          </div>
          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => {
                setEmployeeFormOpen(false);
                setEmployeeTarget(null);
              }}
            >
              Cancel
            </Button>
            <Button loading={employeeSaving} onClick={saveEmployee}>
              {employeeTarget ? "Update Employee" : "Add Employee"}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={!!employeeDeleteTarget}
        onClose={() => setEmployeeDeleteTarget(null)}
        title="Delete Employee"
        centered
      >
        <Text size="sm" c="dimmed">
          {employeeDeleteTarget
            ? `Delete ${employeeDeleteTarget.firstName} ${employeeDeleteTarget.lastName}?`
            : "Delete this employee?"}
        </Text>
        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => setEmployeeDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            loading={employeeDeleteLoading}
            onClick={deleteEmployee}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
