"use client";

import {
  Badge,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import { IconBuilding, IconPlus } from "@tabler/icons-react";

import OrgTree from "@/components/OrgTree";
import { Position } from "@/types/position";

interface HomePageContentProps {
  flat: Position[];
  tree: Position[];
  loading: boolean;
  onAddPosition: () => void;
  onEditPosition: (position: Position) => void;
  onDeletePosition: (position: Position) => void;
  onAddChild: (position: Position) => void;
  onOpenDetail: (position: Position) => void;
}

export default function HomePageContent({
  flat,
  tree,
  loading,
  onAddPosition,
  onEditPosition,
  onDeletePosition,
  onAddChild,
  onOpenDetail,
}: HomePageContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="mx-auto max-w-7xl px-4 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-md border-b border-gray-200 bg-white px-4 py-6 shadow-sm border-r-amber-400">
          <Group gap="sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <IconBuilding size={20} color="white" />
            </div>
            <div>
              <Title order={3} className="leading-tight text-gray-900">
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
              onClick={onAddPosition}
            >
              Add Position
            </Button>
          </Group>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
            className="hidden bg-white sm:block"
          >
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
              Status
            </Text>
            <Badge color="green" size="lg" variant="light">
              Active
            </Badge>
          </Paper>
        </div>

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
                onClick={onAddPosition}
              >
                Add First Position
              </Button>
            </Center>
          ) : (
            <OrgTree
              data={tree}
              onEdit={onEditPosition}
              onDelete={onDeletePosition}
              onAddChild={onAddChild}
              onDetail={onOpenDetail}
            />
          )}
        </Paper>
      </main>
    </div>
  );
}
