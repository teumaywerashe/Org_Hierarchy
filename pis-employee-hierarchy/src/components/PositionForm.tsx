'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextInput, Textarea, Select, Button, Stack, Title } from '@mantine/core';
import { Position, CreatePositionPayload } from '@/types/position';

const schema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Min 2 characters'),
  description: yup.string().default(''),
  parentId: yup.string().nullable().default(null),
});

type FormValues = {
  name: string;
  description: string;
  parentId: string | null;
};

interface Props {
  positions: Position[];
  editTarget?: Position | null;
  onSubmit: (data: CreatePositionPayload) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function PositionForm({ positions, editTarget, onSubmit, onCancel, loading }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '', parentId: null },
  });

  useEffect(() => {
    if (editTarget) {
      reset({
        name: editTarget.name,
        description: editTarget.description || '',
        parentId: editTarget.parentId || null,
      });
    } else {
      reset({ name: '', description: '', parentId: null });
    }
  }, [editTarget, reset]);

  const parentOptions = positions
    .filter((p) => p.id !== editTarget?.id)
    .map((p) => ({ value: p.id, label: p.name }));

  const parentValue = watch('parentId');

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      name: data.name,
      description: data.description,
      parentId: data.parentId || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack gap="md">
        <Title order={4} className="text-gray-700">
          {editTarget ? 'Edit Position' : 'New Position'}
        </Title>

        <TextInput
          label="Position Name"
          placeholder="e.g. Chief Executive Officer"
          error={errors.name?.message}
          {...register('name')}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe the role responsibilities..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* <Select
          label="Reports To (Parent Position)"
          placeholder="Select parent position (leave empty for root)"
          data={parentOptions}
          value={parentValue}
          onChange={(val) => setValue('parentId', val)}
          clearable
          searchable
          error={errors.parentId?.message}
        /> */}

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">
            {editTarget ? 'Update Position' : 'Create Position'}
          </Button>
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
        </div>
      </Stack>
    </form>
  );
}
