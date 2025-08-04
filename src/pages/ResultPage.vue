<template>
  <v-sheet class="pa-5 mb-5 bg-background-light elevation-10 rounded-xl">
    <h2 class="text-center mb-3 text-primary">Результаты</h2>
    <h3 class="text-center">Кто кому и сколько должен</h3>
  </v-sheet>
  <v-sheet
    variant="tonal"
    class="result-content pa-4 mb-5 elevation-10 rounded-xl bg-background-dark"
  >
    <div class="d-flex flex-column ga-4">
      <v-card
        v-for="(debtorList, person) in debts"
        class="bg-background-light mb-5 pa-3 rounded-xl"
        :key="person"
      >
        <v-card-title class="text-center rounded-xl text-primary font-weight-bold">
          {{ person }} должен:
        </v-card-title>
        <p
          v-if="debtorList.length === 0"
          class="text-center font-weight-bold"
        >
          Никому он ничего не должен!
        </p>
        <div
          v-else
          class="d-flex flex-column"
        >
          <div
            v-for="debt in debtorList"
            :key="debt.debtor"
            class="text-center font-weight-bold align-center"
          >
            <span>{{ debt.debtor }} - {{ debt.amount.toFixed(2) }}</span>
            <v-icon
              icon="mdi-currency-rub"
              size="small" 
            />
          </div>
        </div>
      </v-card>
    </div>
  </v-sheet>
  <v-row justify="center">
    <v-col cols="auto">
      <v-btn
        color="primary"
        @click="router.push('/')"
      > 
        На главную 
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useDishStore } from '@/stores/DishStore';
import { usePersonStore } from '@/stores/PersonStore';

const router = useRouter();
const debts = reactive({});

const calculate = () => {
  const DishStore = useDishStore();
  const PersonStore = usePersonStore();

  if (!DishStore.dishes.length || !PersonStore.persons.length) {
    return {};
  }

  // имена пользователей
  const persons = PersonStore.persons.map((person) => person.name);
  const dishes = DishStore.dishes;

  const debts = {};
  /* 
      для каждого пользователя формируется свойство в debts, которое хранит кто кому сколько должен, например:
      {
      'Marina': { 'Anna': 0, 'Liza': 0 }
      'Anna': { 'Marina': 0, 'Liza': 0 }
      'Liza': { 'Marina': 0, 'Anna': 0 }
      }
      */
  persons.forEach((person) => {
    debts[person] = {};
    persons.forEach((other) => {
      if (person !== other) {
        debts[person][other] = 0;
      }
    });
  });

  //  вычисление долгов
  dishes.forEach((dish) => {
    const { price, payer, users } = dish;

    // доля долга
    const share = price / users.length;

    users.forEach((user) => {
      if (user.name !== payer.name) {
        // если пользователь не плательщик, то увеличиваем долг
        debts[user.name][payer.name] += share;
      }
    });
  });

  // упрощение долгов
  const result = {};

  persons.forEach((person) => {
    result[person] = [];
    persons.forEach((other) => {
      if (person !== other) {
        const amount = Math.min(debts[person][other], debts[other][person]);
        debts[person][other] -= amount;
        debts[other][person] -= amount;

        // если долг остался добавление информации в результат
        if (debts[person][other] > 0) {
          // если вдруг массив не существует
          if (!result[person]) {
            result[person] = [];
          }

          result[person].push({
            // должник
            debtor: other,
            // сумма долга
            amount: debts[person][other],
          });
        }
      }
    });
  });

  return result;
};

const calculatedDebts = calculate();
Object.assign(debts, calculatedDebts);
</script>
