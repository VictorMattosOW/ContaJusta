import { UserSelectionStore } from './user-selection.store';
import { User } from 'app/core/models/user.model';

const userA: User = { id: 'a', name: 'Ana' };
const userB: User = { id: 'b', name: 'Bruno' };

describe('UserSelectionStore', () => {
  let store: UserSelectionStore;

  beforeEach(() => {
    store = new UserSelectionStore();
  });

  it('inicia sem seleção', () => {
    expect(store.selectedUsers()).toEqual([]);
    expect(store.hasUserSelected()).toBe(false);
  });

  it('select substitui a seleção (não acumula)', () => {
    store.select([userA]);
    store.select([userA, userB]);
    expect(store.selectedUsers()).toEqual([userA, userB]);
  });

  it('select([]) desmarca tudo', () => {
    store.select([userA]);
    store.select([]);
    expect(store.selectedUsers()).toEqual([]);
    expect(store.hasUserSelected()).toBe(false);
  });

  it('hasUserSelected é derivado da seleção', () => {
    store.select([userA]);
    expect(store.hasUserSelected()).toBe(true);
    store.reset();
    expect(store.hasUserSelected()).toBe(false);
  });
});