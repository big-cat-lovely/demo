import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { cloneProject } from '../domain/project/storage';
import { sampleProject } from '../domain/project/sampleProject';
import { useProjectStore } from '../state/projectStore';

function resetStore() {
  window.localStorage.clear();
  useProjectStore.setState({
    project: cloneProject(sampleProject),
    activeModule: 'materials',
    selectedMaterialId: null,
    selectedEntityId: null,
    selectedRelationId: null,
    filters: { search: '', tag: '', entityType: 'all' },
    notice: null
  });
}

describe('App MVP flows', () => {
  beforeEach(() => resetStore());

  it('creates a material and shows it in the editor', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '新建素材' }));

    expect(screen.getByDisplayValue('新素材')).toBeTruthy();
  });

  it('shows missing material reference after deleting a referenced material', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '删除' }));

    expect(screen.getByText('missing_entity_material_ref')).toBeTruthy();
  });

  it('shows invalid control relation when relation endpoints violate constraints', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '关系' }));
    fireEvent.change(screen.getByLabelText('来源'), { target: { value: 'entity:resource-ember' } });
    fireEvent.change(screen.getByLabelText('目标'), { target: { value: 'entity:faction-aurora' } });

    expect(screen.getByText('invalid_control_relation')).toBeTruthy();
  });
});
