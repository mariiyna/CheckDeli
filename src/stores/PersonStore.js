import { defineStore } from 'pinia';
import { useWarningStore } from '@/stores/WarningStore';
export const usePersonStore = defineStore('PersonStore', {
  state: () => ({
    persons: [],
  }),

  actions: {
    loadPersonsFromStorage() {
      const storedPersons = localStorage.getItem('persons');
      if (storedPersons) {
        this.persons.push(...JSON.parse(storedPersons));
      }
    },

    addPerson(person) {
      if (
        this.persons.some(
          (existingPerson) => existingPerson.name === person.name,
        )
      ) {
        const WarningStore = useWarningStore();
        WarningStore.showWarning('Имена совпадают! Добавьте различий!');
        return;
      }
      this.persons.push(person);
      localStorage.setItem('persons', JSON.stringify(this.persons));
    },

    deletePerson(id) {
      const idx = this.persons.findIndex((user) => user.id === id);
      if (idx !== -1) {
        this.persons.splice(idx, 1);
        localStorage.setItem('persons', JSON.stringify(this.persons));
      }
    },
  },
});
