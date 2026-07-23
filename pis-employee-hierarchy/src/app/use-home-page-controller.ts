"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";

import { employeeService } from "@/services/employeeService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearError,
  createPosition,
  deletePosition,
  fetchFlat,
  fetchTree,
  updatePosition,
} from "@/store/positionSlice";
import { Employee, EmployeePayload } from "@/types/employee";
import { CreatePositionPayload, Position } from "@/types/position";

export function useHomePageController() {
  const dispatch = useAppDispatch();
  const { tree, flat, loading, error } = useAppSelector(
    (state) => state.positions,
  );

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
  }, [dispatch, error]);

  const closePositionForm = useCallback(() => {
    setFormOpen(false);
    setEditTarget(null);
    setPresetParent(null);
  }, []);

  const openCreatePosition = useCallback(() => {
    setEditTarget(null);
    setPresetParent(null);
    setFormOpen(true);
  }, []);

  const openChildPosition = useCallback((parent: Position) => {
    setEditTarget(null);
    setPresetParent(parent);
    setFormOpen(true);
  }, []);

  const openEditPosition = useCallback((position: Position) => {
    setEditTarget(position);
    setPresetParent(null);
    setFormOpen(true);
  }, []);

  const openEmployeeForm = useCallback(
    (employee?: Employee) => {
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
    },
    [detailTarget?.id],
  );

  const saveEmployee = useCallback(async () => {
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
  }, [employeeForm, employeeTarget]);

  const deleteEmployee = useCallback(async () => {
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
  }, [employeeDeleteTarget]);

  const handleFormSubmit = useCallback(
    async (data: CreatePositionPayload) => {
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

      closePositionForm();
      loadData();
    },
    [closePositionForm, dispatch, editTarget, loadData, presetParent],
  );

  const handleDelete = useCallback(async () => {
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
      notifications.show({
        title: "Delete Failed",
        message: err?.message || "Cannot delete position with children.",
        color: "red",
      });
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, dispatch, loadData]);

  const handleDeleteRequest = useCallback((position: Position) => {
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
  }, []);

  const formPositions = useMemo(
    () =>
      editTarget
        ? flat.filter((position) => position.id !== editTarget.id)
        : flat,
    [editTarget, flat],
  );

  const positionEmployees = useMemo(
    () =>
      detailTarget
        ? employees.filter(
            (employee) => employee.positionId === detailTarget.id,
          )
        : [],
    [detailTarget, employees],
  );

  return {
    tree,
    flat,
    loading,
    formOpen,
    editTarget,
    deleteTarget,
    presetParent,
    deleteLoading,
    detailTarget,
    employees,
    employeeFormOpen,
    employeeTarget,
    employeeSaving,
    employeeDeleteTarget,
    employeeDeleteLoading,
    employeeForm,
    setEmployeeForm,
    loadData,
    closePositionForm,
    openCreatePosition,
    openChildPosition,
    openEditPosition,
    openEmployeeForm,
    saveEmployee,
    deleteEmployee,
    handleFormSubmit,
    handleDelete,
    handleDeleteRequest,
    formPositions,
    positionEmployees,
    setDetailTarget,
    setDeleteTarget,
    setEmployeeFormOpen,
    setEmployeeTarget,
    setEmployeeDeleteTarget,
  };
}
