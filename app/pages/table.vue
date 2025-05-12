<template>
  <UContainer class="py-10">
    <div class="flex-1 flex flex-col items-center overflow-hidden">
      <div
        v-if="showLoadingAnimation"
        class="flex-1 grid justify-center content-center"
      >
        <AnimatedLoadingWheel />
      </div>
      <div
        v-else-if="showContent && currentDateIso != null && loadingFailed.includes(currentDateIso)"
        class="flex-1 grid justify-center content-center text-red-600"
      >
        {{ $t('errors.loadingPricesFailed') }}
      </div>
      <div
        v-else-if="showContent"
        class="
          w-full max-w-lg mx-auto
          h-screen min-h-[550px] max-h-[800px]
          py-1 pr-2
          grid grid-cols-[40px_1fr_1fr_1fr] gap-0.5 text-sm
        "
      >
        <TableHeaderItem />
        <TableHeaderItem>
          {{ currentDate.minus({ days: 1 }).toFormat('dd. LL.') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ currentDate.toFormat('dd. LL.') }}
        </TableHeaderItem>
        <TableHeaderItem>
          {{ currentDate.plus({ days: 1 }).toFormat('dd. LL.') }}
        </TableHeaderItem>
        <template
          v-for="(price, index) in prices"
          :key="index"
        >
          <div class="flex items-center justify-end pr-3 text-right">
            {{ String(price.hour).padStart(2, '0') }}
          </div>
          <TablePriceItem
            :price="addFixedCostsAndVat(price.pricePrev)"
            :is-current-hour="
              currentDate.minus({ days: 1 }).toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            :threshold-lowest="addFixedCostsAndVat(-8)"
            :threshold-low="addFixedCostsAndVat(5)"
            :threshold-mid="addFixedCostsAndVat(10)"
            :threshold-high="addFixedCostsAndVat(15)"
            :threshold-highest="addFixedCostsAndVat(25)"
          >
            {{ price.pricePrev.toFixed(2) }}
          </TablePriceItem>
          <TablePriceItem
            :price="addFixedCostsAndVat(price.price)"
            :is-current-hour="
              currentDate.toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            :threshold-lowest="addFixedCostsAndVat(-8)"
            :threshold-low="addFixedCostsAndVat(5)"
            :threshold-mid="addFixedCostsAndVat(10)"
            :threshold-high="addFixedCostsAndVat(15)"
            :threshold-highest="addFixedCostsAndVat(25)"
          >
            {{ price.price.toFixed(2) }}
          </TablePriceItem>
          <TablePriceItem
            v-if="currentDate.plus({ days: 1 }) <= maxDate"
            :price="addFixedCostsAndVat(price.priceNext)"
            :is-current-hour="
              currentDate.plus({ days: 1 }).toISODate() === DateTime.now().toISODate()
                && DateTime.now().toFormat('H') === String(price.hour)
            "
            :threshold-lowest="addFixedCostsAndVat(-8)"
            :threshold-low="addFixedCostsAndVat(5)"
            :threshold-mid="addFixedCostsAndVat(10)"
            :threshold-high="addFixedCostsAndVat(15)"
            :threshold-highest="addFixedCostsAndVat(25)"
          >
            {{ price.priceNext.toFixed(2) }}
          </TablePriceItem>
          <div v-else />
        </template>
      </div>
      <div class="relative w-full flex my-4 px-2 justify-center">
        <button
          class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 mx-2 py-2 px-4 rounded-l disabled:opacity-50"
          :disabled="!prevDateValid || (currentDateIso != null && loadingPrices.includes(currentDateIso))"
          @click="selectPrevDate"
        >
          {{ type === 'xs' ? '<' : $t('components.datepicker.previous') }}
        </button>
        <label class="bg-gray-300 py-2 px-4">
          <input
            type="date"
            class="bg-transparent outline-none"
            :value="currentDateIso"
            :min="(minDate.toISODate() as string)"
            :max="(maxDate.toISODate() as string)"
            @change="selectDate"
          >
        </label>
        <button
          class="bg-gray-300 hover:enabled:bg-gray-400 text-gray-800 mx-2 py-2 px-4 rounded-r disabled:opacity-50"
          :disabled="!nextDateValid || (currentDateIso != null && loadingPrices.includes(currentDateIso))"
          @click="selectNextDate"
        >
          {{ type === 'xs' ? '>' : $t('components.datepicker.next') }}
        </button>
      </div>
      <div class="w-full flex flex-col justify-start my-4 px-2">
        <label class="block">
          <input
            type="checkbox"
            :checked="addVat"
            @change="addVat = !addVat"
          >
          {{ $t('pages.table.addVat') }}
        </label>
        <label class="mt-4 flex flex-col">
          {{ $t('pages.table.fixedCosts') }}
          <input
            type="number"
            class="border py-1 px-2"
            :value="fixedCosts"
            @input="updateFixedCosts"
          >
        </label>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { computed, watchEffect, ref, onBeforeMount, onBeforeUnmount, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const { type } = useBreakpoints()
const { loading, showLoadingAnimation, showContent } = useDelayedLoadingAnimation(500, true)
const {
  loadForDateIso, loading: loadingPrices, loadingFailed,
  priceForDate,
} = useElectricityPrices()

const minDate = ref(DateTime.fromISO('2023-01-01').startOf('day'))
const maxDate = computed(() => {
  const dateTomorrow = DateTime.now().endOf('day').plus({ days: 1 })
  if (priceForDate(dateTomorrow, 'EPEX') === 0) {
    return DateTime.now().endOf('day')
  }
  return dateTomorrow
})

const {
  currentDate, currentDateIso,
  selectDate, selectPrevDate, selectNextDate,
  prevDateValid, nextDateValid,
} = useDatePicker(minDate, maxDate)

watchEffect(() => {
  if (currentDateIso.value == null) {
    return
  }
  loading.value = loadingPrices.value.includes(currentDateIso.value)
})
watchEffect(() => {
  if (currentDateIso.value == null) {
    return
  }
  loadForDateIso(currentDateIso.value)
  const dateIsoPrev = currentDate.value.minus({ days: 1 }).toISODate()
  if (dateIsoPrev != null) {
    loadForDateIso(dateIsoPrev)
  }
  const dateIsoNext = currentDate.value.plus({ days: 1 }).toISODate()
  if (dateIsoNext != null) {
    loadForDateIso(dateIsoNext)
  }
})

const prices = computed(() => {
  const prices = []
  for (let hour = 0; hour < 24; hour++) {
    prices.push({
      hour,
      pricePrev: priceForDate(currentDate.value.minus({ days: 1 }).set({ hour }), 'EPEX'),
      price: priceForDate(currentDate.value.set({ hour }), 'EPEX'),
      priceNext: priceForDate(currentDate.value.plus({ days: 1 }).set({ hour }), 'EPEX'),
    })
  }
  return prices
})

/////
// form elements
const route = useRoute()

const addVat = ref(false)
onMounted(() => {
  if (route.query.vat === 'true') {
    addVat.value = true
  }
})
watch(addVat, () => {
  const url = new URL(location.href)
  if (addVat.value) {
    url.searchParams.set('vat', 'true')
  } else {
    url.searchParams.delete('vat')
  }
  history.replaceState(null, '', url.toString())
})

const fixedCosts = ref<string>('')
onMounted(() => {
  const fixedCostsFromUrl = route.query.fixedCosts
  if (fixedCostsFromUrl != null && !isNaN(Number(fixedCostsFromUrl))) {
    fixedCosts.value = String(fixedCostsFromUrl)
  }
})
const updateFixedCosts = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (isNaN(Number(target.value))) {
    fixedCosts.value = ''
  } else {
    fixedCosts.value = target.value
  }
}
watch(fixedCosts, () => {
  const url = new URL(location.href)
  if (fixedCosts.value === '') {
    url.searchParams.delete('fixedCosts')
  } else {
    url.searchParams.set('fixedCosts', fixedCosts.value)
  }
  history.replaceState(null, '', url.toString())
})

const getFixedCosts = () => {
  if (fixedCosts.value !== '' && !isNaN(Number(fixedCosts.value))) {
    return Number(fixedCosts.value)
  }
  return 0
}

const addFixedCostsAndVat = (price: number) => {
  let priceWithFixedCosts = price + getFixedCosts()

  if (addVat.value) {
    priceWithFixedCosts *= 1.2
  }
  return priceWithFixedCosts
}

/////
// reload data after one hour
const currentHour = DateTime.now().toFormat('yyyy-LL-dd HH')
const reconnectOnVisibilityChange = () => {
  if (
    document.visibilityState !== 'visible'
    || DateTime.now().toFormat('yyyy-LL-dd HH') === currentHour
  ) {
    return
  }
  location.reload()
}
onBeforeMount(() => {
  document.addEventListener('visibilitychange', reconnectOnVisibilityChange)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', reconnectOnVisibilityChange)
})
</script>
