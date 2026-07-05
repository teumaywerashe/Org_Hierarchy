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
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconPlus,
  IconRefresh,
  IconAlertCircle,
  IconBuilding,
  IconX,
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

  const formPositions = editTarget
    ? flat.filter((p) => p.id !== editTarget.id)
    : flat;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Group gap="sm">
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
            <Tooltip label="Refresh" withArrow>
              <ActionIcon variant="light" onClick={loadData} loading={loading} size="lg">
                <IconRefresh size={16} />
              </ActionIcon>
            </Tooltip>
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
            {loading && <Loader size="xs" />}
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
              onDelete={setDeleteTarget}
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
        title={
          <Group gap="xs">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">
                {detailTarget?.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="font-semibold text-gray-800">{detailTarget?.name}</span>
          </Group>
        }
        centered
        size="sm"
      >
        {detailTarget && (
          <div className="space-y-3 py-1">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Name</Text>
              <Text size="sm" fw={500}>{detailTarget.name}</Text>
            </div>
            <Divider />
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Description</Text>
              <Text size="sm">{detailTarget.description || '—'}</Text>
            </div>
            <Divider />
          
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>Children</Text>
              <Text size="sm">{detailTarget.children?.length ?? 0} direct report(s)</Text>
            </div>
            <Group mt="sm" gap="xs">
              <Button size="xs" variant="light" onClick={() => { setDetailTarget(null); handleEdit(detailTarget); }}>
                Edit
              </Button>
              <Button size="xs" variant="light" color="green" onClick={() => { setDetailTarget(null); handleAddChild(detailTarget); }}>
                Add Child
              </Button>
              <Button size="xs" variant="light" color="red" onClick={() => { setDetailTarget(null); setDeleteTarget(detailTarget); }}>
                Delete
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
}
