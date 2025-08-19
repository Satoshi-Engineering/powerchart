<template>
  <UPopover @update:open="onOpen">
    <UButton
      icon="i-lucide-arrow-big-up"
      color="neutral"
      variant="link"
      class="cursor-pointer"
    >
      {{ $t('feedback.buttonCta') }}
    </UButton>

    <template #content>
      <div class="max-w-sm p-4 px-4">
        <div v-if="success">
          <TypoHeadline level="h4">
            {{ $t('feedback.success.headline') }}
          </TypoHeadline>
          <TypoParagraph>
            <I18nT
              keypath="feedback.success.message"
              for="feedback.success.githubLink"
            >
              <ULink
                :to="config.public.githubUrl"
                target="_blank"
              >
                {{ $t('feedback.success.githubLink') }}
              </ULink>
            </I18nT>
          </TypoParagraph>
        </div>
        <UForm
          v-else
          :schema="formSchema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <TypoParagraph>
            {{ $t('feedback.form.headline') }}
          </TypoParagraph>

          <UFormField name="contact">
            <UInput
              v-model="state.contact"
              :placeholder="$t('feedback.form.contact.placeholder')"
              class="w-full"
              :disabled="sending"
            />
          </UFormField>

          <UFormField name="message">
            <UTextarea
              ref="messageTextarea"
              v-model="state.message"
              :placeholder="$t('feedback.form.message.placeholder')"
              class="w-full"
              :disabled="sending"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="sending"
          >
            {{ $t('feedback.form.buttonSend') }}
          </UButton>
        </UForm>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { FeedbackFormDto } from '~~/shared/data/FeedbackFormDto'

import z from 'zod'

const config = useRuntimeConfig()
const { t } = useI18n()

const messageTextarea = ref()
function onOpen(open: boolean) {
  if (!open) {
    return
  }

  // wait until the popover has finished rendering
  nextTick(() => {
    messageTextarea.value?.textareaRef.focus()
  })
}

const formSchema = FeedbackFormDto.extend({
  message: z.string().min(3, t('feedback.form.message.minCharacters')),
})
type FormSchema = z.output<typeof formSchema>

const state = reactive<FormSchema>({
  contact: undefined,
  message: '',
})

const sending = ref(false)
const success = ref(false)

async function onSubmit() {
  sending.value = true
  await $fetch('/api/send-feedback', {
    method: 'POST',
    body: state,
  })
  success.value = true
}
</script>
