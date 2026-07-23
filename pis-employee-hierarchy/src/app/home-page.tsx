"use client";

import HomePageContent from "./home-page-content";
import HomePageModals from "./home-page-modals";
import { useHomePageController } from "./use-home-page-controller";

export default function HomePage() {
  const controller = useHomePageController();

  return (
    <>
      <HomePageContent
        flat={controller.flat}
        tree={controller.tree}
        loading={controller.loading}
        onAddPosition={controller.openCreatePosition}
        onEditPosition={controller.openEditPosition}
        onDeletePosition={controller.handleDeleteRequest}
        onAddChild={controller.openChildPosition}
        onOpenDetail={controller.setDetailTarget}
      />
      <HomePageModals
        flat={controller.flat}
        formOpen={controller.formOpen}
        editTarget={controller.editTarget}
        presetParent={controller.presetParent}
        formPositions={controller.formPositions}
        onClosePositionForm={controller.closePositionForm}
        onSubmitPosition={controller.handleFormSubmit}
        positionFormLoading={controller.loading}
        deleteTarget={controller.deleteTarget}
        onCloseDelete={() => controller.setDeleteTarget(null)}
        onConfirmDelete={controller.handleDelete}
        deleteLoading={controller.deleteLoading}
        detailTarget={controller.detailTarget}
        onCloseDetail={() => controller.setDetailTarget(null)}
        onEditDetail={(position: import("@/types/position").Position) => {
          controller.setDetailTarget(null);
          controller.openEditPosition(position);
        }}
        onAddChildDetail={(position: import("@/types/position").Position) => {
          controller.setDetailTarget(null);
          controller.openChildPosition(position);
        }}
        onDeleteDetail={(position: import("@/types/position").Position) => {
          controller.setDetailTarget(null);
          controller.handleDeleteRequest(position);
        }}
        positionEmployees={controller.positionEmployees}
        onOpenEmployeeForm={controller.openEmployeeForm}
        employeeFormOpen={controller.employeeFormOpen}
        employeeTarget={controller.employeeTarget}
        employeeForm={controller.employeeForm}
        setEmployeeForm={controller.setEmployeeForm}
        onCloseEmployeeForm={() => {
          controller.setEmployeeFormOpen(false);
          controller.setEmployeeTarget(null);
        }}
        onSaveEmployee={controller.saveEmployee}
        employeeSaving={controller.employeeSaving}
        employeeDeleteTarget={controller.employeeDeleteTarget}
        onCloseEmployeeDelete={() => controller.setEmployeeDeleteTarget(null)}
        onConfirmEmployeeDelete={controller.deleteEmployee}
        employeeDeleteLoading={controller.employeeDeleteLoading}
      />
    </>
  );
}
