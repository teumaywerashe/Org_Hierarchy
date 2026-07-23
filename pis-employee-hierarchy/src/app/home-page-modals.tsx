"use client";

import { Employee, EmployeePayload } from "@/types/employee";
import { CreatePositionPayload, Position } from "@/types/position";

import DeleteModal from "@/components/DeleteModal";

import DetailModal from "./home-page-modals/detail-modal";
import EmployeeDeleteModal from "./home-page-modals/employee-delete-modal";
import EmployeeModal from "./home-page-modals/employee-modal";
import PositionFormModal from "./home-page-modals/position-form-modal";

interface HomePageModalsProps {
  flat: Position[];
  formOpen: boolean;
  editTarget: Position | null;
  presetParent: Position | null;
  formPositions: Position[];
  onClosePositionForm: () => void;
  onSubmitPosition: (data: CreatePositionPayload) => Promise<void>;
  positionFormLoading: boolean;
  detailTarget: Position | null;
  onCloseDetail: () => void;
  onEditDetail: (position: Position) => void;
  onAddChildDetail: (position: Position) => void;
  onDeleteDetail: (position: Position) => void;
  positionEmployees: Employee[];
  onOpenEmployeeForm: (employee?: Employee) => void;
  employeeFormOpen: boolean;
  employeeTarget: Employee | null;
  employeeForm: EmployeePayload;
  setEmployeeForm: React.Dispatch<React.SetStateAction<EmployeePayload>>;
  onCloseEmployeeForm: () => void;
  onSaveEmployee: () => Promise<void>;
  employeeSaving: boolean;
  employeeDeleteTarget: Employee | null;
  onCloseEmployeeDelete: () => void;
  onConfirmEmployeeDelete: () => Promise<void>;
  employeeDeleteLoading: boolean;
  deleteTarget: Position | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  deleteLoading: boolean;
}

export default function HomePageModals({
  flat,
  formOpen,
  editTarget,
  presetParent,
  formPositions,
  onClosePositionForm,
  onSubmitPosition,
  positionFormLoading,
  detailTarget,
  onCloseDetail,
  onEditDetail,
  onAddChildDetail,
  onDeleteDetail,
  positionEmployees,
  onOpenEmployeeForm,
  employeeFormOpen,
  employeeTarget,
  employeeForm,
  setEmployeeForm,
  onCloseEmployeeForm,
  onSaveEmployee,
  employeeSaving,
  employeeDeleteTarget,
  onCloseEmployeeDelete,
  onConfirmEmployeeDelete,
  employeeDeleteLoading,
  deleteTarget,
  onCloseDelete,
  onConfirmDelete,
  deleteLoading,
}: HomePageModalsProps) {
  return (
    <>
      <PositionFormModal
        opened={formOpen}
        editTarget={editTarget}
        presetParent={presetParent}
        positions={formPositions}
        loading={positionFormLoading}
        onClose={onClosePositionForm}
        onSubmit={onSubmitPosition}
      />

      <DetailModal
        detailTarget={detailTarget}
        flat={flat}
        onClose={onCloseDetail}
        onEdit={onEditDetail}
        onAddChild={onAddChildDetail}
        onDelete={onDeleteDetail}
        onAddEmployee={onOpenEmployeeForm}
        positionEmployees={positionEmployees}
      />

      <EmployeeModal
        opened={employeeFormOpen}
        employeeTarget={employeeTarget}
        employeeForm={employeeForm}
        setEmployeeForm={setEmployeeForm}
        positions={flat}
        onClose={onCloseEmployeeForm}
        onSave={onSaveEmployee}
        saving={employeeSaving}
      />

      <EmployeeDeleteModal
        opened={!!employeeDeleteTarget}
        employee={employeeDeleteTarget}
        loading={employeeDeleteLoading}
        onClose={onCloseEmployeeDelete}
        onConfirm={onConfirmEmployeeDelete}
      />

      <DeleteModal
        position={deleteTarget}
        onConfirm={onConfirmDelete}
        onClose={onCloseDelete}
        loading={deleteLoading}
      />
    </>
  );
}
