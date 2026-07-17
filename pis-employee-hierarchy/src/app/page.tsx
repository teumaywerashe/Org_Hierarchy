'use client';
import { useEffect, useState, useCallback } from 'react';
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
  
} from '@mantine/core';
import {
  IconPlus,
  
  IconBuilding,
 
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchTree,
  fetchFlat,
  createPosition,
  updatePosition,
  deletePosition,
  clearError,
} from '@/store/positionSlice';
import { Position, CreatePositionPayload } from '@/types/position';
import OrgTree from '@/components/OrgTree';
import PositionForm from '@/components/PositionForm';
import DeleteModal from '@/components/DeleteModal';

export default function HomePage() {
  const dispatch = useAppDispatch();


  
  const { tree, flat, loading, error } = useAppSelector((s) => s.positions);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Position | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);
  const [presetParent, setPresetParent] = useState<Position | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Position | null>(null);

  const loadData = useCallback(() => {
    dispatch(fetchTree());
    dispatch(fetchFlat());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (error) {
      notifications.show({ title: 'Error', message: error, color: 'red' });
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

  const handleFormSubmit = async (data: CreatePositionPayload) => {
    // Inject preset parent if adding child
    const payload = presetParent ? { ...data, parentId: presetParent.id } : data;

    if (editTarget) {
      await dispatch(updatePosition({ id: editTarget.id, data: payload })).unwrap();
      notifications.show({ title: 'Updated', message: `${data.name} updated.`, color: 'teal' });
    } else {
      await dispatch(createPosition(payload)).unwrap();
      notifications.show({ title: 'Created', message: `${data.name} created.`, color: 'teal' });
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
      notifications.show({ title: 'Deleted', message: `${deleteTarget.name} deleted.`, color: 'orange' });
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      const msg = err?.message || 'Cannot delete position with children.';
      notifications.show({ title: 'Delete Failed', message: msg, color: 'red' });
    } finally {
      setDeleteLoading(false);
    }
  };
// TODO : TO BE IMPLIMENTED LATTER
  const handleDeleteRequest = (position: Position) => {
    if ((position.children?.length ?? 0) > 0) {
      notifications.show({
        title: 'Cannot Delete',
        message: `"${position.name}" has child positions. Remove all children before deleting.`,
        color: 'red',
        autoClose: 4000,
      });
      return;
    }
    setDeleteTarget(position);
  };

  const formPositions = editTarget
    ? flat.filter((p) => p.id !== editTarget.id)
    : flat;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header  className="mx-auto  px-4 py-6 max-w-7xl">
        <div className="flex bg-white  max-w-7xl border-b  border-gray-200 mx-auto border-r-amber-400 px-4 py-6 shadow-sm rounded-md items-center justify-between">
          <Group  gap="sm">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <IconBuilding size={20} color="white" />
            </div>
            <div>
              <Title order={3} className="text-gray-900 leading-tight">
                Org Hierarchy
              </Title>
              <Text size="xs" c="dimmed">Perago Information Systems</Text>
            </div>
          </Group>
          <Group gap="sm">
           
            <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
              Add Position
            </Button>
          </Group>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3">
          <Paper p="md" radius="md" withBorder className="bg-white">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Total Positions</Text>
            <Text size="xl" fw={700} className="text-blue-600">{flat.length}</Text>
          </Paper>
          <Paper p="md" radius="md" withBorder className="bg-white">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Root Positions</Text>
            <Text size="xl" fw={700} className="text-blue-600">{tree.length}</Text>
          </Paper>
          <Paper p="md" radius="md" withBorder className="bg-white hidden sm:block">
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Status</Text>
            <Badge color="green" size="lg" variant="light">Active</Badge>
          </Paper>
        </div>

        {/* Tree Panel */}
        <Paper p="lg" radius="md" withBorder className="bg-white">
          <Group justify="space-between" mb="md">
            <Title order={5} className="text-gray-700">Position Hierarchy</Title>
           
          </Group>
          <Divider mb="md" />

          {loading && tree.length === 0 ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : tree.length === 0 ? (
            <Center py="xl" className="flex-col gap-3">
              <IconBuilding size={48} color="gray" opacity={0.3} />
              <Text c="dimmed">No positions yet. Add your first position to get started.</Text>
              <Button variant="light" leftSection={<IconPlus size={14} />} onClick={handleOpenCreate}>
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
        onClose={() => { setFormOpen(false); setEditTarget(null); setPresetParent(null); }}
        title={
          <Group gap="xs">
            <IconBuilding size={18} />
            <span>{editTarget ? 'Edit Position' : presetParent ? `Add under ${presetParent.name}` : 'New Position'}</span>
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
          onCancel={() => { setFormOpen(false); setEditTarget(null); setPresetParent(null); }}
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
        centered
        size="sm"
        padding={0}
        radius="md"
      >
        {detailTarget && (
          <div>
            {/* Banner header */}
            <div className="bg-gradient-to-r h-20 mx-auto flex items-center mb-10 from-blue-600 to-blue-500 rounded-t-md px-6 pt-6 pb-10 relative">
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
                  <p className="text-white text-lg font-semibold leading-tight">{detailTarget.name}</p>
                  <p className="text-blue-100 text-xs mt-0.5">Position Details</p>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="px-6 -mt-5 space-y-3 pb-5">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 space-y-3">
                <div >
                  <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">Description</p>
                  <p className="text-sm text-gray-700 mt-0.5">{detailTarget.description || '—'}</p>
                </div>
                <Divider />
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">Direct Reports</p>
                    <p className="text-sm text-gray-700 mt-0.5 font-semibold">{detailTarget.children?.length ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-medium tracking-wide">Reports To</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {detailTarget.parentId
                        ? flat.find(p => p.id === detailTarget.parentId)?.name ?? '—'
                        : <Badge color="blue" variant="light" size="sm">Root</Badge>
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <Group grow gap="xs">
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  onClick={() => { setDetailTarget(null); handleEdit(detailTarget); }}
                >
                  Edit
                </Button>
                <Button
                  variant="light"
                  color="green"
                  size="sm"
                  onClick={() => { setDetailTarget(null); handleAddChild(detailTarget); }}
                >
                  Add Child
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  onClick={() => { setDetailTarget(null); handleDeleteRequest(detailTarget); }}
                >
                  Delete
                </Button>
              </Group>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
